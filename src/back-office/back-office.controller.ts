import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { BackOfficeService } from './back-office.service';
import { InvestmentCategoriesService } from 'src/investment-categories/investment-categories.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';

import { CreateBackOfficeUserRequestDto } from './dto/create-back-office-user-request.dto';
import { CreateBackOfficeUserResponseDto } from './dto/create-back-office-user-response.dto';
import { LoginBackOfficeUserRequestDto } from './dto/login-back-office-user-request.dto';
import { CreateInvestmentCategoryDto } from 'src/investment-categories/dto/create-investment-category.dto';

@ApiBearerAuth()
@Controller('back-office')
@ApiTags('Back Office')
export class BackOfficeController {
  constructor(
    private readonly backOfficeService: BackOfficeService,
    private readonly investmentCategoriesService: InvestmentCategoriesService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register back office user' })
  @ApiBody({ type: CreateBackOfficeUserRequestDto })
  @ApiResponse({
    status: 201,
    description: 'The back office user has been successfully created.',
    type: CreateBackOfficeUserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Back office user with this email already exists',
  })
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
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async login(@Body() payload: LoginBackOfficeUserRequestDto) {
    return this.backOfficeService.loginBackOfficeUser(payload);
  }

  @Post('create-investment-category')
  @ApiOperation({ summary: 'Create investment category' })
  @ApiBody({ type: CreateInvestmentCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Investment category created successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async createInvestmentCategory(@Body() payload: CreateInvestmentCategoryDto) {
    return this.investmentCategoriesService.createInvestmentCategory(payload);
  }

  @Post('create-investment')
  @ApiOperation({ summary: 'Create investment' })
  @ApiResponse({
    status: 201,
    description: 'Investment created successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async createInvestment() {
    // Implementation goes here
  }
}
