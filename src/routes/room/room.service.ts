import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorChecker } from 'src/custom.decorators';
import { Message } from 'src/schemas/message.model';
import { Room } from 'src/schemas/room.model';
import Utils from '../../Utils';
import { User } from '../users/users.types';
import { CreateRoomBody } from './room.types';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private roomModel: Model<Room>,
    @InjectModel('Message') private messageModel: Model<Message>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  @ErrorChecker()
  async createRoom(room: CreateRoomBody) {
    // find the creatorId from the token
    const userInfo = Utils.decodeJWT(room.access_token);
    const creator = await this.userModel.findOne({
      username: userInfo.username,
    });
    // create a new room
    const newRoom = await this.roomModel.create({
      name: room.room_name,
      room_id: Utils.generateUID(),
      createdBy: creator._id,
    });

    return newRoom;
  }

  @ErrorChecker()
  async getRooms() {
    const rooms = await this.roomModel.find({}).select('name room_id');
    return rooms;
  }

  @ErrorChecker()
  async getRoom(roomId: string) {
    const room = await this.roomModel.findOne({ room_id: roomId });
    return room;
  }

  @ErrorChecker()
  async getMessages(roomId: string) {
    const room = await this.roomModel
      .findOne({ room_id: roomId })
      .populate('messages');
    return room.messages;
  }

  @ErrorChecker()
  async addMessage(roomId: string, access_token: string, message: Message) {
    console.log('line 58');
    const decodedToken = Utils.decodeJWT(access_token);
    console.log('line 60');
    const room = await this.roomModel
      .findOne({ room_id: roomId })
      .populate('messages');
    const sender = await this.userModel
      .findOne({ username: decodedToken.username })
      .select('_id');
    message.sender = sender._id as any;
    const newMessage = await this.messageModel.create({
      content: message.content,
      sender: message.sender,
    });
    room.messages.push(newMessage._id as any);
    await room.save();
    console.log('saved message: ', newMessage);
    return newMessage;
  }

  @ErrorChecker()
  async addMember(roomId: string, username: string) {
    const room = await this.roomModel
      .findOne({ room_id: roomId })
      .populate('members');
    const user = await this.userModel
      .findOne({ username: username })
      .select('_id');
    room.members.push(user._id as any);
    await room.save();
    return room;
  }

  @ErrorChecker()
  async getMembers(roomId: string) {
    const room = await this.roomModel
      .findOne({ room_id: roomId })
      .populate('members');
    return room.members;
  }
}
