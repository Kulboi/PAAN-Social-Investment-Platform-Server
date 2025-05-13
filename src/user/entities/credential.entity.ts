import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nin: string;

  @Column()
  bvn: string;
}