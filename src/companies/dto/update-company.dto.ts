import { IsNotEmpty, MinLength, IsOptional, IsBoolean, IsEmail, IsPhoneNumber } from "class-validator";

export class UpdateCompanyDto {
  @IsOptional()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  address?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  website?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(10)
  logo_url?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(7)
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(7)
  @IsEmail()
  official_email?: string;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}