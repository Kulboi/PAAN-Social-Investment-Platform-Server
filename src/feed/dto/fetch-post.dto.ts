import { IsUUID, IsOptional } from 'class-validator';

export class FetchPostRequestDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}