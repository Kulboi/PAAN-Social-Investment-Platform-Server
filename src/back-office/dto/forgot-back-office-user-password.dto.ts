import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotBackOfficeUserPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ForgotBackOfficeUserPasswordResponseDto {
  @IsString()
  message: string;
}