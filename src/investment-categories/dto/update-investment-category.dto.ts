import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInvestmentCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ 
    description: 'Name of the investment category', 
    minLength: 3,
    example: 'Technology'
  })
  name: string;

  @IsOptional()
  @MinLength(10)
  @ApiPropertyOptional({ 
    description: 'Description of the investment category', 
    minLength: 1,
    example: 'This category includes technology-related investments.'
  })
  description?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ description: 'Icon email of the investment category', example: 'https://example.com/icon.png' })
  icon?: string;
}