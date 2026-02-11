import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'user first name' })
  @IsNotEmpty() first_name: string;

  @ApiProperty({ description: 'user last name' })
  @IsNotEmpty() last_name: string;

  @ApiProperty({ description: 'user email' })
  @IsEmail() email: string;

  // @ApiProperty({ description: 'user username' })
  @IsOptional() role?: string;

  @ApiProperty({ description: 'user password' })
  @MinLength(6) password: string;
}

export class LoginDto {
  @ApiProperty({ description: 'user email' })
  @IsEmail() email: string;

  @ApiProperty({ description: 'user password' })
  @MinLength(6) password: string;
}

export class TokenResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refresh_token: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Authenticated user data' })
  data: TokenResponseDto;

  @ApiProperty({ description: 'Login success message' })
  message: string;
}

export class GoogleAuthDTO {
  @ApiProperty({ description: 'Google ID token' })
  @IsNotEmpty() token: string;

  @ApiProperty({ description: 'Google user ID' })
  @IsNotEmpty() id: string;

  @ApiProperty({ description: 'Google user email' })
  @IsNotEmpty() email: string;

  @ApiProperty({ description: 'Google user first name' })
  @IsNotEmpty() first_name: string;

  @ApiProperty({ description: 'Google user last name' })
  @IsNotEmpty() last_name: string;

  @ApiProperty({ description: 'Google user profile image URL' })
  @IsOptional() profile_image?: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'user email' })
  @IsEmail() email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'password reset token' })
  @IsNotEmpty() token: string;

  @ApiProperty({ description: 'new password' })
  @MinLength(6) newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'current password' })
  @IsNotEmpty() currentPassword: string;

  @ApiProperty({ description: 'new password' })
  @MinLength(6) newPassword: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'user ID' })
  @IsNotEmpty() userId: string;

  @ApiProperty({ description: 'refresh token' })
  @IsNotEmpty() refreshToken: string;
}