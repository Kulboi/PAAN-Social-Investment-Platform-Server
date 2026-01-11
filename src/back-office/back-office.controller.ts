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
import { ForgotBackOfficeUserPasswordDto } from './dto/forgot-back-office-user-password.dto';
import { ResetBackOfficeUserPasswordRequestDto } from './dto/reset-back-office-user-password.dto';
import { ChangeBackOfficeUserRequestDto } from './dto/change-back-office-user-password.dto';
import { UpdateBackOfficeUserRequestDto } from './dto/update-back-office-user.dto';

@ApiBearerAuth()
@Controller('/api/v1/back-office')
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
    status: HttpStatus.CREATED,
    description: 'The back office user has been successfully created.',
    type: CreateBackOfficeUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Back office user with this email already exists',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
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
  login(@Body() payload: LoginBackOfficeUserRequestDto) {
    return this.backOfficeService.loginBackOfficeUser(payload);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout back office user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The back office user has been successfully logged out.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  logout(@Req() req) {
    return this.backOfficeService.logoutBackOfficeUser(req.user.id, req.user.access_token);
  }

  @Get('refresh-token')
  @ApiOperation({ summary: 'Refresh back office user JWT token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The JWT token has been successfully refreshed.',
    type: CreateBackOfficeUserResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  refreshToken(@Req() req) {
    return this.backOfficeService.refreshToken({
      user_id: req.user.id,
      refresh_token: req.user.refresh_token,
    });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot back office user password' })
  @ApiBody({ type: ForgotBackOfficeUserPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset link has been sent to your email.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  forgotPassword(@Body() payload: ForgotBackOfficeUserPasswordDto) {
    return this.backOfficeService.ForgotPassword(payload);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset back office user password' })
  @ApiBody({ type: ResetBackOfficeUserPasswordRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successful.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invalid or expired token' })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  resetPassword(@Body() payload: ResetBackOfficeUserPasswordRequestDto) {
    return this.backOfficeService.resetBackOfficeUserPassword(payload);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change back office user password' })
  @ApiBody({ type: ChangeBackOfficeUserRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password change successful.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async changePassword(@Body() payload: ChangeBackOfficeUserRequestDto, @Req() req) {
    return this.backOfficeService.changeBackOfficeUserPassword(payload, req.user.email);
  }

  @Get('users/me')
  @ApiOperation({ summary: 'Get back office user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Back office user retrieved successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Back office user not found' })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async getBackOfficeUserById(@Req() req) {
    return this.backOfficeService.getBackOfficeUserById(req.user.id);
  }

  @Patch('users/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update back office user info' })
  @ApiBody({ type: UpdateBackOfficeUserRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Back office user info updated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Back office user not found' })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateBackOfficeUserInfo(
    @Body() payload: UpdateBackOfficeUserRequestDto,
    @Req() req,
  ) {
    return this.backOfficeService.updateBackOfficeUserInfo(req.user.id, payload);
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

  @Post('investment-category/create')
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

  @Patch('investment-category/update')
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

  @Delete('investment-category/delete/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete investment category' })
  @ApiParam({ name: 'name', description: 'Investment Category Name', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Investment category deleted successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async deleteInvestmentCategory(@Param('name') name: string) {
    return this.investmentCategoriesService.deleteInvestmentCategory(name);
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
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
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
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async remove(@Param('id') id: string, @Request() req: any): Promise<{ message: string }> {
    return this.investmentsService.remove(id, req.user.id);
  }

  @Get('registered-users/list')
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

  @Get('registered-users/:id')
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

  @Get('registered-users/search')
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

  @Patch('registered-users/update/:id')
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

  @Get('registered-user/activate/:id')
  @ApiOperation({ summary: 'Activate registered user' })
  @ApiResponse({
    status: 200,
    description: 'Registered user activated successfully.',
  })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  activateRegisteredUser(@Param('id') id: string) {
    return this.backOfficeService.activateRegisteredUser(id);
  }

  @Get('registered-user/deactivate/:id')
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
