import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutBackOfficeUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  token: string;
}

export class LogoutBackOfficeUserResponseDto {
  @ApiProperty()
  message: 'Successfully logged out';

  @ApiProperty()
  instructions: 'Please clear access and refresh tokens from client storage';
}