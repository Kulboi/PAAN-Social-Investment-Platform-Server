import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { PostLike } from './post-like.entity';
import { PostComment } from './post-comment.entity';
import { PostMedia } from './post-media.entity';
import { PostShare } from './post-share.entity';
import { PostReport } from './post-report.entity';

export enum PostType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  POLL = 'POLL',
  INVESTMENT_INSIGHT = 'INVESTMENT_INSIGHT',
  MARKET_ANALYSIS = 'MARKET_ANALYSIS',
  PORTFOLIO_SHARE = 'PORTFOLIO_SHARE',
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  FOLLOWERS_ONLY = 'FOLLOWERS_ONLY',
  PRIVATE = 'PRIVATE',
}

@Entity({ name: 'posts' })
@Index(['authorId', 'createdAt'])
@Index(['postType', 'createdAt'])
@Index(['visibility', 'createdAt'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.TEXT,
  })
  postType: PostType;

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  visibility: PostVisibility;

  // Investment-related fields
  @Column({ type: 'varchar', length: 20, nullable: true })
  stockSymbol: string; // e.g., 'AAPL', 'GOOGL'

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  stockPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  priceChange: number; // Percentage change

  @Column({ type: 'varchar', length: 50, nullable: true })
  marketSector: string; // e.g., 'Technology', 'Healthcare'

  // Poll fields (if post type is POLL)
  @Column({ type: 'json', nullable: true })
  pollOptions: { option: string; votes: number }[];

  @Column({ type: 'timestamp', nullable: true })
  pollExpiresAt: Date;

  // Engagement metrics
  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'int', default: 0 })
  commentsCount: number;

  @Column({ type: 'int', default: 0 })
  sharesCount: number;

  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  // Content moderation
  @Column({ type: 'boolean', default: false })
  isReported: boolean;

  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  @Column({ type: 'text', nullable: true })
  moderationNote: string;

  // SEO and discovery
  @Column({ type: 'text', array: true, nullable: true })
  hashtags: string[];

  @Column({ type: 'text', array: true, nullable: true })
  mentions: string[]; // User IDs mentioned in the post

  // Location (optional)
  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  // Scheduling
  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column()
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => PostLike, (like) => like.post, { cascade: true })
  likes: PostLike[];

  @OneToMany(() => PostComment, (comment) => comment.post, { cascade: true })
  comments: PostComment[];

  @OneToMany(() => PostMedia, (media) => media.post, { cascade: true })
  media: PostMedia[];

  @OneToMany(() => PostShare, (share) => share.post, { cascade: true })
  shares: PostShare[];

  @OneToMany(() => PostReport, (report) => report.post, { cascade: true })
  reports: PostReport[];

  // Computed fields (can be added as virtual properties)
  get isOwner(): (userId: string) => boolean {
    return (userId: string) => this.authorId === userId;
  }

  get hasHashtags(): boolean {
    return this.hashtags && this.hashtags.length > 0;
  }

  get hasMentions(): boolean {
    return this.mentions && this.mentions.length > 0;
  }

  get isInvestmentRelated(): boolean {
    return [
      PostType.INVESTMENT_INSIGHT,
      PostType.MARKET_ANALYSIS,
      PostType.PORTFOLIO_SHARE,
    ].includes(this.postType);
  }

  get engagementRate(): number {
    if (this.viewsCount === 0) return 0;
    return ((this.likesCount + this.commentsCount + this.sharesCount) / this.viewsCount) * 100;
  }
}
