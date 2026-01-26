import { IsNotEmpty, IsUUID } from "class-validator";

export class GetFollowersRequestDto {
  @IsNotEmpty() 
  @IsUUID() 
  user_id: string;
}

export class GetFollowersResponseDto {
  @IsNotEmpty() 
  @IsUUID() 
  user_id: string;
}