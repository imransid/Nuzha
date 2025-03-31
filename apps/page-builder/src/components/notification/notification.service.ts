// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaPageBuilderService) {}

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany();
  }

  async create(data: {
    userId: number;
    message: string;
    type: string;
  }): Promise<Notification> {
    return this.prisma.notification.create({
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
