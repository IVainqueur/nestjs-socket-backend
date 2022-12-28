import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type RoomDocument = Room & mongoose.Document;

@Schema({ strict: true })
export class Room {
  @Prop()
  name: string;

  @Prop()
  room_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  members: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    default: [],
  })
  messages: mongoose.Schema.Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
