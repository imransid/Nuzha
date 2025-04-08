import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PageBuilderController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'WELCOME :)';
  }

  @MessagePattern('wallet_user')
  getUsers() {
    console.log('hiuted');

    //return this.userService.findAll();
  }
}
