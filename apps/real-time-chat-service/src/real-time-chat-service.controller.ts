import { Controller, Get } from '@nestjs/common';
import { RealTimeChatServiceService } from './real-time-chat-service.service';

@Controller()
export class RealTimeChatServiceController {
  constructor(private readonly realTimeChatServiceService: RealTimeChatServiceService) {}

  @Get()
  getHello(): string {
    return this.realTimeChatServiceService.getHello();
  }
}
