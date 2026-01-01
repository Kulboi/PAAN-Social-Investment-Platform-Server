import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetBackOfficeUserPasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  new_password: string;
}

export class ResetBackOfficeUserPasswordResponseDto {
  @IsString()
  message: string;
}