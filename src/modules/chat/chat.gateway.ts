import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { UsersService } from '../users/users.service';
import { User } from '../../models/user.model';
import { ChatService } from './chat.service';

interface UserSocket extends Socket {
  user: User;
}

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private usersService: UsersService,

    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  users: Map<number, UserSocket[]> = new Map();

  public async handleConnection(client: UserSocket) {
    try {
      const { id } = this.jwtService.verify(
        client.handshake.query.token,
        this.config.get('accessToken.secret'),
      );

      client.user = await this.usersService.byId(id);

      if (!client.user) {
        client.disconnect();
      }

      return console.log(`Client connected: ${client.id}`);
    } catch (error) {
      client.disconnect();
    }
  }

  public handleDisconnect(client: Socket): void {
    return console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  public async handleMessage(
    client: UserSocket,
    payload: any,
  ): Promise<WsResponse<any>> {
    const message = await this.chatService.addMessage(payload, client.user);
    return this.server.to(payload.chatId).emit('msgToClient', message);
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
