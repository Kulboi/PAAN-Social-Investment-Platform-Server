import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class BackOfficeUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ default: true })
  is_active: boolean;
}