import { User } from '../users/users.types';
import { LoginResponse } from './auth.types';
import { Body, Controller, Post } from '@nestjs/common';
import AuthService from './auth.service';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: User): Promise<LoginResponse> {
    return await this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: User): Promise<LoginResponse> {
    return await this.authService.register(body);
  }
}
