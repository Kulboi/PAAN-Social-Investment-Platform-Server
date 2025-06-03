import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UserService } from './user.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { UpdateUserDto, ChangePasswordDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@Req() req) {
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