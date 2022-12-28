import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export default class User {
  @Prop()
  fullName: string;

  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
