import { Controller, Post, Patch, Body, UseGuards, Req, Get, HttpCode, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { RegisterDto, LoginDto, LoginResponseDto, GoogleAuthDTO, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { ResendOTPDto, UserVerificationDto } from './dto/user-verification-dto';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/callback')
  @ApiOperation({ summary: 'Google login' })
  // @ApiBody({ 
  //   type: GoogleAuthDTO,
  //   schema: {
  //     properties: {
  //       token: { type: 'string' },
  //     },
  //   },
  // })
  @ApiResponse({ 
    status: 200, 
    type: Object,
  })
  async googleLogin(@Req() payload): Promise<any> {
    console.log({googlePayload: payload});
    // return await this.authService.googleAuth(payload);
    return { data: { access_token: 'test', refresh_token: 'test' } };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 200, 
    type: Object,
  })
  async register(@Body() payload: RegisterDto): Promise<any> {
    return await this.authService.register(payload);
  }

  @Patch('resend-otp')
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiResponse({ 
    status: 200, 
    type: Object,
  })
  async resendOTP(@Body() payload: ResendOTPDto): Promise<any> {
    return await this.authService.resendOTP(payload.email);
  }

  @Post('verify-user')
  @ApiOperation({ summary: 'Verify user' })
  @ApiResponse({ 
    status: 200, 
    type: Object,
  })
  async verifyUser(@Body() payload: UserVerificationDto): Promise<any> {
    return await this.authService.verifyUser(payload.email, payload.otp);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    type: Object,
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(dto);
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ 
    status: 200, 
    type: Object,
  })
  async refreshToken(@Req() req) {
    const { id, refreshToken } = req.user;
    return await this.authService.refreshTokens({ userId: id, refreshToken });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Intiate password reset' })
  @ApiResponse({ 
    status: 200, description: 'Reset token sent to email', 
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ 
    status: 200, description: 'Password reset successful', 
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log user out' })
  @ApiResponse({ 
    status: 200, description: 'Logout successful', 
  })
  async logout(@Req() req) {
    return await this.authService.logout(req.user.id, req.user.token);
  }
}
