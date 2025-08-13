import { ApiProperty } from '@nestjs/swagger';
import { PostType, PostVisibility } from '../entities/post.entity';

export class AuthorInfoDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ nullable: true })
  profileImage?: string;
}

export class PostMediaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  mediaType: string;

  @ApiProperty({ nullable: true })
  thumbnailUrl?: string;

  @ApiProperty({ nullable: true })
  filename?: string;

  @ApiProperty({ nullable: true })
  mimeType?: string;

  @ApiProperty({ nullable: true })
  fileSize?: number;

  @ApiProperty({ nullable: true })
  width?: number;

  @ApiProperty({ nullable: true })
  height?: number;
}

export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: PostType })
  postType: PostType;

  @ApiProperty({ enum: PostVisibility })
  visibility: PostVisibility;

  @ApiProperty({ nullable: true })
  stockSymbol?: string;

  @ApiProperty({ nullable: true })
  stockPrice?: number;

  @ApiProperty({ nullable: true })
  priceChange?: number;

  @ApiProperty({ nullable: true })
  marketSector?: string;

  @ApiProperty({ nullable: true })
  pollOptions?: { option: string; votes: number }[];

  @ApiProperty({ nullable: true })
  pollExpiresAt?: Date;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  sharesCount: number;

  @ApiProperty()
  viewsCount: number;

  @ApiProperty()
  isReported: boolean;

  @ApiProperty()
  isHidden: boolean;

  @ApiProperty({ nullable: true })
  moderationNote?: string;

  @ApiProperty({ type: [String], nullable: true })
  hashtags?: string[];

  @ApiProperty({ type: [String], nullable: true })
  mentions?: string[];

  @ApiProperty({ nullable: true })
  location?: string;

  @ApiProperty({ nullable: true })
  latitude?: number;

  @ApiProperty({ nullable: true })
  longitude?: number;

  @ApiProperty({ nullable: true })
  scheduledAt?: Date;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  authorId: string;

  @ApiProperty({ type: AuthorInfoDto })
  authorInfo: AuthorInfoDto;

  @ApiProperty({ type: [PostMediaDto] })
  media?: PostMediaDto[];
} 