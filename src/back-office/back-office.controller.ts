import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Req,
  Get,
  Query,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
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
import {
  FetchSystemUsersRequestDto,
  FetchSystemUserResponseDto,
} from './dto/system-users.dto';
import { UpdateInvestmentDto } from 'src/investments/dto/update-investment.dto';

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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login back office user' })
  @ApiBody({ type: LoginBackOfficeUserRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The back office user has been successfully logged in.',
    type: CreateBackOfficeUserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid credentials' })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  login(@Body() payload: LoginBackOfficeUserRequestDto) {
    return this.backOfficeService.loginBackOfficeUser(payload);
  }

  @Get('refresh-token')
  @ApiOperation({ summary: 'Refresh back office user JWT token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The JWT token has been successfully refreshed.',
    type: CreateBackOfficeUserResponseDto,
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req) {
    return this.backOfficeService.refreshToken({
      user_id: req.user.id,
      refresh_token: req.user.refresh_token,
    });
  }

  @Post('company/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Company created successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async createCompany(@Body() payload: CreateCompanyDto) {
    return this.companiesService.createCompany(payload);
  }

  @Patch('company/update/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update company' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company updated successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateCompany(
    @Param('id') id: string,
    @Body() payload: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, payload);
  }

  @Delete('company/delete/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete company' })
  @ApiParam({ name: 'id', description: 'Company ID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company deleted successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async deleteCompany(@Param('id') id: string) {
    return this.companiesService.deleteCompany(id);
  }

  @Post('create-investment-category')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create investment category' })
  @ApiBody({ type: CreateInvestmentCategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Investment category created successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async createInvestmentCategory(@Body() payload: CreateInvestmentCategoryDto) {
    return this.investmentCategoriesService.createInvestmentCategory(payload);
  }

  @Patch('update-investment-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update investment category' })
  @ApiBody({ type: CreateInvestmentCategoryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Investment category updated successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateInvestmentCategory(@Body() payload: UpdateInvestmentCategoryDto) {
    return this.investmentCategoriesService.updateInvestmentCategory(payload);
  }

  @Post('investment/create')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new investment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Investment created successfully',
    type: InvestmentResponseDto,
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  createInvestment(@Body() payload: CreateInvestmentDto) {
    return this.investmentsService.create(payload);
  }

  @Patch('investment/update/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update investment' })
  @ApiParam({ name: 'id', description: 'Investment ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Investment updated successfully',
    type: InvestmentResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    return this.investmentsService.update(id, updateInvestmentDto);
  }

  @Delete('investment/delete/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete investment' })
  @ApiParam({ name: 'id', description: 'Investment ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Investment deleted successfully' })
  async remove(@Param('id') id: string, @Request() req: any): Promise<{ message: string }> {
    return this.investmentsService.remove(id, req.user.id);
  }

  @Get('get-registered-users')
  @ApiOperation({ summary: 'Get registered users' })
  @ApiResponse({
    status: 200,
    description: 'List of registered users retrieved successfully.',
    type: [FetchSystemUserResponseDto],
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  getRegisteredUsers(@Query() query: FetchSystemUsersRequestDto) {
    return this.backOfficeService.getRegisteredUsers(query);
  }

  @Get('get-registered-user/:id')
  @ApiOperation({ summary: 'Get registered user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Registered user retrieved successfully.',
    type: FetchSystemUserResponseDto,
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  getRegisteredUserById(@Param('id') id: string) {
    return this.backOfficeService.getRegisteredUserById(id);
  }

  @Get('search-registered-users')
  @ApiOperation({ summary: 'Search registered users' })
  @ApiResponse({
    status: 200,
    description:
      'List of registered users matching the search keyword retrieved successfully.',
    type: [FetchSystemUserResponseDto],
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  searchRegisteredUsers(@Query('keyword') keyword: string) {
    return this.backOfficeService.searchRegisteredUsers(keyword);
  }

  @Patch('update-registered-user/:id')
  @ApiOperation({ summary: 'Update registered user status' })
  @ApiResponse({
    status: 200,
    description: 'Registered user status updated successfully.',
    type: FetchSystemUserResponseDto,
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  updateRegisteredUserStatus(@Param('id') id: string, @Body() payload) {
    return this.backOfficeService.updateRegisteredUserInfo(id, payload);
  }

  @Get('activate-registered-user/:id')
  @ApiOperation({ summary: 'Activate registered user' })
  @ApiResponse({
    status: 200,
    description: 'Registered user activated successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  activateRegisteredUser(@Param('id') id: string) {
    return this.backOfficeService.activateRegisteredUser(id);
  }

  @Get('deactivate-registered-user/:id')
  @ApiOperation({ summary: 'Deactivate registered user' })
  @ApiResponse({
    status: 200,
    description: 'Registered user deactivated successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  deactivateRegisteredUser(@Param('id') id: string) {
    return this.backOfficeService.deactivateRegisteredUser(id);
  }
}
