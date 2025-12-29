"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketGateWay = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
let WebSocketGateWay = class WebSocketGateWay {
    authService;
    jwtService;
    server;
    connectedUsers = new Map();
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        const token = client.handshake.auth.token;
        if (!token) {
            client.disconnect();
            return;
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || 'secretKey',
            });
            this.connectedUsers.set(payload.sub, client);
            console.log(`User connected: ${payload.sub}`);
        }
        catch {
            const mockUserId = 'mock-user-1';
            this.connectedUsers.set(mockUserId, client);
            console.log(`User connected with mock ID: ${mockUserId}`);
        }
    }
    async handleDisconnect(client) {
        for (const [userId, socket] of this.connectedUsers.entries()) {
            if (socket.id === client.id) {
                this.connectedUsers.delete(userId);
                console.log(`User disconnected: ${userId}`);
                break;
            }
        }
    }
    async handleJoinRoom(roomId, client) {
        client.join(roomId);
        console.log(`Client joined room: ${roomId}`);
    }
    async handleLeaveRoom(roomId, client) {
        client.leave(roomId);
        console.log(`Client left room: ${roomId}`);
    }
    sendToUser(userId, event, data) {
        const socket = this.connectedUsers.get(userId);
        if (socket) {
            socket.emit(event, data);
        }
    }
    async sendToUsers(userIds, event, data) {
        await Promise.all(userIds.map((userId) => {
            this.sendToUser(userId, event, data);
        }));
    }
    sendToOrganization(organizationId, event, data) {
        this.server.to(organizationId).emit(event, data);
    }
    async sendNewMessageNotification(message) {
        if (message.organization) {
            this.sendToOrganization(message.organization.id, 'message:new', message);
        }
        else {
            this.sendToUser(message.sender.id, 'message:new', message);
        }
    }
};
exports.WebSocketGateWay = WebSocketGateWay;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketGateWay.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebSocketGateWay.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebSocketGateWay.prototype, "handleLeaveRoom", null);
exports.WebSocketGateWay = WebSocketGateWay = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], WebSocketGateWay);
//# sourceMappingURL=websocket.gateway.js.map