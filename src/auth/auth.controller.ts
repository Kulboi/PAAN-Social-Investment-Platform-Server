import { Controller, Post, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';

import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { ResendOTPDto, UserVerificationDto } from './dto/user-verification-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto): Promise<any> {
    return await this.authService.register(payload);
  }

  @Patch('resend-otp')
  async resendOTP(@Body() payload: ResendOTPDto): Promise<any> {
    return await this.authService.resendOTP(payload.email);
  }

  @Post('verify-user')
  async verifyUser(@Body() payload: UserVerificationDto): Promise<any> {
    return await this.authService.verifyUser(payload.email, payload.otp);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshToken(@Req() req) {
    const { userId, refreshToken } = req.user;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
