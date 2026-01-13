import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshBackOfficeUserTokenRequestDto {
  @ApiProperty({
    description: 'Refresh token issued to the back office user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTFiMmMzZDQtZTVmNi03ZzhoLTlpMGotazFsMm0zbjRvNXA2IiwiaWF0IjoxNjg4MjU2MDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

export class RefreshBackOfficeUserTokenDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

export class RefreshBackOfficeUserTokenResponseDto {
  @ApiProperty({
    description: 'New access token for the back office user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTFiMmMzZDQtZTVmNi03ZzhoLTlpMGotazFsMm0zbjRvNXA2IiwiaWF0IjoxNjg4MjU2MDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @ApiProperty({
    description: 'New refresh token for the back office user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTFiMmMzZDQtZTVmNi03ZzhoLTlpMGotazFsMm0zbjRvNXA2IiwiaWF0IjoxNjg4MjU2MDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}