import { CreateRoomBody } from './../room/room.types';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomService } from '../room/room.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer()
  public server: Server;
  handleDisconnect(client: any) {
    // emit 'user_disconnected' event to all rooms the user is connected to
    client.rooms.forEach((room: string) => {
      this.server.to(room).emit('user_disconnected', client.id);
    });
  }
  handleConnection(client: any) {
    // Log that a new user has connected
    console.log('New user connected: ' + client.id);
  }

  @SubscribeMessage('message_sent')
  receiveMessage(@ConnectedSocket() client: any, @MessageBody() body: any) {
    // emit 'new_message' event to all connected users
    this.server.emit('new_message', body);
    console.log('received message: ', body);
    this.roomService.addMessage(body.room_id, body.access_token, {
      content: body.message,
      sender: '',
    });
  }

  @SubscribeMessage('get_rooms')
  async getRooms(@ConnectedSocket() client: any, @MessageBody() body: any) {
    console.log('[getRooms] getting all rooms: ');
    const rooms = await this.roomService.getRooms();
    // emit 'all_rooms' event to all connected users
    console.log({
      clientId: client.id,
      rooms,
    });
    client.emit('all_rooms', rooms);
  }

  @SubscribeMessage('create_room')
  async createRoom(
    @ConnectedSocket() client: any,
    @MessageBody() body: CreateRoomBody,
  ) {
    console.log('[createRoom] creating new room: ');
    await this.roomService.createRoom(body);
    // emit 'new_room_created' event to all connected users
    this.server.emit('new_room_created', body);
  }

  @SubscribeMessage('join_room')
  joinRoom(@ConnectedSocket() client: any, @MessageBody() body: any) {
    // emit 'user_joined' event to all connected users
    this.server.to(body.room_id).emit('user_joined', body);
  }

  @SubscribeMessage('leave_room')
  leaveRoom(@ConnectedSocket() client: any, @MessageBody() body: any) {
    // emit 'user_left' event to all connected users
    this.server.to(body.room_id).emit('user_left', body);
  }
}
