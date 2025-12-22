import { Controller, Post, Body, UseGuards, Patch, Param, Req, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { BackOfficeService } from './back-office.service';
import { InvestmentCategoriesService } from 'src/investment-categories/investment-categories.service';
import { InvestmentsService } from 'src/investments/investments.service';
import { CompaniesService } from 'src/companies/companies.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';

import { CreateBackOfficeUserRequestDto } from './dto/create-back-office-user-request.dto';
import { CreateBackOfficeUserResponseDto } from './dto/create-back-office-user-response.dto';
import { LoginBackOfficeUserRequestDto } from './dto/login-back-office-user-request.dto';
import { CreateInvestmentCategoryDto } from 'src/investment-categories/dto/create-investment-category.dto';
import { UpdateInvestmentCategoryDto } from 'src/investment-categories/dto/update-investment-category.dto';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { UpdateCompanyDto } from 'src/companies/dto/update-company.dto';
import { CreateInvestmentDto } from 'src/investments/dto/create-investment.dto';
import { InvestmentResponseDto } from 'src/investments/dto/investment-response.dto';
import { FetchSystemUsersRequestDto } from './dto/system-users.dto';

@ApiBearerAuth()
@Controller('back-office')
@ApiTags('Back Office')
export class BackOfficeController {
  constructor(
    private readonly backOfficeService: BackOfficeService,
    private readonly investmentCategoriesService: InvestmentCategoriesService,
    private readonly investmentsService: InvestmentsService,
    private readonly companiesService: CompaniesService,
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
  register(@Body() payload: CreateBackOfficeUserRequestDto) {
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
  login(@Body() payload: LoginBackOfficeUserRequestDto) {
    return this.backOfficeService.loginBackOfficeUser(payload);
  }

  @Get('refresh-token')
  @ApiOperation({ summary: 'Refresh back office user JWT token' })
  @ApiResponse({
    status: 200,
    description: 'The JWT token has been successfully refreshed.',
    type: CreateBackOfficeUserResponseDto,
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  refreshToken(@Req() req) {
    // Implementation goes here
    return this.backOfficeService.refreshToken({
      user_id: req.user.id,
      refresh_token: req.user.refresh_token,
    });
  }

  @Post('create-company')
  @ApiOperation({ summary: 'Create company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async createCompany(@Body() payload: CreateCompanyDto) {
    return this.companiesService.createCompany(payload);
  }

  @Patch('update-company')
  @ApiOperation({ summary: 'Update company' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'Company updated successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateCompany(@Param('id') id: string, @Body() payload: UpdateCompanyDto) {
    return this.companiesService.updateCompany(id, payload);
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

  @Patch('update-investment-category')
  @ApiOperation({ summary: 'Update investment category' })
  @ApiBody({ type: CreateInvestmentCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Investment category updated successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateInvestmentCategory(@Body() payload: UpdateInvestmentCategoryDto) {
    return this.investmentCategoriesService.updateInvestmentCategory(payload);
  }

  @Post('create-investment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new investment' })
  @ApiResponse({ status: 201, description: 'Investment created successfully', type: InvestmentResponseDto })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  createInvestment(@Body() payload: CreateInvestmentDto) {
    return this.investmentsService.create(payload);
  }

  @Get('get-registered-users')
  @ApiOperation({ summary: 'Get registered users' })
  @ApiResponse({
    status: 200,
    description: 'List of registered users retrieved successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  getRegisteredUsers(@Query() query: FetchSystemUsersRequestDto) {
    return this.backOfficeService.getRegisteredUsers(query);
  }
}
