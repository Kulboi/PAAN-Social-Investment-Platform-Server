import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class UpdateInvestmentCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsOptional()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsEmail()
  icon?: string;
}