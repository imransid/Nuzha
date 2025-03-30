import { Module } from '@nestjs/common';
import { RealTimeChatServiceController } from './real-time-chat-service.controller';
import { RealTimeChatServiceService } from './real-time-chat-service.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [RealTimeChatServiceController],
  providers: [RealTimeChatServiceService],
})
export class RealTimeChatServiceModule {}
