import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { MailerService } from '../common/utils/mailer.service';

import { User } from '../user/entities/user.entity';
import { Verification } from './entities/verification.entity';

import { generateOTP } from '../common/utils/functions';

import {
  RegisterDto,
  LoginDto,
  GoogleAuthDTO,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { stat } from 'fs';

@Injectable()
export class AuthService {
  private mockTokens = new Map<string, string>();
  private jwtExpirationTime = '1h';
  private refreshTokenExpirationTime = '1d';

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Verification) private readonly verificationRepo: Repository<Verification>,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
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

    return { 
      message: 'User registered successfully and OTP sent',
      data: { 
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email 
      }, 
    };
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

    if (verification.otp !== otp)
      throw new UnauthorizedException('Invalid OTP');

    if (verification.expiresAt < new Date())
      throw new UnauthorizedException('OTP expired');

    user.is_verified = true;
    await this.userRepo.save(user);
    await this.verificationRepo.remove(verification);

    const userLogin = await this.signInLogic(user);

    return { 
      ...userLogin, 
      message: 'User verified successfully' 
    };
  }

  private async signInLogic(user: User) {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.jwtExpirationTime,
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: this.refreshTokenExpirationTime,
      },
    );
    const hashedRt = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(user.id, { hashedRt });

    return {
      data: { 
        access_token: token,
        refresh_token: refreshToken,
      },
      message: 'Login successful',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userLogin = await this.signInLogic(user);
    return userLogin;
  }

  async googleAuth(dto: GoogleAuthDTO) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (user) {
      const userLogin = await this.signInLogic(user);
      return userLogin;
    } else {
      const newUser = this.userRepo.create({
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        profile_image: dto.photo,
        is_verified: true,
      });

      await this.userRepo.save(newUser);
      const userLogin = await this.signInLogic(newUser);
      return {
        ...userLogin,
        isNewUser: true,
      };
    }
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Invalid Refresh Token');

    const newAccessToken = this.jwtService.sign({ sub: user.id },
      { 
        expiresIn: this.jwtExpirationTime, 
        secret: process.env.JWT_SECRET 
      },
    );
    const newRefreshToken = this.jwtService.sign({ sub: user.id },
      { 
        secret: process.env.REFRESH_TOKEN_SECRET, 
        expiresIn: this.refreshTokenExpirationTime 
      },
    );

    const hashedRt = await bcrypt.hash(newRefreshToken, 10);
    await this.userRepo.update(user.id, { hashedRt });

    return { 
      access_token: newAccessToken, 
      refresh_token: newRefreshToken 
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    const token = Math.random().toString(36).substring(0, 6);
    this.mockTokens.set(token, user.email);
    await this.mailerService.sendOTP(user.email, token);

    return { message: 'Reset token sent to email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = this.mockTokens.get(dto.token);
    if (!email) throw new NotFoundException('Invalid or expired token');

    const user = await this.userRepo.findOne({ where: { email } });
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    this.mockTokens.delete(dto.token);

    return { message: 'Password reset successful' };
  }
}
