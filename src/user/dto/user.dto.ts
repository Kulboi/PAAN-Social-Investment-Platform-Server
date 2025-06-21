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
  @IsEnum(["MALE", "FEMALE"], { message: 'Gender must be either "MALE" or "FEMALE"' })
  gender?: "MALE" | "FEMALE";

  @IsOptional()
  @IsString()
  profile_image?: string;

  @IsOptional()
  @IsObject()
  credentials?: {
    nin?: string,
    bvn?: string
  }
}

export class ChangePasswordDto {
  @IsNotEmpty() 
  @MinLength(6) 
  currentPassword: string;

  @IsNotEmpty() 
  @MinLength(6) 
  newPassword: string;
}