import {
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @IsOptional()
  @MinLength(2)
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @IsOptional()
  @MinLength(10)
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @ApiPropertyOptional()
  address?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @ApiPropertyOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @ApiPropertyOptional()
  @IsUrl()
  logo_url?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(7)
  @IsPhoneNumber()
  @ApiPropertyOptional()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(7)
  @IsEmail()
  @ApiPropertyOptional()
  official_email?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  is_verified?: boolean;
}
