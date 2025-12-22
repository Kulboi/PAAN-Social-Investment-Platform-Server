import { IsString, IsNumber, IsEnum, IsArray, IsOptional, IsDateString, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { InvestmentCategory } from '../entities/investment-categories.entity';

export enum InvestmentRiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum InvestmentStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

export class CreateInvestmentDto {
  @ApiProperty({ description: 'Investment title', example: 'Real Estate Development Project' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Investment description', example: 'A luxury residential development in the heart of the city' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Investment category', example: 'Real Estate' })
  @IsString()
  category: InvestmentCategory;

  @ApiProperty({ description: 'Start date of the investment', example: '2024-01-01' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: 'End date of the investment', example: '2024-12-31' })
  @IsDateString()
  end_date: string;

  @ApiProperty({ description: 'Creator ID of the investment', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsUUID()
  creator_id: string;

  @ApiProperty({ description: 'Country where investment is located', example: 'Nigeria' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'State where investment is located', example: 'Lagos' })
  @IsString()
  state: string;

  @ApiPropertyOptional({ description: 'Local Government Area', example: 'Victoria Island' })
  @IsOptional()
  @IsString()
  lga?: string;

  @ApiProperty({ description: 'City where investment is located', example: 'Victoria Island' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Full address of the investment', example: '123 Victoria Island, Lagos' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Target amount to raise', example: 1000000 })
  @IsNumber()
  @Min(1000)
  targeted_amount: number;

  @ApiProperty({ description: 'Expected return percentage', example: 15 })
  @IsNumber()
  @Min(1)
  @Max(100)
  expected_return: number;

  @ApiProperty({ description: 'Duration in months', example: 12 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Minimum investment amount', example: 10000 })
  @IsNumber()
  @Min(1000)
  minimum_investment: number;

  @ApiProperty({ description: 'Risk level of the investment', enum: InvestmentRiskLevel, example: InvestmentRiskLevel.MEDIUM })
  @IsEnum(InvestmentRiskLevel)
  riskLevel: InvestmentRiskLevel;

  @ApiPropertyOptional({ description: 'Array of image URLs', example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
