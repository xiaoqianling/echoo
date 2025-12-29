import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:3000';

class WebSocketService {
  private socket: Socket | null = null;
  private messageCallbacks: ((message: Message) => void)[] = [];

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_BASE_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('message:new', (message: Message) => {
      this.messageCallbacks.forEach(callback => callback(message));
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  onNewMessage(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  offNewMessage(callback: (message: Message) => void): void {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_room', roomId);
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', roomId);
    }
  }
}

export const webSocketService = new WebSocketService();
