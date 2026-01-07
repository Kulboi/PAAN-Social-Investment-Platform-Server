import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'waitlist' })
export class Waitlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}