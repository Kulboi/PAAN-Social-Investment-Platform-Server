import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';

import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { QueryInvestmentDto } from './dto/query-investment.dto';
import { InvestmentResponseDto, InvestmentDetailsDto } from './dto/investment-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { InvestmentStatus } from './dto/create-investment.dto';

@ApiTags('Investments')
@Controller('api/v1/investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all investments with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Investments retrieved successfully' })
  async findAll(@Query() queryDto: QueryInvestmentDto): Promise<InvestmentResponseDto> {
    return this.investmentsService.findAll(queryDto);
  }

  @Get('featured')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get featured investments' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of featured investments' })
  @ApiResponse({ status: 200, description: 'Featured investments retrieved successfully', type: [InvestmentDetailsDto] })
  async getFeaturedInvestments(@Query('limit') limit?: number): Promise<InvestmentDetailsDto[]> {
    return this.investmentsService.getFeaturedInvestments(limit);
  }

  @Get('my-investments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my investments' })
  @ApiResponse({ status: 200, description: 'User investments retrieved successfully', type: [InvestmentDetailsDto] })
  async getMyInvestments(@Request() req: any): Promise<InvestmentDetailsDto[]> {
    return this.investmentsService.findByOwner(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get investment by ID' })
  @ApiParam({ name: 'id', description: 'Investment ID', type: Number })
  @ApiResponse({ status: 200, description: 'Investment retrieved successfully', type: InvestmentDetailsDto })
  async findOne(@Param('id') id: string): Promise<InvestmentDetailsDto> {
    return this.investmentsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update investment status' })
  @ApiParam({ name: 'id', description: 'Investment ID', type: Number })
  @ApiResponse({ status: 200, description: 'Investment status updated successfully', type: InvestmentDetailsDto })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: InvestmentStatus,
    @Request() req: any,
  ): Promise<InvestmentDetailsDto> {
    return this.investmentsService.updateStatus(id, status, req.user.id);
  }
}
