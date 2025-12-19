import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { BackOfficeService } from './back-office.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { CreateBackOfficeUserRequestDto } from './dto/create-back-office-user-request.dto';
import { CreateBackOfficeUserResponseDto } from './dto/create-back-office-user-response.dto';
import { LoginBackOfficeUserRequestDto } from './dto/login-back-office-user-request.dto';

@ApiBearerAuth()
@Controller('back-office')
@ApiTags('Back Office')
export class BackOfficeController {
  constructor(private readonly backOfficeService: BackOfficeService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register back office user' })
  @ApiBody({ type: CreateBackOfficeUserRequestDto })
  @ApiResponse({ 
    status: 201,
    description: 'The back office user has been successfully created.',
    type: CreateBackOfficeUserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Back office user with this email already exists' })
  async register(@Body() payload: CreateBackOfficeUserRequestDto) {
    return this.backOfficeService.createBackOfficeUser(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login back office user' })
  @ApiBody({ type: LoginBackOfficeUserRequestDto })
  @ApiResponse({ 
    status: 200,
    description: 'The back office user has been successfully logged in.',
    type: CreateBackOfficeUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @UseGuards(JwtAuthGuard)
  async login(@Body() payload: LoginBackOfficeUserRequestDto) {
    return this.backOfficeService.loginBackOfficeUser(payload);
  }
}
