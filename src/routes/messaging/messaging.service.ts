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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;
  handleDisconnect(client: any) {
    // emit 'user_disconnected' event to all connected users
    this.server.emit('user_disconnected', client.id);
  }
  handleConnection(client: any) {
    // Log that a new user has connected
    console.log('New user connected: ' + client.id);
  }

  @SubscribeMessage('message_sent')
  receiveMessage(@ConnectedSocket() client: any, @MessageBody() body: any) {
    // emit 'new_message' event to all connected users
    this.server.emit('new_message', body);
  }

  @SubscribeMessage('create_room')
  createRoom(@ConnectedSocket() client: any, @MessageBody() body: any) {
    // emit 'new_room_created' event to all connected users
    this.server.emit('new_room_created', body);
  }

  @SubscribeMessage('join_room')
  joinRoom(@ConnectedSocket() client: any, @MessageBody() body: any) {
    // emit 'user_joined' event to all connected users
    this.server.emit('user_joined', body);
  }

  @SubscribeMessage('leave_room')
  leaveRoom(@ConnectedSocket() client: any, @MessageBody() body: any) {
    // emit 'user_left' event to all connected users
    this.server.emit('user_left', body);
  }
}
