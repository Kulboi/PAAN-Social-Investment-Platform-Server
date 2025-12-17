import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class LoginBackOfficeUserRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}
