import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum FollowStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;

  @Column({ 
    default: FollowStatus.ACCEPTED,
    type: 'enum',
    enum: FollowStatus
  })
  status: FollowStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}