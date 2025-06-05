import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity()
export class WalletTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  reference: string;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @ManyToOne(() => Wallet, wallet => wallet.transactions, { onDelete: 'CASCADE' })
  wallet: Wallet;
}