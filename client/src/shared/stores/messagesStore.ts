import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { apiService } from "../services/api";
import { webSocketService } from "../services/websocket";
import { Message } from "../types";
import { toast } from "./toast";

// 定义消息状态接口
interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// 创建消息状态
const [messagesState, setMessagesState] = createStore<MessagesState>({
  messages: [],
  isLoading: false,
  error: null,
});

// 创建信号
export const [selectedMessageId, setSelectedMessageId] = createSignal<
  string | null
>(null);

// 获取消息列表
export const fetchMessages = async (organizationId?: string): Promise<void> => {
  setMessagesState({ isLoading: true, error: null });

  try {
    const messages = await apiService.getMessages(organizationId);
    setMessagesState({
      messages,
      isLoading: false,
      error: null,
    });
  } catch (error) {
    console.error(
      "Failed to fetch messages from API, using local mock data:",
      error
    );
  } finally {
    setMessagesState({ isLoading: false });
  }
};

// 发送消息
export const sendMessage = async (data: {
  title: string;
  desp?: string;
  tags?: string[];
  short?: string;
  organizationId?: string;
}): Promise<void> => {
  try {
    await apiService.sendMessage(data);
    // 发送成功后刷新消息列表
    await fetchMessages(data.organizationId);
  } catch (error) {
    throw error;
  }
};

// 处理新消息
export const handleNewMessage = (message: Message): void => {
  console.log("🚀 Chill ~ handleNewMessage ~ message: 收到消息", message);
  // 添加消息到列表
  setMessagesState((prev) => ({
    messages: [message, ...prev.messages],
  }));

  // 显示 Toast 通知
  toast.success(`收到新消息: ${message.title}`);
};

// 清除错误
export const clearError = (): void => {
  setMessagesState({ error: null });
};

// 清除消息
export const clearMessages = (): void => {
  setMessagesState({ messages: [] });
};

// 绑定WebSocket消息处理
webSocketService.on("message:new", handleNewMessage);
webSocketService.on("message:batch", (messages: Record<string, Message>) => {
  console.log("🚀 Chill ~ messages: 收到服务器消息", messages);
  Object.values(messages).forEach(handleNewMessage);
});

// 导出消息store
export const messagesStore = {
  // 状态
  get messages() {
    return messagesState.messages;
  },
  get isLoading() {
    return messagesState.isLoading;
  },
  get error() {
    return messagesState.error;
  },
  get selectedMessageId() {
    return selectedMessageId();
  },

  // 方法
  fetchMessages,
  sendMessage,
  handleNewMessage,
  clearError,
  clearMessages,
  setSelectedMessageId,
};

// 导出类型
export type MessagesStore = typeof messagesStore;
