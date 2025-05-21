import { IsNotEmpty, IsEmail } from 'class-validator';

export class ResendOTPDto {
  @IsEmail() email: string;
}

export class UserVerificationDto {
  @IsEmail() email: string;
  @IsNotEmpty() otp: string;
}