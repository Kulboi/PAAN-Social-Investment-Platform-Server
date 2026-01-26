import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowRequestDto {
  @IsNotEmpty() 
  @IsUUID() 
  follower_id: string;

  @IsNotEmpty()
  @IsUUID() 
  following_id: string;
}

export class FollowResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the follow relationship',
  })
  follower_id: string;

  @ApiProperty({
    description: 'Unique identifier for the user being followed',
  })
  following_id: string;

  @ApiProperty({
    description: 'Status of the follow relationship',
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp when the follow relationship was created',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the follow relationship was last updated',
  })
  updated_at: Date;
}
