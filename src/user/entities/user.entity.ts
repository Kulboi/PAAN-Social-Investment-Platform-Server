import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Credential } from './credential.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column()
  address: string;

  @Column()
  lga: string;

  @Column()
  state: string;

  @Column({ default: false })
  is_verified: boolean;

  @OneToOne(() => Credential, { cascade: true })
  @JoinColumn()
  credentials: Credential;
}