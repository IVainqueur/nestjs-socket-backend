import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type MessageDocument = Message & mongoose.Document;

@Schema({ strict: true })
export class Message {
  @Prop()
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  })
  room: mongoose.Schema.Types.ObjectId;

  @Prop()
  sender: string;

  @Prop({ default: Date.now })
  sentDate: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
