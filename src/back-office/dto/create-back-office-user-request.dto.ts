import {
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import BackOfficeUserRoleTypes from 'src/back-office/enums/back-office-user-role-types.enum';
import { GenderTypes } from 'src/user/user.enums';

export class CreateBackOfficeUserRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;

  @ApiProperty({
    enum: BackOfficeUserRoleTypes,
    default: BackOfficeUserRoleTypes.ADMIN,
    required: false,
    type: String,
    description: 'Role of the user',
  })
  @IsOptional()
  @IsEnum(BackOfficeUserRoleTypes)
  role?: BackOfficeUserRoleTypes;

  @ApiProperty()
  @IsOptional()
  @IsEnum(GenderTypes)
  gender?: GenderTypes;
}
