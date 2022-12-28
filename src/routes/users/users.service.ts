import { Injectable } from '@nestjs/common';
import { User } from './users.types';

@Injectable()
export default class UsersService {
  create(userInfo: User): Promise<User> {
    // add new user to mongodb database
    return Promise.resolve({
      username: userInfo.username,
      password: 'password',
    });
  }
  findOne(username: string): Promise<User> {
    // find user by username in mongodb database
    return Promise.resolve({
      username,
      password: 'password',
    });
  }
}
