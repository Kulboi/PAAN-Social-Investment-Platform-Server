import { IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

  export class GetFollowingRequestDto {
  @ApiProperty({
    description: 'Unique identifier for the user whose following list is being retrieved',
  })
  @IsNotEmpty() 
  @IsUUID() 
  user_id: string;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    description: 'Number of items per page for pagination',
    required: false,
  })
  @IsOptional()
  limit: number;
}

export class GetFollowingResponseDataDto {
  @ApiProperty({
    description: 'Unique identifier for the user whose following list is being retrieved',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty() 
  @IsUUID() 
  id: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  last_name: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'I0Nt2@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Profile image URL of the user',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  profile_image?: string;

  @ApiProperty({
    description: 'Timestamp when the user was followed',
    example: '2022-01-01T00:00:00.000Z',
    type: Date,
  })
  followed_at: Date;
}

export class GetFollowingResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user whose followers are being retrieved',
  })
  @IsNotEmpty() 
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'List of followers',
  })
  following: Array<GetFollowingResponseDataDto>;
}