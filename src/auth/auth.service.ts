import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt';
// import { Credential } from '../user/entities/credential.entity';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';

import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  // private mockTokens = new Map<string, string>();

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    // @InjectRepository(Credential) private credRepo: Repository<Credential>,
    // private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // check if user exists
    const userExists = await this.userRepo.findOneBy({ email: dto.email });
    if (userExists) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashed,
    });

    await this.userRepo.save(user);

    return { message: 'User registered successfully' };
  }
}
