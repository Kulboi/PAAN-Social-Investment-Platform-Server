import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { InvestmentCategory } from '../entities/investment-categories.entity';

import { InvestmentRiskLevel, InvestmentStatus } from './create-investment.dto';


export class InvestmentDetailsDto {
  @ApiProperty({ description: 'Unique investment ID', example: 1 })
  id: string;

  @ApiProperty({ description: 'Investment title', example: 'Real Estate Development Project' })
  title: string;

  @ApiProperty({ description: 'Investment description', example: 'A luxury residential development in the heart of the city' })
  description: string;

  @ApiProperty({ description: 'Creator user ID', example: 1 })
  creator_id: string;

  @ApiProperty({ description: 'Array of image URLs', example: ['https://example.com/image1.jpg'] })
  images: string[];

  @ApiProperty({ description: 'Investment category', example: 'Real Estate' })
  category: InvestmentCategory;

  @ApiProperty({ description: 'Start date of the investment', example: '2024-01-01' })
  start_date: string;

  @ApiProperty({ description: 'End date of the investment', example: '2024-12-31' })
  end_date: string;

  @ApiProperty({ description: 'Current status of the investment', enum: InvestmentStatus, example: InvestmentStatus.ACTIVE })
  status: InvestmentStatus;

  @ApiProperty({ description: 'Country where investment is located', example: 'Nigeria' })
  country: string;

  @ApiProperty({ description: 'State where investment is located', example: 'Lagos' })
  state: string;

  @ApiPropertyOptional({ description: 'Local Government Area', example: 'Victoria Island' })
  lga?: string;

  @ApiProperty({ description: 'City where investment is located', example: 'Victoria Island' })
  city: string;

  @ApiProperty({ description: 'Full address of the investment', example: '123 Victoria Island, Lagos' })
  address: string;

  @ApiProperty({ description: 'Target amount to raise', example: 1000000 })
  targeted_amount: number;

  @ApiProperty({ description: 'Expected return percentage', example: 15 })
  expected_return: number;

  @ApiProperty({ description: 'Duration in months', example: 12 })
  duration: number;

  @ApiProperty({ description: 'Minimum investment amount', example: 10000 })
  minimum_investment: number;

  @ApiProperty({ description: 'Risk level of the investment', enum: InvestmentRiskLevel, example: InvestmentRiskLevel.MEDIUM })
  riskLevel: InvestmentRiskLevel;

  @ApiProperty({ description: 'Total amount raised so far', example: 500000 })
  totalRaised: number;

  @ApiProperty({ description: 'Percentage of target amount raised', example: 50 })
  percentageRaised: number;

  @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class InvestmentResponseDto {
  @ApiProperty({ description: 'Array of investments', type: [InvestmentDetailsDto] })
  investments: InvestmentDetailsDto[];

  @ApiProperty({ description: 'Total number of investments', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of investments per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;
}
