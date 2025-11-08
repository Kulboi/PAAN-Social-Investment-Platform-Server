import { 
  IsNotEmpty, 
  MinLength, 
  IsOptional, 
  IsString, 
  IsDateString, 
  IsEnum,
  IsObject,
  IsArray
} from 'class-validator';

import { GenderTypes, UserTypes } from '../user.enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  lga?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @IsOptional()
  @IsEnum(GenderTypes, { message: 'Gender must be either "MALE" or "FEMALE"' })
  gender?: GenderTypes;

  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsOptional()
  @IsObject()
  credentials?: {
    nin?: string,
    bvn?: string
  }

  @IsOptional()
  @IsEnum(UserTypes, { message: 'Role must be either "USER" or "ADMIN"' })
  role?: UserTypes
}

export class ChangePasswordDto {
  @IsNotEmpty() 
  @MinLength(6) 
  currentPassword: string;

  @IsNotEmpty() 
  @MinLength(6) 
  newPassword: string;
}