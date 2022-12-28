import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UsersService from '../users/users.service';
import { User } from '../users/users.types';
import { LoginResponse } from './auth.types';
import {
  genSaltSync,
  compareSync as bcryptCompareSync,
  hashSync as bcryptHashSync,
} from 'bcryptjs';
import { ErrorChecker } from '../../custom.decorators';

@Injectable()
export default class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<null | User> {
    const user = await this.usersService.findOne(username);
    if (user && bcryptCompareSync(pass, user.password)) {
      const { username: username, fullName } = user;
      return { username: username, fullName };
    }
    return null;
  }

  @ErrorChecker()
  async login(user: User): Promise<LoginResponse> {
    const loggedInUser = await this.validateUser(user.username, user.password);
    if (!loggedInUser) {
      return {
        success: false,
        access_token: null,
        message: 'Invalid credentials',
      };
    }
    return {
      ...loggedInUser,
      success: true,
      access_token: this.jwtService.sign(loggedInUser),
    };
  }

  @ErrorChecker()
  async register(user: User): Promise<LoginResponse> {
    const salt = genSaltSync(10);
    const hash = bcryptHashSync(user.password, salt);
    user.password = hash;
    const newUser = await this.usersService.create(user);
    const payload = {
      username: newUser.username,
      fullName: newUser.fullName,
    };
    return {
      ...payload,
      success: true,
      access_token: this.jwtService.sign(payload),
    };
  }
}
