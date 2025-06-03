import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty() first_name: string;
  @IsNotEmpty() last_name: string;
  @IsNotEmpty() address: string;
  @IsNotEmpty() lga: string;
  @IsNotEmpty() state: string;
  @IsNotEmpty() phone: string;
  @IsNotEmpty() credentials: {
    nin: string,
    bvn: string
  }
}

export class ChangePasswordDto {
  @IsNotEmpty() @MinLength(6) currentPassword: string;
  @IsNotEmpty() @MinLength(6) newPassword: string;
}