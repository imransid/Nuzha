import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaChatService } from '../../../../prisma/prisma-chat.service';

@Module({
  providers: [
    ChatService,
    ChatGateway,
    PrismaChatService, // ✅ required if you’re using a custom wrapper
  ],
  exports: [ChatService], // ✅ export if used in other modules
})
export class ChatModule {}
