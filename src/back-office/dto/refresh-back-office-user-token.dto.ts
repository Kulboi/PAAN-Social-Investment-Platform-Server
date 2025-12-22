import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RefreshBackOfficeUserTokenDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
