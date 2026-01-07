import { io, Socket } from "socket.io-client";
import { Message } from "../types";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "http://localhost:3000";

// 连接状态枚举
enum ConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
}

// 连接配置
interface ConnectionConfig {
  maxRetries: number;
  retryDelay: number;
  heartbeatInterval: number;
  timeout: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private messageCallbacks: Map<string, ((message: Message) => void)[]> =
    new Map();
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private retryCount = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  // 连接配置
  private config: ConnectionConfig = {
    maxRetries: 5,
    retryDelay: 5000, // 5秒
    heartbeatInterval: 30000, // 30秒
    timeout: 15000, // 15秒
  };

  // 连接状态变更回调
  private stateChangeCallbacks: ((state: ConnectionState) => void)[] = [];

  connect(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.socket?.connected) {
        console.log("🔌 WebSocket already connected, skipping connection");
        resolve(true);
        return;
      }

      // 清理旧连接
      this.disconnect();

      this.setConnectionState(ConnectionState.CONNECTING);
      console.log("🔌 Starting WebSocket connection...");

      this.socket = io(WS_BASE_URL, {
        auth: {
          token,
        },
        transports: ["websocket", "polling"],
        timeout: this.config.timeout,
        reconnection: false, // 手动处理重连
        forceNew: true, // 强制创建新连接
      });

      // 连接成功
      this.socket.on("connect", () => {
        console.log("✅ WebSocket connected successfully");
        console.log(`🔌 Socket ID: ${this.socket?.id}`);
        this.setConnectionState(ConnectionState.CONNECTED);
        this.retryCount = 0;
        this.startHeartbeat();
        resolve(true);
      });

      // 连接断开
      this.socket.on("disconnect", (reason) => {
        console.log("❌ WebSocket disconnected:", reason);
        console.log(`🔌 Socket ID: ${this.socket?.id}`);
        this.setConnectionState(ConnectionState.DISCONNECTED);
        this.stopHeartbeat();

        // 如果不是手动断开，尝试重连
        if (reason !== "io client disconnect") {
          console.log(`🔌 Scheduling reconnection (reason: ${reason})`);
          this.scheduleReconnect();
        } else {
          console.log("🔌 Manual disconnect, skipping reconnection");
        }
        resolve(false);
      });

      // 连接错误
      this.socket.on("connect_error", (error) => {
        console.error("❌ WebSocket connection error:", error);
        console.log(`🔌 Socket ID: ${this.socket?.id}`);
        this.setConnectionState(ConnectionState.DISCONNECTED);
        console.log("🔌 Scheduling reconnection due to connection error");
        this.scheduleReconnect();
        resolve(false);
      });

      // 新消息事件
      this.socket.on("message:new", (message: Message) => {
        this.handleMessage("message:new", message);
      });

      // 兼容服务器直接发送message事件
      this.socket.on("message", (message: Message) => {
        this.handleMessage("message:new", message);
      });

      // 批量消息事件
      this.socket.on("message:batch", (messages: Record<string, Message>) => {
        this.handleBatchMessages(messages);
      });

      // 错误事件
      this.socket.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  // 设置连接状态
  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.stateChangeCallbacks.forEach((callback) => callback(state));
  }

  // 启动心跳检测
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit("heartbeat");
      }
    }, this.config.heartbeatInterval);
  }

  // 停止心跳检测
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 安排重连
  private scheduleReconnect(): void {
    if (this.retryCount >= this.config.maxRetries) {
      console.log("Max reconnection attempts reached");
      return;
    }

    this.retryCount++;
    const delay = this.config.retryDelay * Math.pow(2, this.retryCount - 1); // 指数退避

    console.log(
      `Scheduling reconnection attempt ${this.retryCount} in ${delay}ms`
    );

    this.setConnectionState(ConnectionState.RECONNECTING);

    this.reconnectTimer = setTimeout(() => {
      this.reconnect();
    }, delay);
  }

  // 重连
  private async reconnect(): Promise<void> {
    if (this.connectionState === ConnectionState.CONNECTED) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("No token available for reconnection");
      return;
    }

    try {
      await this.connect(token);
    } catch (error) {
      console.error("Reconnection failed:", error);
    }
  }

  // 处理消息
  private handleMessage(event: string, message: Message): void {
    const callbacks = this.messageCallbacks.get(event) || [];
    callbacks.forEach((callback) => callback(message));
  }

  // 处理批量消息
  private handleBatchMessages(messages: Record<string, Message>): void {
    const callbacks = this.messageCallbacks.get("message:new") || [];
    Object.values(messages).forEach((message) => {
      callbacks.forEach((callback) => callback(message));
    });
  }

  // 监听消息事件
  on(event: string, callback: (message: Message) => void): void {
    console.log("Chill 监听事件", event);

    if (!this.messageCallbacks.has(event)) {
      this.messageCallbacks.set(event, []);
    }
    this.messageCallbacks.get(event)!.push(callback);
  }

  // 取消监听消息事件
  off(event: string, callback: (message: Message) => void): void {
    const callbacks = this.messageCallbacks.get(event);
    if (callbacks) {
      this.messageCallbacks.set(
        event,
        callbacks.filter((cb) => cb !== callback)
      );
    }
  }

  // 监听新消息（兼容旧版本）
  onNewMessage(callback: (message: Message) => void): void {
    this.on("message:new", callback);
  }

  // 取消监听新消息（兼容旧版本）
  offNewMessage(callback: (message: Message) => void): void {
    this.off("message:new", callback);
  }

  // 监听连接状态变化
  onStateChange(callback: (state: ConnectionState) => void): void {
    this.stateChangeCallbacks.push(callback);
  }

  // 取消监听连接状态变化
  offStateChange(callback: (state: ConnectionState) => void): void {
    this.stateChangeCallbacks = this.stateChangeCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  // 断开连接
  disconnect(): void {
    // 清理定时器
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // 断开socket连接
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.setConnectionState(ConnectionState.DISCONNECTED);
    this.retryCount = 0;
  }

  // 加入房间
  joinRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit("join_room", roomId);
    }
  }

  // 离开房间
  leaveRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit("leave_room", roomId);
    }
  }

  // 获取连接状态
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  // 检查是否连接
  isConnected(): boolean {
    return (
      this.connectionState === ConnectionState.CONNECTED &&
      this.socket?.connected === true
    );
  }

  // 获取重试次数
  getRetryCount(): number {
    return this.retryCount;
  }
}

export const webSocketService = new WebSocketService();
export { ConnectionState };
