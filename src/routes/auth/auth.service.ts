import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import UsersService from '../users/users.service';
import { User } from '../users/users.types';

@Injectable()
export default class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, fullName: user.fullName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User) {
    const newUser = await this.usersService.create(user);
    const payload = { username: newUser.username, fullName: newUser.fullName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
