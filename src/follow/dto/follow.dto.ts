import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class FollowsRequestDto {
  @ApiProperty({
    description: 'Unique identifier for the user to follow/unfollow',
  })
  @IsNotEmpty()
  @IsUUID()
  account_id: string;
}

export class FollowAccountDto {
  @IsNotEmpty() 
  @IsUUID() 
  follower_id: string;

  @IsNotEmpty()
  @IsUUID() 
  following_id: string;
}

export class UnFollowAccountDto {
  @IsNotEmpty() 
  @IsUUID() 
  unfollower_id: string;

  @IsNotEmpty()
  @IsUUID() 
  unfollowing_id: string;
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

export class UnfollowResponseDto {
  @ApiProperty({
    description: 'Message indicating the result of the unfollow operation',
  })
  message: string;
}