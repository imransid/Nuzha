import { NestFactory } from '@nestjs/core';
import { RealTimeChatServiceModule } from './real-time-chat-service.module';

async function bootstrap() {
  const app = await NestFactory.create(RealTimeChatServiceModule);
  await app.listen(process.env.port ?? 3000);

  console.log('chart port running : ', process.env.port ?? 3000);
}
bootstrap();
