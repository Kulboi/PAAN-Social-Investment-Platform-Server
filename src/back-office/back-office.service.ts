import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { BackOfficeUser } from './entities/back-office-user.entity';

import { CreateBackOfficeUserRequestDto } from './dto/create-back-office-user-request.dto';
import { LoginBackOfficeUserRequestDto } from './dto/login-back-office-user-request.dto';

@Injectable()
export class BackOfficeService {
  private jwtExpirationTime = '1h';
  private refreshTokenExpirationTime = '1d';

  constructor(
    @InjectRepository(BackOfficeUser)
    private readonly backOfficeUserRepo: Repository<BackOfficeUser>,
    private readonly jwtService: JwtService,
  ) {}

  async createBackOfficeUser(payload: CreateBackOfficeUserRequestDto) {
    // check if user exists
    const userExists = await this.backOfficeUserRepo.findOneBy({
      email: payload.email,
    });

    if (userExists) {
      throw new ConflictException('Back office user with this email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // create back office user
    const backOfficeUser = this.backOfficeUserRepo.create({
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      username: payload?.username,
      password: hashedPassword,
      role: payload?.role,
    });

    const createdBackOfficeUser = await this.backOfficeUserRepo.save(backOfficeUser);
    return {
      id: createdBackOfficeUser.id,
      first_name: createdBackOfficeUser.first_name,
      last_name: createdBackOfficeUser.last_name,
      email: createdBackOfficeUser.email,
      username: createdBackOfficeUser.username,
      role: createdBackOfficeUser.role,
      is_active: createdBackOfficeUser.is_active,
    };
  }

  async loginBackOfficeUser(payload: LoginBackOfficeUserRequestDto) {
    const findBackOfficeUser = await this.backOfficeUserRepo.findOneBy({
      email: payload.email,
    });

    if (!findBackOfficeUser) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      findBackOfficeUser.password,
    );

    if (!findBackOfficeUser || !(await bcrypt.compare(payload.password, findBackOfficeUser.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const backOfficeUserPayload = { id: findBackOfficeUser.id, email: findBackOfficeUser.email, role: findBackOfficeUser.role };
    const token = this.jwtService.sign(backOfficeUserPayload, {
      expiresIn: this.jwtExpirationTime,
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = this.jwtService.sign(
      { id: findBackOfficeUser.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: this.refreshTokenExpirationTime,
      },
    );
    const hashedRt = await bcrypt.hash(refreshToken, 10);
    await this.backOfficeUserRepo.update(findBackOfficeUser.id, { hashedRt });

    return {
      data: {
        access_token: token,
        refresh_token: refreshToken,
      },
    };
  }
}
