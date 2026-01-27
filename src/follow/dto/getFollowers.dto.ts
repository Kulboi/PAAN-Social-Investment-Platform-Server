import { IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetFollowersRequestDto {
  @IsNotEmpty() 
  @IsUUID() 
  user_id: string;

  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}

export class GetFollowersResponseDto {
  @IsNotEmpty() 
  @IsUUID() 
  @ApiProperty({
    description: 'Unique identifier for the user whose followers are being retrieved',
  })
  user_id: string;

  @ApiProperty({
    description: 'List of followers',
  })
  followers: Array<{
    follower_id: string;
    following_id: string;
    status: string;
    created_at: Date;
    updated_at: Date;
  }>;
}