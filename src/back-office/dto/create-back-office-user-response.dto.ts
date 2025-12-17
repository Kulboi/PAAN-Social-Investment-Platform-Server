import { ApiProperty } from '@nestjs/swagger';

export class CreateBackOfficeUserResponseDto {
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

  @ApiProperty()
  role: string;

  @ApiProperty()
  is_active: boolean;
}