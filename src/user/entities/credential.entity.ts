import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.credentials)
  user: User;

  @Column()
  nin: string;

  @Column()
  bvn: string;
}