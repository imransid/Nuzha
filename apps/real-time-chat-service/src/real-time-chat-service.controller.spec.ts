import { Test, TestingModule } from '@nestjs/testing';
import { RealTimeChatServiceController } from './real-time-chat-service.controller';
import { RealTimeChatServiceService } from './real-time-chat-service.service';

describe('RealTimeChatServiceController', () => {
  let realTimeChatServiceController: RealTimeChatServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RealTimeChatServiceController],
      providers: [RealTimeChatServiceService],
    }).compile();

    realTimeChatServiceController = app.get<RealTimeChatServiceController>(RealTimeChatServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(realTimeChatServiceController.getHello()).toBe('Hello World!');
    });
  });
});
