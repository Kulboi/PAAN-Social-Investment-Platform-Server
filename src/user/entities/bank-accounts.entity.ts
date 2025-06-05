import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class BankAccounts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bankAccounts, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  accountNumber: string;

  @Column()
  accountName: string;

  @Column()
  bankName: string;
}