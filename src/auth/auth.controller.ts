import { Controller, Post, Patch, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RegisterDto, LoginDto, GoogleAuthDTO, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { ResendOTPDto, UserVerificationDto } from './dto/user-verification-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body() payload: GoogleAuthDTO): Promise<any> {
    return await this.authService.googleAuth(payload);
  }

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
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ 
    status: 200, 
    type: Object,
  })
  refreshToken(@Req() req) {
    const { userId, refreshToken } = req.user;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Intiate password reset' })
  @ApiResponse({ 
    status: 200, description: 'Reset token sent to email', 
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ 
    status: 200, description: 'Password reset successful', 
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log user out' })
  @ApiResponse({ 
    status: 200, description: 'Logout successful', 
  })
  logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }
}
