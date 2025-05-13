import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty() first_name: string;
  @IsNotEmpty() last_name: string;
  @IsEmail() email: string;
  @MinLength(6) password: string;
  @IsNotEmpty() phone_number: string;
  @IsNotEmpty() address: string;
  @IsNotEmpty() lga: string;
  @IsNotEmpty() state: string;
  @IsNotEmpty() nin: string;
  @IsNotEmpty() bvn: string;
}