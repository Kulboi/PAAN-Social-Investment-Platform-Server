import {
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

import BackOfficeUserRoleTypes from 'src/back-office/enums/back-office-user-role-types.enum';
import { GenderTypes } from 'src/user/user.enums';

export class CreateBackOfficeUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(BackOfficeUserRoleTypes)
  user_type?: BackOfficeUserRoleTypes;

  @IsOptional()
  @IsEnum(GenderTypes)
  gender?: GenderTypes;
}
