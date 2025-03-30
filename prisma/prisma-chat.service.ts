import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from './generated/chat';

@Injectable()
export class PrismaChatService extends PrismaClient implements OnModuleInit {
  [x: string]: any;
  async onModuleInit() {
    // Note: this is optional
    await this.$connect();
  }
}
