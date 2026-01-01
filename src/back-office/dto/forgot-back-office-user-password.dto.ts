import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotBackOfficeUserPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotBackOfficeUserPasswordResponseDto {
  @ApiProperty()
  @IsString()
  message: string;
}