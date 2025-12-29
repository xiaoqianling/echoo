import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MessageNotification } from '../common/interfaces/websocket.interface';
export declare class WebSocketGateWay implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    private readonly jwtService;
    server: Server;
    private connectedUsers;
    constructor(authService: AuthService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinRoom(roomId: string, client: Socket): Promise<void>;
    handleLeaveRoom(roomId: string, client: Socket): Promise<void>;
    sendToUser(userId: string, event: string, data: unknown): void;
    sendToUsers(userIds: string[], event: string, data: unknown): Promise<void>;
    sendToOrganization(organizationId: string, event: string, data: unknown): void;
    sendNewMessageNotification(message: MessageNotification): Promise<void>;
}
