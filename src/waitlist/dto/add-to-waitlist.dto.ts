import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class AddToWaitlistDtoRequest {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  fullname: string;
}

export class AddToWaitlistDtoResponse {
  @ApiProperty()
  message: string;
}