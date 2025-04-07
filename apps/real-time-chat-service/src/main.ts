// import { NestFactory } from '@nestjs/core';
// import { RealTimeChatServiceModule } from './real-time-chat-service.module';
// async function bootstrap() {
//   const app = await NestFactory.create(RealTimeChatServiceModule);
//   await app.listen(process.env.port ?? 3000);

//   console.log('chart port running : ', process.env.port ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { RealTimeChatServiceModule } from './real-time-chat-service.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(RealTimeChatServiceModule);

  // Get the HTTP server instance
  const server = app.getHttpServer();

  // Create a new instance of Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*', // You can replace * with your frontend domain in production
      methods: ['GET', 'POST'],
    },
  });

  // Use the WebSocket adapter for handling socket events
  app.useWebSocketAdapter(new IoAdapter(app));

  // Start the app and listen on the specified port
  const port = process.env.PORT || 3000; // Default to port 3000 if no port is defined
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap();
