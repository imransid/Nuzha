// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaPageBuilderService) {}

  async findAll(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async create(data: {
    userId: number;
    message: string;
    type: string;
  }): Promise<Notification> {
    return await this.prisma.notification.create({
      data,
    });
  }

  async markAsRead(id: number): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
