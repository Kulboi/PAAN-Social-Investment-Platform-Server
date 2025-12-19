import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { InvestmentCategoriesService } from './investment-categories.service';

import { CreateInvestmentCategoryDto } from './dto/create-investment-category.dto';

@ApiBearerAuth()
@ApiTags('Investment Categories')
@UseGuards(JwtAuthGuard)
@Controller('investment-categories')
export class InvestmentCategoriesController {
  constructor(private readonly investmentCategoriesService: InvestmentCategoriesService) {}

  @Post('create-investment-category')
  @ApiOperation({ summary: 'Create investment category' })
  @ApiBody({ type: CreateInvestmentCategoryDto })
  @ApiResponse({ 
    status: 201,
    description: 'Investment category created successfully.',
  })
  async createInvestmentCategory(@Body() payload: CreateInvestmentCategoryDto) {
    return this.investmentCategoriesService.createInvestmentCategory(payload);
  }
}
