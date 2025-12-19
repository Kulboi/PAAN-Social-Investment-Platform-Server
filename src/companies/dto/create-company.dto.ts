import { IsNotEmpty, MinLength, IsOptional, IsBoolean, IsEmail, IsPhoneNumber, IsUrl } from "class-validator";

export class CreateCompanyDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

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
  @IsUrl()
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