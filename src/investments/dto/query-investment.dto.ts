import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { InvestmentCategory } from '../entities/investment-categories.entity';

import { InvestmentRiskLevel, InvestmentStatus } from './create-investment.dto';

export class QueryInvestmentDto {
  @ApiPropertyOptional({ description: 'Search by title or description', example: 'real estate' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category', example: 'Real Estate' })
  @IsOptional()
  @IsString()
  category?: InvestmentCategory;

  @ApiPropertyOptional({ description: 'Filter by status', enum: InvestmentStatus, example: InvestmentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(InvestmentStatus)
  status?: InvestmentStatus;

  @ApiPropertyOptional({ description: 'Filter by risk level', enum: InvestmentRiskLevel, example: InvestmentRiskLevel.MEDIUM })
  @IsOptional()
  @IsEnum(InvestmentRiskLevel)
  riskLevel?: InvestmentRiskLevel;

  @ApiPropertyOptional({ description: 'Filter by country', example: 'Nigeria' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Filter by state', example: 'Lagos' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Filter by city', example: 'Victoria Island' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Minimum targeted amount', example: 100000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum targeted amount', example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Minimum expected return percentage', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minReturn?: number;

  @ApiPropertyOptional({ description: 'Maximum expected return percentage', example: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  maxReturn?: number;

  @ApiPropertyOptional({ description: 'Filter by creator ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  creatorId?: string;

  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Sort order', example: 'DESC', default: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
