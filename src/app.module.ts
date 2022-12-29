import { RoomService } from './routes/room/room.service';
import { SocketsGateway } from './routes/messaging/messaging.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import AuthModule from './routes/auth/auth.module';
import { Room, RoomSchema } from './schemas/room.model';
import { Message, MessageSchema } from './schemas/message.model';
import { User, UserSchema } from './schemas/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI
        : process.env.MONGO_URI_LOCAL,
    ),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [],
  providers: [SocketsGateway, RoomService],
})
export class AppModule {}
