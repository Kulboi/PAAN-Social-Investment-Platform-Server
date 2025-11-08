import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notifications.entity';

import { PostNotificationDto } from './dto/post-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async postNotification(dto: PostNotificationDto) {
    return await this.notificationsRepository.save(dto);
  }

  async getNotifications(userId: string) {
    return await this.notificationsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: string) {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId },
    });
    if (notification) {
      notification.read = true;
      return await this.notificationsRepository.save(notification);
    }
    return null;
  }

  async deleteNotification(notificationId: string) {
    return await this.notificationsRepository.delete(notificationId);
  }
}
