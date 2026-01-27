import { Controller, Post, Body, Get, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { FollowService } from './follow.service';

import { FollowRequestDto, FollowResponseDto, UnfollowResponseDto } from './dto/follow.dto';
import { GetFollowersResponseDto } from './dto/getFollowers.dto';
import { GetFollowingResponseDto } from './dto/getFollowing.dto';

@Controller('/api/v1/follow')
@ApiTags('Follow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiBody({ type: FollowRequestDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'User followed successfully', 
    type: FollowResponseDto 
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict: Follow relationship already exists',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found: Follower or following user not found',
  })
  async follow(@Body() payload: FollowRequestDto): Promise<FollowResponseDto> {
    return await this.followService.follow(payload);
  }

  @Post('/unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiBody({ type: FollowRequestDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'User unfollowed successfully', 
    type: UnfollowResponseDto 
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found: Follow relationship not found',
  })
  async unFollow(@Body() payload: FollowRequestDto): Promise<UnfollowResponseDto> {
    return await this.followService.unFollow(payload);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user following' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get my following',
    type: GetFollowingResponseDto,
  })
  getFollows(@Req() req): Promise<GetFollowingResponseDto> {
    return this.followService.getFollowing({
      user_id: req.user.id,
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    });
  }

  @Get('followers')
  @ApiOperation({ summary: 'Get user followers' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get my followers',
    type: GetFollowersResponseDto,
  })
  getFollowers(@Req() req): Promise<GetFollowersResponseDto> {
    return this.followService.getFollowers({
      user_id: req.user.id,
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    });
  }
}
