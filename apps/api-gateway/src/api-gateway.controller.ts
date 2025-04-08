import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GoogleAuthGuard } from 'apps/user-service/src/guard/google-auth/google-auth.guard';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    @Inject('PAGE_BUILDER_SERVICE')
    private readonly PageBuilderService: ClientProxy,
  ) {}

  @Get('wallet_user')
  createWallet() {
    console.log('hited');
    return this.PageBuilderService.send('wallet_user', {});
  }

  @Get('users')
  getUsers() {
    return this.userService.send('get_users', {});
  }
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return this.userService.send('google_login', {});
  }
  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallBack() {
    return this.userService.send('google_callback', {});
  }
}
