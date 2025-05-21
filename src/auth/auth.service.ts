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

    // hash password
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashed,
      is_verified: false,
    });

    // save user
    await this.userRepo.save(user);

    // generate otp
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // save verification
    const verification = this.verificationRepo.create({
      user,
      otp,
      expiresAt,
    });
    await this.verificationRepo.save(verification);
    await this.mailerService.sendOTP(user.email, otp);

    return { message: 'User registered successfully and OTP sent' };
  }

  async resendOTP(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const verification = await this.verificationRepo.findOneBy({ user });
    if (!verification) throw new NotFoundException('Verification not found');

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    verification.otp = otp;
    verification.expiresAt = expiresAt;
    await this.verificationRepo.save(verification);
    await this.mailerService.sendOTP(user.email, otp);

    return { message: 'OTP resent successfully' };
  }

  async verifyUser(email: string, otp: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    const verification = await this.verificationRepo.findOneBy({ user });
    if (!verification) throw new NotFoundException('Verification not found');

    if (verification.otp !== otp) throw new UnauthorizedException('Invalid OTP');

    if (verification.expiresAt < new Date()) throw new UnauthorizedException('OTP expired');

    user.is_verified = true;
    await this.userRepo.save(user);

    return { message: 'User verified successfully' };
  }
}
