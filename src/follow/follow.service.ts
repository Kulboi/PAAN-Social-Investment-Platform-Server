import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Follow } from './entities/follow.entity';

import { FollowRequestDto, FollowResponseDto } from './dto/follow.dto';
import { GetFollowersRequestDto } from './dto/getFollowers.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
  ) {}

  async follow(dto: FollowRequestDto): Promise<FollowResponseDto> {
    const saved = await this.followRepo.save(dto);

    return {
      follower_id: saved.follower_id,
      following_id: saved.following_id,
      status: saved.status,
      created_at: saved.created_at,
      updated_at: saved.updated_at,
    };
  }

  async getFollowers(dto: GetFollowersRequestDto) {
    // const followers = await this.followRepo.find({
    //   where: {
    //     following_id: dto.user_id,
    //   },
    // })

    // return followers;
  }

  async getFollowing(dto: GetFollowDto) {
    // const following = await this.followRepo.find({
    //   where: {
    //     follower_id: dto.user_id,
    //   },
    // })

    // return following;
  }
}
