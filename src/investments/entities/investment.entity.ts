import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { InvestmentTransaction } from './investment-transaction.entity';

enum InvestmentRiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

enum InvestmentStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  owner: User;

  @Column()
  images: string[];

  @Column()
  category: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column({
    type: 'enum',
    enum: InvestmentStatus
  })
  status: InvestmentStatus;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column({
    nullable: true
  })
  lga: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  targeted_amount: number;

  @Column()
  expected_return: number;

  @Column()
  duration: number;

  @Column()
  minimum_investment: number;

  @Column({
    type: 'enum',
    enum: InvestmentRiskLevel,
  })
  riskLevel: InvestmentRiskLevel;

  @Column()
  totalRaised: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => InvestmentTransaction, (transaction) => transaction.investment)
  transactions: InvestmentTransaction[];
}