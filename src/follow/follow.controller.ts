import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { FollowService } from './follow.service';

import { Follow } from './entities/follow.entity';

import { FollowDto } from './dto/follow.dto';

@Controller('follow')
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
  async follow(@Body() payload: FollowDto): Promise<any> {
    await this.followService.follow(payload);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user follows' })
  @ApiResponse({
    status: 200,
    description: 'Get my follows',
    type: [Follow],
  })
  getFollows(@Req() req): Promise<any> {
    return this.followService.getFollowing(req.user.userId);
  }

  @Get('followers')
  @ApiOperation({ summary: 'Get user followers' })
  @ApiResponse({
    status: 200,
    description: 'Get my followers',
    type: [Follow],
  })
  getFollowers(@Req() req): Promise<any> {
    return this.followService.getFollowers(req.user.userId);
  }
}
