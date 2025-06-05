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

enum AuthType {
  SOCIAL = 'SOCIAL',
  EMAIL = 'EMAIL',
}

@Entity({ name: 'users' })
export class User {
  static getPasswordNullable(authType: 'social' | 'email') {
    return authType === 'social';
  }

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: User.getPasswordNullable('email') })
  password: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  lga: string;

  @Column({ nullable: true })
  state: string;

  @Column({ default: false })
  is_verified: boolean;

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
    enum: AuthType,
    default: 'EMAIL',
  })
  authType: AuthType;

  @Column({ nullable: true })
  hashedRt: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  wallet: Wallet;
}
