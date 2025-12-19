import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { InvestmentCategoriesService } from './investment-categories.service';

import { CreateInvestmentCategoryDto } from './dto/create-investment-category.dto';
import { UpdateInvestmentCategoryDto } from './dto/update-investment-category.dto';
import { FetchInvestmentCategoriesDto } from './dto/fetch-investment-categories.dto';

@ApiBearerAuth()
@ApiTags('Investment Categories')
@UseGuards(JwtAuthGuard)
@Controller('investment-categories')
export class InvestmentCategoriesController {
  constructor(private readonly investmentCategoriesService: InvestmentCategoriesService) {}

  @Get('get-investment-categories')
  @ApiOperation({ summary: 'Get investment categories' })
  @ApiResponse({ 
    status: 200,
    description: 'Investment categories retrieved successfully.',
    type: [CreateInvestmentCategoryDto],
  })
  async getInvestmentCategories() {
    return this.investmentCategoriesService.getInvestmentCategories();
  }

  @Post('update-investment-category')
  @ApiOperation({ summary: 'Update investment category' })
  @ApiBody({ type: FetchInvestmentCategoriesDto })
  @ApiResponse({ 
    status: 200,
    description: 'Investment category updated successfully.',
  })
  async updateInvestmentCategory(@Body() payload: UpdateInvestmentCategoryDto) {
    return this.investmentCategoriesService.updateInvestmentCategory(payload);
  }
}
