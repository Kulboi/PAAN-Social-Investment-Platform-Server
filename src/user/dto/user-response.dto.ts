import { ApiProperty } from '@nestjs/swagger';

import { UserTypes } from '../user.enums';

export class UserResponseDto {
  @ApiProperty({ description: 'Unique user ID' })
  id: string;

  @ApiProperty({ description: 'user first name' })
  first_name: string;

  @ApiProperty({ description: 'user middle name' })
  middle_name: string;

  @ApiProperty({ description: 'user last name' })
  last_name: string;

  @ApiProperty({ description: 'user email' })
  email: string;

  @ApiProperty({ description: 'user username' })
  username: string;

  @ApiProperty({ description: 'user bio' })
  bio: string;

  @ApiProperty({ description: 'user address' })
  address: string;

  @ApiProperty({ description: 'user lga' })
  lga: string;

  @ApiProperty({ description: 'user state' })
  state: string;

  @ApiProperty({ description: 'user phone' })
  phone: string;

  @ApiProperty({ description: 'user country' })
  country: string;

  @ApiProperty({ description: 'user gender' })
  gender: string;

  @ApiProperty({ description: 'user date_of_birth' })
  date_of_birth: Date;

  @ApiProperty({ description: 'user profile_image' })
  profile_image: string;

  @ApiProperty({ description: 'user is_verified' })
  is_verified: boolean;

  @ApiProperty({ description: 'user is_verified', example: { nin: '123456789', bvn: '123456789' } })
  credentials: {
    nin: string,
    bvn: string
  };

  @ApiProperty({ description: 'user role' })
  role: UserTypes;
}