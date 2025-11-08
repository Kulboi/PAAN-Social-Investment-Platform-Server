import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from '../../user/entities/user.entity';

import { NotificationTypes } from '../notifications.enum';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  type: NotificationTypes;

  @Column({
    default: false,
  })
  read: boolean;

  @Column({
    type: 'json',
    nullable: true,
  })
  meta: object;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
