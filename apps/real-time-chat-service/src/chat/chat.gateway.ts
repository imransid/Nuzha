import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway(8976, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server; // Socket.IO server instance

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('join')
  handleJoin(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room); // Join a specific room (e.g., "admin-1_user-2")
    console.log(`Client joined room: ${room}`);
  }

  // 🔸 When someone sends a message
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { content: string; senderId: number; room: string },
  ) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    // 1. Save to DB
    const savedMessage = await this.chatService.saveMessage(data);

    // 2. Emit it to everyone in the room
    this.server.to(data.room).emit('message', savedMessage);
  }
}
