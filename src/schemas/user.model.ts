import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema({ strict: true })
export class User {
  @Prop()
  fullName: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop({
    default: 'https://avatars.dicebear.com/api/adventurer/uzi_chat.png',
  })
  profilePicture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
