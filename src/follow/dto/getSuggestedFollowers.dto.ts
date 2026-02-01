import { IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetSuggestedFollowersResponseDto {
  @ApiProperty({
    description: 'List of suggested followers',
  })
  suggestions: Array<{
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    profile_image?: string;
    follower_count: number;
    is_following: boolean;
  }>;
}