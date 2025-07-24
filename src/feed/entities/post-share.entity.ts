import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from './post.entity';

export enum ShareType {
  REPOST = 'REPOST', // Share to own feed
  DIRECT_SHARE = 'DIRECT_SHARE', // Share via direct message
  EXTERNAL_SHARE = 'EXTERNAL_SHARE', // Share outside the platform
  QUOTE_SHARE = 'QUOTE_SHARE', // Share with additional comment
}

@Entity({ name: 'post_shares' })
@Index(['postId', 'userId'])
@Index(['userId', 'createdAt'])
@Index(['shareType', 'createdAt'])
@Unique(['postId', 'userId', 'shareType'])
export class PostShare {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ShareType,
    default: ShareType.REPOST,
  })
  shareType: ShareType;

  @Column({ type: 'text', nullable: true })
  shareComment: string; // Comment added when sharing (for quote shares)

  @Column({ type: 'varchar', length: 100, nullable: true })
  platform: string; // External platform name (for external shares)

  @Column({ nullable: true })
  recipientId: string; // For direct shares

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @Column()
  postId: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  // Computed fields
  get isQuoteShare(): boolean {
    return this.shareType === ShareType.QUOTE_SHARE;
  }

  get isExternalShare(): boolean {
    return this.shareType === ShareType.EXTERNAL_SHARE;
  }

  get isDirectShare(): boolean {
    return this.shareType === ShareType.DIRECT_SHARE;
  }

  get hasComment(): boolean {
    return !!this.shareComment;
  }
}
