import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
// import { JwtService } from '@nestjs/jwt';
// import { Credential } from '../user/entities/credential.entity';
// import { ForgotPasswordDto } from './dto/forgot-password.dto';
// import { ResetPasswordDto } from './dto/reset-password.dto';

import { MailerService } from '../common/utils/mailer.service';

import { User } from '../user/entities/user.entity';
import { Verification } from './entities/verification.entity';

import { generateOTP } from '../common/utils/functions';

@Injectable()
export class AuthService {
  // private mockTokens = new Map<string, string>();

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Verification) private readonly verificationRepo: Repository<Verification>,
    // @InjectRepository(Credential) private credRepo: Repository<Credential>,
    private readonly mailerService: MailerService
    // private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // check if user exists
    const userExists = await this.userRepo.findOneBy({ email: dto.email });
    if (userExists) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashed,
    });

    await this.userRepo.save(user);

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const verification = this.verificationRepo.create({
      user,
      otp,
      expiresAt,
    });
    await this.verificationRepo.save(verification);
    await this.mailerService.sendOTP(user.email, otp);

    return { message: 'User registered successfully' };
  }
}
