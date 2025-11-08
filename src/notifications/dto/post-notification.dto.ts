import { 
  IsNotEmpty, 
  MinLength, 
  IsOptional, 
  IsString, 
  IsDateString, 
  IsEnum,
  IsObject,
  IsArray
} from 'class-validator';

import { NotificationTypes } from '../notifications.enum';

export class PostNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(NotificationTypes)
  type: NotificationTypes;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  users?: string[];
}