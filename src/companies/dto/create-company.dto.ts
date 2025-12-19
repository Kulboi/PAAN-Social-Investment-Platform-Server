import { IsNotEmpty, MinLength, IsString, IsOptional, IsBoolean, IsEmail, IsPhoneNumber, IsUrl } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(10)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @IsUrl()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  @IsUrl()
  logo_url?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(7)
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(7)
  @IsEmail()
  official_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}