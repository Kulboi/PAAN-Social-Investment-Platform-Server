import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';

import { Follow } from './entities/follow.entity';
import { User } from 'src/user/entities/user.entity';

import { FollowAccountDto, UnFollowAccountDto, FollowResponseDto, UnfollowResponseDto } from './dto/follow.dto';
import { GetFollowersRequestDto, GetFollowersResponseDto } from './dto/getFollowers.dto';
import { GetFollowingRequestDto, GetFollowingResponseDto } from './dto/getFollowing.dto';
import { GetSuggestedFollowersResponseDto } from './dto/getSuggestedFollowers.dto';

import { FollowStatus } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async follow(dto: FollowAccountDto): Promise<FollowResponseDto> {
    // Check if the follow relationship already exists
    const existingFollow = await this.followRepo.findOne({
      where: {
        follower: { id: dto.follower_id },
        following: { id: dto.following_id },
      },
    });

    // If it exists, throw conflict exception
    if (existingFollow) {
      throw new ConflictException('Follow relationship already exists');
    }

    // Get the follower and following users
    const follower = await this.userRepo.findOneBy({ id: dto.follower_id });
    const following = await this.userRepo.findOneBy({ id: dto.following_id });

    if (!follower || !following) {
      throw new NotFoundException('Follower or following user not found');
    }

    // Create the follow relationship
    const followEntity = new Follow();
    followEntity.follower = follower;
    followEntity.following = following;
    followEntity.status = FollowStatus.ACCEPTED;
    const saved = await this.followRepo.save(followEntity);

    return {
      follower_id: saved.follower.id,
      following_id: saved.following.id,
      status: saved.status,
      created_at: saved.created_at,
      updated_at: saved.updated_at,
    };
  }

  async unFollow(dto: UnFollowAccountDto): Promise<UnfollowResponseDto> {
    // Check if the follow relationship already exists
    const existingFollow = await this.followRepo.findOne({
      where: {
        follower: { id: dto.unfollower_id },
        following: { id: dto.unfollowing_id },
      },
    });

    if (!existingFollow) {
      throw new NotFoundException('Follow relationship not found');
    }

    // Delete the follow relationship
    await this.followRepo.delete({
      follower: { id: dto.unfollower_id },
      following: { id: dto.unfollowing_id },
    });

    return { message: 'Successfully unfollowed the user' };
  }

  async getFollowers(dto: GetFollowersRequestDto): Promise<GetFollowersResponseDto> {
    const followers = await this.followRepo.find({
      where: {
        following: { id: dto.user_id },
      },
      relations: ['follower'],
      skip: dto.page && dto.limit ? (dto.page - 1) * dto.limit : 0,
      take: dto.limit || 10,
    })

    return {
      user_id: dto.user_id,
      followers: followers.map(follow => ({
        id: follow.follower.id,
        first_name: follow.follower.first_name,
        last_name: follow.follower.last_name,
        username: follow.follower.username,
        email: follow.follower.email,
        profile_image: follow.follower.profile_image,
        followed_at: follow.created_at,
      })),
    };
  }

  async getFollowing(dto: GetFollowingRequestDto): Promise<GetFollowingResponseDto> {
    const following = await this.followRepo.find({
      where: {
        follower: { id: dto.user_id },
      },
      relations: ['following'],
      skip: dto.page && dto.limit ? (dto.page - 1) * dto.limit : 0,
      take: dto.limit || 10,
    })
    
    return {
      user_id: dto.user_id,
      following: following.map(follow => ({
        id: follow.following.id,
        first_name: follow.following.first_name,
        last_name: follow.following.last_name,
        username: follow.following.username,
        email: follow.following.email,
        profile_image: follow.following.profile_image,
        followed_at: follow.created_at,
      })),
    };
  }

  async getSuggestedFollowers(user_id: string): Promise<GetSuggestedFollowersResponseDto> {
    const user = await this.userRepo.findOneBy({ id: user_id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prepare query builder for advanced filtering
    let query = this.followRepo.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .where('follow.following = :userId', { userId: user_id });

    query.andWhere('follower.interests && ARRAY[:...interests]', { interests: user.interests });

    const followers = await query.getMany();

    return {
      suggestions: followers.map(follow => ({
        id: follow.follower.id,
        first_name: follow.follower.first_name,
        last_name: follow.follower.last_name,
        username: follow.follower.username,
        email: follow.follower.email,
        profile_image: follow.follower.profile_image,
        followed_at: follow.created_at,
        follower_count: follow.follower.followers ? follow.follower.followers.length : 0,
        is_following: follow.status === FollowStatus.ACCEPTED,
      })),
    };
  }
}
