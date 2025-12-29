import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  MessageNotification,
} from '../common/interfaces/websocket.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateWay
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      // 尝试验证token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      }) as JwtPayload;
      this.connectedUsers.set(payload.sub, client);
      console.log(`User connected: ${payload.sub}`);
    } catch {
      // token验证失败，使用mock用户ID
      const mockUserId = 'mock-user-1';
      this.connectedUsers.set(mockUserId, client);
      console.log(`User connected with mock ID: ${mockUserId}`);
    }
  }

  async handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket.id === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    console.log(`Client joined room: ${roomId}`);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    console.log(`Client left room: ${roomId}`);
  }

  // 发送消息给特定用户
  sendToUser(userId: string, event: string, data: unknown) {
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      socket.emit(event, data);
    }
  }

  // 发送消息给多个用户
  async sendToUsers(userIds: string[], event: string, data: unknown) {
    await Promise.all(
      userIds.map((userId) => {
        this.sendToUser(userId, event, data);
      }),
    );
  }

  // 发送消息给组织内所有用户
  sendToOrganization(organizationId: string, event: string, data: unknown) {
    this.server.to(organizationId).emit(event, data);
  }

  // 发送新消息通知
  async sendNewMessageNotification(message: MessageNotification) {
    if (message.organization) {
      // 发送给组织内所有在线用户
      this.sendToOrganization(message.organization.id, 'message:new', message);
    } else {
      // 发送给特定用户
      this.sendToUser(message.sender.id, 'message:new', message);
    }
  }
}
