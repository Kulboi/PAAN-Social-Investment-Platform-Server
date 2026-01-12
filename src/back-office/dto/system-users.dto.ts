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

  @IsOptional()
  @ApiProperty({
    description: 'Search query to filter users by name or email',
    example: 'john',
    required: false,
  })
  query?: string;
}

export class FetchSystemUserResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  first_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Middle name of the user',
    example: 'William',
    required: false,
  })
  middle_name?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Profile image URL of the user',
    example: 'https://example.com/images/johndoe.jpg',
    required: false,
  })
  profile_image?: string;
}