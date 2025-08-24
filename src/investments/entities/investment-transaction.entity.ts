import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Investment } from './investment.entity';

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class InvestmentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  investment: Investment;

  @Column()
  userId: number;

  @Column()
  amount: number;

  @Column()
  status: TransactionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethod: string;

  @Column()
  user_debited: User;

  @Column()
  user_credited: User;

  @ManyToOne(() => Investment, (investment) => investment.transactions)
  @JoinColumn()
  investmentId: Investment;
}