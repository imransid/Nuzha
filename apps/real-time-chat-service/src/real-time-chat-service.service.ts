import { Injectable } from '@nestjs/common';

@Injectable()
export class RealTimeChatServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
