import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { FollowService } from './follow.service';

import { Follow } from './entities/follow.entity';

import { FollowRequestDto, FollowResponseDto, UnfollowResponseDto } from './dto/follow.dto';

@Controller('/api/v1/follow')
@ApiTags('Follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User followed successfully', 
    type: Follow 
  })
  async follow(@Body() payload: FollowRequestDto): Promise<FollowResponseDto> {
    return await this.followService.follow(payload);
  }

  @Post('/unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User unfollowed successfully', 
    type: UnfollowResponseDto 
  })
  async unFollow(@Body() payload: FollowRequestDto): Promise<UnfollowResponseDto> {
    return await this.followService.unFollow(payload);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user follows' })
  @ApiResponse({
    status: 200,
    description: 'Get my follows',
    type: [Follow],
  })
  getFollows(@Req() req): Promise<any> {
    return this.followService.getFollowing(req.user.id);
  }

  @Get('followers')
  @ApiOperation({ summary: 'Get user followers' })
  @ApiResponse({
    status: 200,
    description: 'Get my followers',
    type: [Follow],
  })
  getFollowers(@Req() req): Promise<any> {
    return this.followService.getFollowers(req.user.id);
  }
}
