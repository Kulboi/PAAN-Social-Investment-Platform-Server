import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOTPDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail() email: string;
}

export class UserVerificationDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail() email: string;
  
  @ApiProperty({ example: '123456' })
  @IsNotEmpty() otp: string;
}