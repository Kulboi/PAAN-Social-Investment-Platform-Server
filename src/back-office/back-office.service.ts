import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import { MailerService } from 'src/common/utils/mailer.service';

import { BackOfficeUser } from './entities/back-office-user.entity';
import { User } from 'src/user/entities/user.entity';
import { TokenBlacklist } from 'src/auth/entities/token-blacklist.entity';

import { CreateBackOfficeUserRequestDto } from './dto/create-back-office-user-request.dto';
import { LoginBackOfficeUserRequestDto } from './dto/login-back-office-user-request.dto';
import { RefreshBackOfficeUserTokenDto } from './dto/refresh-back-office-user-token.dto';
import { FetchSystemUsersRequestDto } from './dto/system-users.dto';
import { ForgotBackOfficeUserPasswordDto, ForgotBackOfficeUserPasswordResponseDto } from './dto/forgot-back-office-user-password.dto';
import { ResetBackOfficeUserPasswordRequestDto, ResetBackOfficeUserPasswordResponseDto } from './dto/reset-back-office-user-password.dto';
import { ChangeBackOfficeUserRequestDto, ChangeBackOfficeUserResponseDto } from './dto/change-back-office-user-password.dto';
import { UpdateBackOfficeUserRequestDto, UpdateBackOfficeUserResponseDto } from './dto/update-back-office-user.dto';

@Injectable()
export class BackOfficeService {
  private jwtExpirationTime = '1h';
  private refreshTokenExpirationTime = '1d';
  private mockTokens = new Map<string, string>();

  constructor(
    @InjectRepository(BackOfficeUser)
    private readonly backOfficeUserRepo: Repository<BackOfficeUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepo: Repository<TokenBlacklist>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
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

    if (!findBackOfficeUser || !(await bcrypt.compare(payload.password, findBackOfficeUser.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const backOfficeUserPayload = {
      sub: findBackOfficeUser.id, 
      email: findBackOfficeUser.email, 
      role: findBackOfficeUser.role 
    };
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

  async logoutBackOfficeUser(userId: string, accessToken: string) {
    const backOfficeUser = await this.backOfficeUserRepo.findOneBy({ id: userId });

    if (!backOfficeUser) {
      throw new NotFoundException('Back office user not found');
    }

    await this.backOfficeUserRepo.update(userId, { hashedRt: null });

    const decoded = this.jwtService.decode(accessToken) as any;
    if (decoded && decoded.exp) {
      await this.tokenBlacklistRepo.save({
        token: accessToken,
        userId: userId,
        expires_at: new Date(decoded.exp * 1000),
      });
    }

    return { message: 'Logged out successfully' };
  }

  async refreshToken(payload: RefreshBackOfficeUserTokenDto) {
    const backOfficeUser = await this.backOfficeUserRepo.findOneBy({ id: payload.user_id });

    if (!backOfficeUser || !backOfficeUser.hashedRt) {
      throw new NotFoundException('Back office user not found');
    }

    const rtMatches = await bcrypt.compare(payload.refresh_token, backOfficeUser.hashedRt);

    if (!rtMatches) {
      throw new BadRequestException('Invalid refresh token');
    }

    const backOfficeUserPayload = { sub: backOfficeUser.id, email: backOfficeUser.email, role: backOfficeUser.role };
    const token = this.jwtService.sign(backOfficeUserPayload, {
      expiresIn: this.jwtExpirationTime,
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = this.jwtService.sign(
      { id: backOfficeUser.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: this.refreshTokenExpirationTime,
      },
    );
    const hashedRt = await bcrypt.hash(refreshToken, 10);
    await this.backOfficeUserRepo.update(backOfficeUser.id, { hashedRt });

    return {
      data: {
        access_token: token,
        refresh_token: refreshToken,
      },
    };
  }

  async ForgotPassword(payload: ForgotBackOfficeUserPasswordDto): Promise<ForgotBackOfficeUserPasswordResponseDto> {
    // find user by email
    const backOfficeUser = await this.backOfficeUserRepo.findOne({ where: { email: payload.email } });

    // if user not found, throw NotFoundException
    if (!backOfficeUser) {
      throw new NotFoundException('Back office user not found');
    }

    // generate password reset token
    const token = crypto.randomBytes(3).toString('hex'); // 6 hex characters (alphanumeric: 0-9, a-f)
    this.mockTokens.set(token, backOfficeUser.email);

    // send password reset email
    await this.mailerService.sendForgotPasswordRequestToken(backOfficeUser.email, token);

    // return response dto
    return { message: 'Password reset link has been sent to your email' };
  }

  async resetBackOfficeUserPassword(payload: ResetBackOfficeUserPasswordRequestDto): Promise<ResetBackOfficeUserPasswordResponseDto> {
    // verify token
    const email = this.mockTokens.get(payload.token);
    if (!email) {
      throw new NotFoundException('Invalid or expired token');
    }

    // find user by email
    const backOfficeUser = await this.backOfficeUserRepo.findOne({ where: { email } });

    // if user not found, throw NotFoundException
    if (!backOfficeUser) {
      throw new NotFoundException('Back office user not found');
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(payload.new_password, 10);

    // update user's password
    backOfficeUser.password = hashedPassword;
    await this.backOfficeUserRepo.save(backOfficeUser);

    // invalidate token
    this.mockTokens.delete(payload.token);

    return { message: 'Password reset successful' };
  }

  async changeBackOfficeUserPassword(payload: ChangeBackOfficeUserRequestDto, email: string): Promise<ChangeBackOfficeUserResponseDto> {
    const backOfficeUser = await this.backOfficeUserRepo.findOne({ where: { email } });
    if (!backOfficeUser) {
      throw new NotFoundException('Back office user not found');
    }
    backOfficeUser.password = await bcrypt.hash(payload.new_password, 10);
    await this.backOfficeUserRepo.save(backOfficeUser);

    return { message: 'Password change successful' };
  }

  async getBackOfficeUserById(id: string) {
    const backOfficeUser = await this.backOfficeUserRepo.findOneBy({ id });

    if (!backOfficeUser) {
      throw new NotFoundException('Back office user not found');
    }

    return {
      id: backOfficeUser.id,
      first_name: backOfficeUser.first_name,
      last_name: backOfficeUser.last_name,
      email: backOfficeUser.email,
      username: backOfficeUser.username,
      role: backOfficeUser.role,
      is_active: backOfficeUser.is_active,
    };
  }

  async updateBackOfficeUserInfo(id: string, updateData: UpdateBackOfficeUserRequestDto): Promise<UpdateBackOfficeUserResponseDto> {
    const backOfficeUser = await this.backOfficeUserRepo.findOneBy({ id });

    if (!backOfficeUser) {
      throw new NotFoundException('Back office user not found');
    }

    Object.assign(backOfficeUser, updateData);
    const updatedBackOfficeUser = await this.backOfficeUserRepo.save(backOfficeUser);

    return {
      id: updatedBackOfficeUser.id,
      first_name: updatedBackOfficeUser.first_name,
      last_name: updatedBackOfficeUser.last_name,
      email: updatedBackOfficeUser.email,
      username: updatedBackOfficeUser.username,
    };
  }

  async getRegisteredUsers(payload: FetchSystemUsersRequestDto): Promise<User[]> {
    const users = await this.userRepository.find({
      skip: (payload.page - 1) * payload.limit,
      take: payload.limit,
    });
    return users;
  }

  async getRegisteredUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async searchRegisteredUsers(keyword: string): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.first_name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('user.last_name ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('user.email ILIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();

    return users;
  }

  async updateRegisteredUserInfo(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deactivateRegisteredUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.is_active = false;
    await this.userRepository.save(user);
  }

  async activateRegisteredUser(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.is_active = true;
    await this.userRepository.save(user);
  }
}
