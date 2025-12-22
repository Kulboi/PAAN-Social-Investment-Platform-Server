import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FetchSystemUsersRequestDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
  })
  page: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Number of items per page for pagination',
    example: 10,
  })
  limit: number;
}