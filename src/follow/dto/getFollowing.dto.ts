import { IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { User } from "src/user/entities/user.entity";

export class GetFollowingRequestDto {
  @IsNotEmpty() 
    @IsUUID() 
    user_id: string;
  
    @IsOptional()
    page: number;
  
    @IsOptional()
    limit: number;
}

export class GetFollowingResponseDto {
  @IsNotEmpty() 
    @IsUUID() 
    @ApiProperty({
      description: 'Unique identifier for the user whose followers are being retrieved',
    })
    user_id: string;
  
    @ApiProperty({
      description: 'List of followers',
    })
    following: Array<Partial<User>>;
}