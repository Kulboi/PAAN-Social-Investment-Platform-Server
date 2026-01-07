import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CompaniesService } from './companies.service';

import { FetchCompanyDto } from './dto/fetch-company.dto';

import { Company } from './entities/company.entity';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Companies')
@Controller('/api/v1/companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ 
    status: 200,
    description: 'List of companies retrieved successfully.',
    type: [FetchCompanyDto],
  })
  async getCompanies(): Promise<Company[]> {
    return this.companiesService.getCompanies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({
    status: 200,
    description: 'Company retrieved successfully.',
    type: FetchCompanyDto,
  })
  async getCompany(@Param('id') id: string): Promise<Company> {
    return this.companiesService.getCompany(id);
  }
}
