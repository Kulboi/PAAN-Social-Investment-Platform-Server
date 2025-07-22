import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowService } from './follow.service';

import { FollowController } from './follow.controller';

import { Follow } from './entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  providers: [FollowService],
  controllers: [FollowController]
})
export class FollowModule {}
