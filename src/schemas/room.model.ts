import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type RoomDocument = Room & mongoose.Document;

@Schema({ strict: true })
export class Room {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  owner: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
