import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddToWaitlistDtoRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  fullname: string;
}

export class AddToWaitlistDtoResponse {
  message: string;
}