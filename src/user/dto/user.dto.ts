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
import { ApiProperty } from '@nestjs/swagger';

import { GenderTypes, UserTypes } from '../user.enums';

export class UpdateUserDto {
  @ApiProperty({ description: 'user first name' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ description: 'user middle name' })
  @IsOptional()
  @IsString()
  middle_name?: string;

  @ApiProperty({ description: 'user last name' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ description: 'user email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'user username' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'user bio' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'user country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'user address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'user lga' })
  @IsOptional()
  @IsString()
  lga?: string;

  @ApiProperty({ description: 'user state' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'user phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'user interests' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiProperty({ description: 'user date_of_birth' })
  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @ApiProperty({ description: 'user gender', example: 'MALE' })
  @IsOptional()
  @IsEnum(GenderTypes, { message: 'Gender must be either "MALE" or "FEMALE"' })
  gender?: GenderTypes;

  @ApiProperty({ description: 'user profile_image' })
  @IsOptional()
  @IsString()
  profile_image?: string;

  @ApiProperty({ description: 'user credentials', example: { nin: '123456789', bvn: '123456789' } })
  @IsOptional()
  @IsObject()
  credentials?: {
    nin?: string,
    bvn?: string
  }
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'current password' })
  @IsNotEmpty() 
  @MinLength(6) 
  currentPassword: string;

  @ApiProperty({ description: 'new password' })
  @IsNotEmpty() 
  @MinLength(6) 
  newPassword: string;
}