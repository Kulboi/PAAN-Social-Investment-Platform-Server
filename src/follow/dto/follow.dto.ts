import { IsNotEmpty } from "class-validator";

export class FollowDto {
  @IsNotEmpty() follower_id: number;
  @IsNotEmpty() following_id: number;
}

export class GetFollowDto {
  @IsNotEmpty() user_id: number;
}