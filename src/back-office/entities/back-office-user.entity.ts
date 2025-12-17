import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import BackOfficeUserRoleTypes from 'src/back-office/enums/back-office-user-role-types.enum';

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

  @Column({
    type: 'enum',
    enum: BackOfficeUserRoleTypes,
    default: BackOfficeUserRoleTypes.ADMIN,
  })
  role: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  hashedRt: string;
}