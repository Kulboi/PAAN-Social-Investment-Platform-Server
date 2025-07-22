import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Follow } from './entities/follow.entity';

import { FollowDto, GetFollowDto } from './dto/follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
  ) {}

  async follow(dto: FollowDto) {
    const follow = new Follow();
    follow.followerId = dto.follower_id;
    follow.followingId = dto.following_id;

    const saved = await this.followRepo.save(follow);

    return saved;
  }

  async getFollowers(dto: GetFollowDto) {
    const followers = await this.followRepo.find({
      where: {
        followingId: dto.user_id,
      },
    })

    return followers;
  }

  async getFollowing(dto: GetFollowDto) {
    const following = await this.followRepo.find({
      where: {
        followerId: dto.user_id,
      },
    })

    return following;
  }
}
