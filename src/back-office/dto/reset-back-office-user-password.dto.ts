import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetBackOfficeUserPasswordRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  new_password: string;
}

export class ResetBackOfficeUserPasswordResponseDto {
  @ApiProperty()
  @IsString()
  message: string;
}