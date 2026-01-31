import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Wallet } from './../wallet/entities/wallet.entity';
import * as crypto from 'crypto';

import { MailerService } from '../common/utils/mailer.service';

import { User } from '../user/entities/user.entity';
import { Verification } from './entities/verification.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { TokenBlacklist } from 'src/auth/entities/token-blacklist.entity';

import { AuthTypes } from '../user/user.enums';
import { NotificationTypes } from 'src/notifications/notifications.enum';

import { generateOTP } from '../common/utils/functions';

import {
  RegisterDto,
  LoginDto,
  GoogleAuthDTO,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private mockTokens = new Map<string, string>();
  private jwtExpirationTime = '1h';
  private refreshTokenExpirationTime = '1d';

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepo: Repository<Verification>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepo: Repository<TokenBlacklist>,

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

    if (user.role !== 'ADMIN') {
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

      const notification = this.notificationRepo.create({
        user,
        title: 'Welcome to Paan!',
        description:
          'Thank you for registering. Please verify your email to get started.',
        type: NotificationTypes.WELCOME,
      });
      await this.notificationRepo.save(notification);

      await this.mailerService.sendOTP(user.email, otp);
    }

    return {
      message: `${user.role === 'ADMIN' ? 'Admin' : 'User'} registered successfully${user.role !== 'ADMIN' ? ' and verification sent to email' : ''}`,
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
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

    // Create user wallet
    const wallet = this.walletRepo.create({ user: { id: user.id } });
    await this.walletRepo.save(wallet);

    // sign in
    const userLogin = await this.encryptUserTokensAndSaveHash(user);

    return {
      ...userLogin,
      message: 'User verified successfully',
    };
  }

  private async encryptUserTokensAndSaveHash(user: User) {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.jwtExpirationTime,
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
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
        isVerified: user.is_verified,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) throw new NotFoundException('User not found');

    if (user.auth_type === AuthTypes.EMAIL) {
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new BadRequestException('Invalid credentials');
      }
    }

    return this.encryptUserTokensAndSaveHash(user);
  }

  async googleAuthCallback() {
    return { message: 'Google auth successful' };
  }

  async googleAuth(dto: GoogleAuthDTO) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (user) {
      const userLogin = await this.encryptUserTokensAndSaveHash(user);
      return userLogin;
    } else {
      const newUser = this.userRepo.create({
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        profile_image: dto.profile_image,
        is_verified: true,
        auth_type: AuthTypes.SOCIAL,
        google_auth_details: JSON.stringify(dto),
      });

      await this.userRepo.save(newUser);
      const userLogin = await this.encryptUserTokensAndSaveHash(newUser);
      return {
        data: {
          ...userLogin.data,
          isNewUser: true,
        },
        message: 'Login successful',
      };
    }
  }

  async refreshTokens(payload: RefreshTokenDto) {
    const user = await this.userRepo.findOne({ where: { id: payload.userId } });
    if (!user) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(payload.refreshToken, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Invalid Refresh Token');

    const newAccessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        expiresIn: this.jwtExpirationTime,
        secret: process.env.JWT_SECRET,
      },
    );
    const newRefreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: this.refreshTokenExpirationTime,
      },
    );

    const hashedRt = await bcrypt.hash(newRefreshToken, 10);
    await this.userRepo.update(user.id, { hashedRt });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    const token = crypto.randomBytes(3).toString('hex'); // 6 hex characters (alphanumeric: 0-9, a-f)
    this.mockTokens.set(token, user.email);

    await this.mailerService.sendForgotPasswordRequestToken(user.email, token);

    return { description: 'Reset token sent to email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const email = this.mockTokens.get(dto.token);
    if (!email) throw new NotFoundException('Invalid or expired token');

    const user = await this.userRepo.findOne({ where: { email } });
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    this.mockTokens.delete(dto.token);

    return { description: 'Password reset successful' };
  }

  async checkIfTokenBlacklisted(token: string): Promise<boolean> {
    const isBlacklisted = await this.tokenBlacklistRepo.findOne({
      where: { token },
    });
    return !!isBlacklisted;
  }

  async logout(userId: string, accessToken: string) {
    try {
      const user = await this.userRepo.update(userId, { hashedRt: null });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepo.update(userId, { hashedRt: null });

      const decoded = this.jwtService.decode(accessToken) as any;
      if (decoded && decoded.exp) {
        await this.tokenBlacklistRepo.save({
          token: accessToken,
          userId: userId,
          expires_at: new Date(decoded.exp * 1000),
        });
      }
      return { description: 'Logout successful' };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
