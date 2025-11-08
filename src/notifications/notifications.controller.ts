import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { PostNotificationDto } from './dto/post-notification.dto';

@ApiTags('Notifications')
@Controller('api/v1/notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  @ApiResponse({ status: 201, description: 'The notification has been successfully created.' })
  async create(@Body() dto: PostNotificationDto) {
    return await this.notificationsService.postNotification(dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get notifications for a user' })
  @ApiResponse({ status: 200, description: 'List of notifications for the user.' })
  async findAll(@Param('userId') userId: string) {
    return await this.notificationsService.getNotifications(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'The notification has been marked as read.' })
  async markAsRead(@Param('id') id: string) {
    return await this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 204, description: 'The notification has been successfully deleted.' })
  async remove(@Param('id') id: string) {
    return await this.notificationsService.deleteNotification(id);
  }
}
