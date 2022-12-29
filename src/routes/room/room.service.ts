import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
    const rooms = await this.roomModel
      .find({}, { name: 1, room_id: 1, messages: { $slice: -1 } })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          select: 'username',
        },
      });
    return rooms;
  }

  @ErrorChecker()
  async getRoom(roomId: string) {
    const room = await this.roomModel.findOne({ room_id: roomId });
    return room;
  }

  @ErrorChecker()
  async getMessages(roomId: string) {
    const room = await this.roomModel.findOne({ room_id: roomId }).populate({
      path: 'messages',
      populate: {
        path: 'sender',
        select: 'username fullName',
      },
    });
    return room.messages;
  }

  @ErrorChecker()
  async addMessage(roomId: string, access_token: string, message: Message) {
    if (!roomId || !access_token || !message) return;
    const decodedToken = Utils.decodeJWT(access_token);
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
    return newMessage;
  }

  @ErrorChecker()
  async addMember(roomId: string, access_token: string) {
    console.log({ roomId, access_token });
    if (!roomId || !access_token) return;
    const decodedToken = Utils.decodeJWT(access_token);
    const username = decodedToken.username;
    const room = await this.roomModel.findOne({ room_id: roomId });
    const user = await this.userModel
      .findOne({ username: username })
      .select('_id');
    const previousMembers = new Set(
      room.members.map((member) => member.toString()),
    );

    previousMembers.add(user._id.toString());
    room.members = Array.from(previousMembers).map(
      (member) => new mongoose.Types.ObjectId(member) as any,
    );
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
