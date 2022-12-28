import { Injectable } from '@nestjs/common';
import { User } from './users.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as UserModel, UserDocument } from '../../schemas/user.model';

@Injectable()
export default class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async create(userInfo: User): Promise<User> {
    // add new user to mongodb database
    try {
      const user = new this.userModel(userInfo);
      await user.save();
      return user;
    } catch (error) {
      if (
        ['MongoError', 'MongoServerError'].includes(error.name) &&
        error.code === 11000
      ) {
        throw new Error('User already exists');
      } else {
        throw error;
      }
    }
  }
  async findOne(username: string): Promise<UserModel> {
    // find user by username in mongodb database
    return await this.userModel.findOne({
      username: username,
    });
  }
}
