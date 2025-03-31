// src/notification/notification.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from '../entities/notification.entity';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @Query(() => [Notification])
  async notifications(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Mutation(() => Notification)
  async createNotification(
    @Args('userId') userId: number,
    @Args('message') message: string,
    @Args('type') type: string,
  ): Promise<Notification> {
    return this.notificationService.create({ userId, message, type });
  }

  @Mutation(() => Notification)
  async markAsRead(@Args('id') id: number): Promise<Notification> {
    return this.notificationService.markAsRead(id);
  }
}
