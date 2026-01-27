import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Credential } from './credential.entity';
import { BankAccounts } from './bank-accounts.entity';
import { Verification } from '../../auth/entities/verification.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Post } from '../../feed/entities/post.entity';
import { PostLike } from '../../feed/entities/post-like.entity';
import { PostComment } from '../../feed/entities/post-comment.entity';
import { PostShare } from 'src/feed/entities/post-share.entity';
import { PostReport } from 'src/feed/entities/post-report.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Follow } from 'src/follow/entities/follow.entity';

import { AuthTypes, GenderTypes, UserTypes } from '../user.enums';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  lga: string;

  @Column({ nullable: true })
  state: string;

  @Column({ 
    nullable: true,
    type: 'enum',
    enum: GenderTypes
  })
  gender: GenderTypes;

  @Column({ nullable: true })
  occupation: string;

  @Column('text', { array: true, nullable: true })
  interests: string[];

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  is_active: boolean;

  @OneToMany(() => Verification, (verification) => verification.user)
  verifications: Verification[];

  @OneToOne(() => Credential, { cascade: true })
  @JoinColumn()
  credentials: Credential;

  @OneToMany(() => BankAccounts, (bankAccounts) => bankAccounts.user)
  bankAccounts: BankAccounts[];

  @Column({
    nullable: false,
    type: 'enum',
    enum: AuthTypes,
    default: 'EMAIL',
  })
  auth_type: AuthTypes;

  @Column({ nullable: true, type: 'json' })
  google_auth_details: {};

  @Column({ nullable: true })
  hashedRt: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  wallet: Wallet;

  // Feed relationships
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => PostLike, (like) => like.user)
  likes: PostLike[];

  @OneToMany(() => PostComment, (comment) => comment.author)
  comments: PostComment[];

  @OneToMany(() => PostShare, (share) => share.user)
  shares: PostShare[];

  @OneToMany(() => PostReport, (report) => report.reporter)
  reports: PostReport[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  role?: string | UserTypes;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];
}
