import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from './post.entity';

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  MISINFORMATION = 'MISINFORMATION',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  FAKE_INVESTMENT_ADVICE = 'FAKE_INVESTMENT_ADVICE',
  MARKET_MANIPULATION = 'MARKET_MANIPULATION',
  SCAM = 'SCAM',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
  ESCALATED = 'ESCALATED',
}

@Entity({ name: 'post_reports' })
@Index(['postId', 'status'])
@Index(['reporterId', 'createdAt'])
@Index(['status', 'createdAt'])
@Index(['reason', 'status'])
export class PostReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReportReason,
  })
  reason: ReportReason;

  @Column({ type: 'text', nullable: true })
  description: string; // Additional details provided by reporter

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @Column({ type: 'text', nullable: true })
  moderatorNote: string; // Note from moderator

  @Column({ nullable: true })
  reviewedBy: string; // Moderator/admin who reviewed the report

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  actionTaken: string; // Action taken if report was valid

  @Column({ type: 'int', default: 1 })
  severity: number; // Severity level (1-5)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column()
  postId: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column()
  reporterId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewedBy' })
  reviewer: User;

  // Computed fields
  get isPending(): boolean {
    return this.status === ReportStatus.PENDING;
  }

  get isUnderReview(): boolean {
    return this.status === ReportStatus.UNDER_REVIEW;
  }

  get isResolved(): boolean {
    return this.status === ReportStatus.RESOLVED;
  }

  get isDismissed(): boolean {
    return this.status === ReportStatus.DISMISSED;
  }

  get isEscalated(): boolean {
    return this.status === ReportStatus.ESCALATED;
  }

  get isHighSeverity(): boolean {
    return this.severity >= 4;
  }

  get hasBeenReviewed(): boolean {
    return !!this.reviewedAt;
  }

  get daysSinceReported(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
