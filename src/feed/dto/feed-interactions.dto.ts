import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
  MinLength,
  IsArray,
  ArrayMaxSize,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LikeType } from '../entities/post-like.entity';
import { ShareType } from '../entities/post-share.entity';
import { ReportReason } from '../entities/post-report.entity';

// Comment DTOs
export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(20)
  mentions?: string[];
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(20)
  mentions?: string[];
}

// Like DTOs
export class CreateLikeDto {
  @ApiPropertyOptional({ enum: LikeType, default: LikeType.LIKE })
  @IsOptional()
  @IsEnum(LikeType)
  likeType?: LikeType;
}

// Share DTOs
export class CreateShareDto {
  @ApiProperty({ enum: ShareType })
  @IsEnum(ShareType)
  shareType: ShareType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  shareComment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  platform?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  recipientId?: string;
}

// Report DTOs
export class CreateReportDto {
  @ApiProperty({ enum: ReportReason })
  @IsEnum(ReportReason)
  reason: ReportReason;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  severity?: number;
}

// Feed Query DTOs
export class GetFeedDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: ['createdAt', 'likesCount', 'commentsCount', 'viewsCount'] })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'likesCount' | 'commentsCount' | 'viewsCount' = 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  postTypes?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hashtag?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stockSymbol?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  marketSector?: string;
}

export class GetCommentsDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'likesCount' = 'createdAt';

  @ApiPropertyOptional({ default: 'ASC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}

// Response DTOs
export class PostStatsDto {
  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  sharesCount: number;

  @ApiProperty()
  viewsCount: number;

  @ApiProperty()
  engagementRate: number;
}

export class PaginationMetaDto {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrevious: boolean;
}
