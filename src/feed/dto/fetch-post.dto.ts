import { IsOptional } from 'class-validator';

export class FetchPostRequestDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}