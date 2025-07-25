import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { WalletTransactions } from './transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  @OneToOne(() => User, user => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => WalletTransactions, transaction => transaction.wallet, { onDelete: 'CASCADE' })
  transactions: WalletTransactions[];
}