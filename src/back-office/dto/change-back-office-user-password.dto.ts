import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeBackOfficeUserRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string;
}

export class ChangeBackOfficeUserResponseDto {
  @ApiProperty()
  @IsString()
  message: string;
}