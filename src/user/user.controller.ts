import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { UpdateUserDto, ChangePasswordDto } from './dto/user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetches user data' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  getProfile(@Req() req): Promise<UserResponseDto> {
    return this.userService.getUser(req.user.userId);
  }

  @Patch('me')
  updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(req.user.userId, dto);
  }

  @Patch('me/change-password')
  changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.userId, dto);
  }

  @Delete('me')
  deleteAccount(@Req() req) {
    return this.userService.deleteUser(req.user.userId);
  }
}