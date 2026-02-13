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
import { AuthService } from '../../core/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  MessageNotification,
} from '@/shared/common/interfaces/websocket.interface';

// 连接信息接口
interface ConnectionInfo {
  socket: Socket;
  userId: string;
  connectedAt: Date;
  lastHeartbeat: Date;
}

@WebSocketGateway({
  namespace: 'echoo',
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class WebSocketGateWay
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // 优化连接管理：双向映射
  private userIdToSocketId = new Map<string, string>(); // userId -> socketId
  private socketIdToUserId = new Map<string, string>(); // socketId -> userId
  private connections = new Map<string, ConnectionInfo>(); // socketId -> connection info

  // 消息队列
  private messageQueue: Array<{
    event: string;
    data: unknown;
    targetType: 'user' | 'organization' | 'broadcast';
    targetIds: string[];
    priority: number;
    createdAt: Date;
  }> = [];

  // 批量发送配置
  private readonly BATCH_SIZE = 50;
  private readonly MAX_QUEUE_SIZE = 1000;

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`🔌 WebSocket connection attempt from socket: ${client.id}`);
    console.log(`🔌 Handshake auth:`, client.handshake.auth);
    console.log(`🔌 Handshake headers:`, client.handshake.headers);

    const token = client.handshake.auth.token;
    if (!token) {
      console.log('❌ WebSocket connection rejected: No token provided');
      client.disconnect();
      return;
    }

    try {
      // 尝试验证token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      }) as JwtPayload;

      const userId = payload.sub;
      console.log(`✅ Token validated successfully for user: ${userId}`);

      // 清理旧连接（同一用户的新连接）
      this.cleanupOldConnections(userId);

      // 存储连接信息
      this.userIdToSocketId.set(userId, client.id);
      this.socketIdToUserId.set(client.id, userId);
      this.connections.set(client.id, {
        socket: client,
        userId,
        connectedAt: new Date(),
        lastHeartbeat: new Date(),
      });

      console.log(`✅ User connected: ${userId} (socket: ${client.id})`);
      console.log(`📊 Current connections: ${this.connections.size}`);

      // 设置心跳检测
      this.setupHeartbeat(client);
    } catch (error) {
      // token验证失败，拒绝连接
      console.log('❌ WebSocket connection rejected: Invalid token', error);
      client.disconnect();
      return;
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`🔌 WebSocket disconnection for socket: ${client.id}`);

    const userId = this.socketIdToUserId.get(client.id);

    // 清理连接信息
    if (userId) {
      this.userIdToSocketId.delete(userId);
    }
    this.socketIdToUserId.delete(client.id);
    this.connections.delete(client.id);

    console.log(
      `❌ User disconnected: ${userId || 'unknown'} (socket: ${client.id})`,
    );
    console.log(`📊 Current connections: ${this.connections.size}`);
  }

  // 清理同一用户的旧连接
  private cleanupOldConnections(userId: string): void {
    const existingSocketId = this.userIdToSocketId.get(userId);
    if (existingSocketId) {
      const existingConnection = this.connections.get(existingSocketId);
      if (existingConnection) {
        existingConnection.socket.disconnect();
      }
      this.userIdToSocketId.delete(userId);
      this.socketIdToUserId.delete(existingSocketId);
      this.connections.delete(existingSocketId);
      console.log(`Cleaned up old connection for user: ${userId}`);
    }
  }

  // 设置心跳检测
  private setupHeartbeat(client: Socket): void {
    console.log(`💓 Setting up heartbeat for socket: ${client.id}`);

    client.on('heartbeat', () => {
      const connection = this.connections.get(client.id);
      if (connection) {
        connection.lastHeartbeat = new Date();
        console.log(
          `💓 Heartbeat received from socket: ${client.id}, user: ${connection.userId}`,
        );
      }
    });

    // 定期检查心跳 - 使用单个全局定时器
    this.startGlobalHeartbeatCheck();
  }

  // 全局心跳检查定时器
  private heartbeatInterval: NodeJS.Timeout | null = null;

  private startGlobalHeartbeatCheck(): void {
    if (this.heartbeatInterval) {
      return; // 已经启动
    }

    console.log('💓 Starting global heartbeat check...');

    this.heartbeatInterval = setInterval(() => {
      const now = new Date();
      let timeoutCount = 0;

      // 检查所有连接的心跳
      for (const [socketId, connection] of this.connections.entries()) {
        const timeSinceLastHeartbeat =
          now.getTime() - connection.lastHeartbeat.getTime();

        console.log(
          `💓 Checking socket: ${socketId}, user: ${connection.userId}, last heartbeat: ${timeSinceLastHeartbeat}ms ago`,
        );

        if (timeSinceLastHeartbeat > 120000) {
          // 120秒无心跳
          console.log(
            `❌ Connection timeout for user: ${connection.userId}, socket: ${socketId}`,
          );
          connection.socket.disconnect();
          timeoutCount++;
        }
      }

      if (timeoutCount > 0) {
        console.log(
          `📊 Heartbeat check completed: ${timeoutCount} connections timed out`,
        );
      }
    }, 60000); // 每60秒检查一次
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

  // 发送消息给特定用户（优化版本）
  sendToUser(userId: string, event: string, data: unknown): boolean {
    const socketId = this.userIdToSocketId.get(userId);
    if (!socketId) return false;

    const connection = this.connections.get(socketId);
    if (connection) {
      connection.socket.emit(event, data);
      return true;
    }
    return false;
  }

  // 批量发送消息给多个用户（优化版本）
  async sendToUsers(
    userIds: string[],
    event: string,
    data: unknown,
  ): Promise<number> {
    const validUserIds = userIds.filter((userId) =>
      this.userIdToSocketId.has(userId),
    );

    if (validUserIds.length === 0) return 0;

    // 使用Socket.IO的批量发送功能
    const sockets = validUserIds
      .map((userId) => this.userIdToSocketId.get(userId))
      .filter((socketId) => socketId !== undefined)
      .map((socketId) => this.connections.get(socketId as string)?.socket)
      .filter((socket) => socket !== undefined) as Socket[];

    if (sockets.length === 0) return 0;

    // 批量发送
    this.server.to(sockets.map((s) => s.id)).emit(event, data);
    return sockets.length;
  }

  // 发送消息给组织内所有用户（优化版本）
  sendToOrganization(
    organizationId: string,
    event: string,
    data: unknown,
  ): void {
    this.server.to(organizationId).emit(event, data);
  }

  // 队列化消息发送（高性能版本）
  async queueMessage(
    event: string,
    data: unknown,
    targetType: 'user' | 'organization' | 'broadcast',
    targetIds: string[],
    priority = 1,
  ): Promise<void> {
    // 检查队列大小
    if (this.messageQueue.length >= this.MAX_QUEUE_SIZE) {
      console.warn('Message queue is full, dropping message');
      return;
    }

    // 添加消息到队列
    this.messageQueue.push({
      event,
      data,
      targetType,
      targetIds,
      priority,
      createdAt: new Date(),
    });

    // 按优先级排序
    this.messageQueue.sort((a, b) => b.priority - a.priority);

    // 触发批量处理
    await this.processMessageQueue();
  }

  // 处理消息队列
  private async processMessageQueue(): Promise<void> {
    if (this.messageQueue.length === 0) return;

    // 批量处理消息
    const batch = this.messageQueue.splice(0, this.BATCH_SIZE);

    // 按目标类型分组处理
    const groupedMessages = this.groupMessagesByTarget(batch);

    for (const [targetType, messages] of groupedMessages.entries()) {
      await this.processBatchByTargetType(targetType, messages);
    }

    // 如果有剩余消息，继续处理
    if (this.messageQueue.length > 0) {
      setImmediate(() => this.processMessageQueue());
    }
  }

  // 按目标类型分组消息
  private groupMessagesByTarget(
    messages: typeof this.messageQueue,
  ): Map<string, typeof this.messageQueue> {
    const grouped = new Map<string, typeof this.messageQueue>();

    for (const message of messages) {
      const key = `${message.targetType}:${message.event}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(message);
    }

    return grouped;
  }

  // 按目标类型批量处理消息
  private async processBatchByTargetType(
    targetType: string,
    messages: typeof this.messageQueue,
  ): Promise<void> {
    const [type, event] = targetType.split(':');

    switch (type) {
      case 'user':
        await this.batchSendToUsers(messages, event);
        break;
      case 'organization':
        await this.batchSendToOrganizations(messages, event);
        break;
      case 'broadcast':
        await this.batchBroadcast(messages, event);
        break;
    }
  }

  // 批量发送给用户
  private async batchSendToUsers(
    messages: typeof this.messageQueue,
    event: string,
  ): Promise<void> {
    // 直接发送单个消息给每个用户
    for (const message of messages) {
      for (const userId of message.targetIds) {
        if (this.userIdToSocketId.has(userId)) {
          const socketId = this.userIdToSocketId.get(userId);
          if (socketId) {
            const socket = this.connections.get(socketId)?.socket;
            if (socket) {
              // 发送单个消息而不是批量消息
              socket.emit(event, message.data);
              console.log(
                `📤 Sent message to user ${userId} (socket: ${socketId})`,
              );
            }
          }
        }
      }
    }
  }

  // 批量发送给组织
  private async batchSendToOrganizations(
    messages: typeof this.messageQueue,
    event: string,
  ): Promise<void> {
    const orgMessages = new Map<string, unknown>();

    // 合并相同组织的消息
    for (const message of messages) {
      for (const orgId of message.targetIds) {
        orgMessages.set(orgId, message.data);
      }
    }

    // 批量发送给组织
    for (const [orgId, data] of orgMessages.entries()) {
      this.server.to(orgId).emit(event, data);
    }
  }

  // 批量广播
  private async batchBroadcast(
    messages: typeof this.messageQueue,
    event: string,
  ): Promise<void> {
    // 合并广播消息
    const broadcastData = messages.map((message) => message.data);

    if (broadcastData.length > 0) {
      this.server.emit(event, broadcastData);
    }
  }

  // 发送新消息通知（优化版本）
  async sendNewMessageNotification(
    message: MessageNotification,
  ): Promise<void> {
    if (message.organization) {
      // 发送给组织内所有在线用户
      await this.queueMessage(
        'message:new',
        message,
        'organization',
        [message.organization.id],
        1, // 高优先级
      );
    } else {
      // 发送给特定用户
      await this.queueMessage(
        'message:new',
        message,
        'user',
        [message.sender.id],
        1, // 高优先级
      );
    }
  }

  // 获取连接统计信息
  getConnectionStats() {
    return {
      totalConnections: this.connections.size,
      activeUsers: this.userIdToSocketId.size,
      queueSize: this.messageQueue.length,
      connections: Array.from(this.connections.values()).map((conn) => ({
        userId: conn.userId,
        socketId: conn.socket.id,
        connectedAt: conn.connectedAt,
        lastHeartbeat: conn.lastHeartbeat,
      })),
    };
  }
}
