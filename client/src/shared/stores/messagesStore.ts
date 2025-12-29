import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { apiService } from "../services/api";
import { webSocketService } from "../services/websocket";
import { Message } from "../types";

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

// Mock数据
const getMockMessages = (): Message[] => [
  {
    id: "local-mock-1",
    title: "Welcome to Echoo",
    desp: "This is your first mock message from Echoo auto-push system.",
    short: "Welcome message",
    tags: ["welcome", "info"],
    sender: {
      id: "mock-user-1",
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    organization: undefined,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "local-mock-2",
    title: "Test Notification",
    desp: "This is a test notification to verify the system is working correctly.",
    short: "Test message",
    tags: ["test", "notification"],
    sender: {
      id: "mock-user-1",
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    organization: undefined,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

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

    // 使用本地mock数据作为 fallback
    const mockMessages = getMockMessages();
    setMessagesState({
      messages: mockMessages,
      error: null,
      isLoading: false,
    });
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
  setMessagesState((prev) => ({
    messages: [message, ...prev.messages],
  }));
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
webSocketService.onNewMessage(handleNewMessage);

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
