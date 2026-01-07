import { IsEmail, IsString, IsDate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetWaitlistDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsDate()
  created_at: Date;
}