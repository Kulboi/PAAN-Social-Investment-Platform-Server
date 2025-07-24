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

export enum LikeType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  LAUGH = 'LAUGH',
  ANGRY = 'ANGRY',
  SAD = 'SAD',
  WOW = 'WOW',
}

@Entity({ name: 'post_likes' })
@Index(['postId', 'userId'])
@Index(['userId', 'createdAt'])
@Unique(['postId', 'userId'])
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LikeType,
    default: LikeType.LIKE,
  })
  likeType: LikeType;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @Column()
  postId: string;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
