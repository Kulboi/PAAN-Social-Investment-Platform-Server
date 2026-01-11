import { IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateBackOfficeUserRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  first_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  last_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  username?: string;
}

export class UpdateBackOfficeUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;
}