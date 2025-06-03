import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { RegisterDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { ResendOTPDto, UserVerificationDto } from './dto/user-verification-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto): Promise<any> {
    return await this.authService.register(payload);
  }

  @Post('resend-otp')
  async resendOTP(@Body() payload: ResendOTPDto): Promise<any> {
    return await this.authService.resendOTP(payload.email);
  }

  @Post('user-verify')
  async verifyUser(@Body() payload: UserVerificationDto): Promise<any> {
    return await this.authService.verifyUser(payload.email, payload.otp);
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
