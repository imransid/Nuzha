import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaChatService } from '../../../../prisma/prisma-chat.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaChatService) {}

  async saveMessage(data) {
    try {
      console.log('💬 Raw WebSocket payload:', data);

      const { content, senderId, room } = data;

      if (!content || !senderId || !room) {
        throw new BadRequestException('Missing content, senderId, or room.');
      }

      if (
        typeof data.content !== 'string' ||
        typeof data.room !== 'string' ||
        typeof data.senderId !== 'number' ||
        isNaN(data.senderId)
      ) {
        throw new Error(
          'Invalid input: content, senderId, and room are required.',
        );
      }

      const message = await this.prisma.message.create({
        data: {
          content: data.content,
          room: data.room,
          sender: {
            connect: { id: data.senderId },
          },
        },
        include: { sender: true },
      });

      return message;
    } catch (error) {
      console.error('🔥 Prisma error:', error);
      throw new InternalServerErrorException(
        error.message || 'Could not save message',
      );
    }
  }

  async getMessages(room: string) {
    return await this.prisma.message.findMany({
      where: { room },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}
