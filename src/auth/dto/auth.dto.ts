import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty() first_name: string;
  @IsNotEmpty() last_name: string;
  @IsEmail() email: string;
  @MinLength(6) password: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @MinLength(6) password: string;
}

export class GoogleAuthDTO {
  @IsNotEmpty() token: string;
  @IsNotEmpty() id: string;
  @IsNotEmpty() email: string;
  @IsNotEmpty() first_name: string;
  @IsNotEmpty() last_name: string;
  @IsNotEmpty() photo: string;
}

export class ForgotPasswordDto {
  @IsEmail() email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty() token: string;
  @MinLength(6) newPassword: string;
}