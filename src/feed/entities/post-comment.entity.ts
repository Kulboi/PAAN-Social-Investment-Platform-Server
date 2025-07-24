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
import { Post } from './post.entity';

@Entity({ name: 'post_comments' })
@Index(['postId', 'createdAt'])
@Index(['authorId', 'createdAt'])
@Index(['parentCommentId', 'createdAt'])
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  // For threaded comments (replies)
  @Column({ nullable: true })
  parentCommentId: string;

  @ManyToOne(() => PostComment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment: PostComment;

  @OneToMany(() => PostComment, (comment) => comment.parentComment)
  replies: PostComment[];

  // Engagement metrics
  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'int', default: 0 })
  repliesCount: number;

  // Content moderation
  @Column({ type: 'boolean', default: false })
  isReported: boolean;

  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  @Column({ type: 'text', nullable: true })
  moderationNote: string;

  // SEO and discovery
  @Column({ type: 'text', array: true, nullable: true })
  mentions: string[]; // User IDs mentioned in the comment

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column()
  postId: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  // Computed fields
  get isReply(): boolean {
    return this.parentCommentId !== null;
  }

  get hasReplies(): boolean {
    return this.repliesCount > 0;
  }

  get isOwner(): (userId: string) => boolean {
    return (userId: string) => this.authorId === userId;
  }

  get hasMentions(): boolean {
    return this.mentions && this.mentions.length > 0;
  }
}
