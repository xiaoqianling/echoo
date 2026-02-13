import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { apiService } from "../services/api";
import { webSocketService } from "../services/websocket";
import { Message } from "@echoo/api-types";
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
    
    // 使用模拟数据
    const mockMessages: Message[] = [
      {
        id: "msg1",
        title: "项目进度会议",
        short: "讨论项目进展情况",
        tags: ["会议", "项目"],
        sender: {
          id: "user1",
          email: "admin@example.com",
          name: "管理员",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        organization: {
          id: "org1",
          name: "研发团队",
          description: "公司研发部门",
          owner: {
            id: "user1",
            email: "admin@example.com",
            name: "管理员",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg2",
        title: "需求变更通知",
        short: "产品需求有变更",
        tags: ["通知", "需求"],
        sender: {
          id: "user2",
          email: "product@example.com",
          name: "产品经理",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        organization: {
          id: "org2",
          name: "产品团队",
          description: "产品管理团队",
          owner: {
            id: "user2",
            email: "product@example.com",
            name: "产品经理",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg3",
        title: "设计评审",
        short: "UI设计评审会议",
        tags: ["会议", "设计"],
        sender: {
          id: "user3",
          email: "design@example.com",
          name: "设计师",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        organization: {
          id: "org1",
          name: "研发团队",
          description: "公司研发部门",
          owner: {
            id: "user1",
            email: "admin@example.com",
            name: "管理员",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg4",
        title: "Bug修复进展",
        short: "本周Bug修复情况",
        tags: ["bug", "修复"],
        sender: {
          id: "user1",
          email: "admin@example.com",
          name: "管理员",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        organization: {
          id: "org1",
          name: "研发团队",
          description: "公司研发部门",
          owner: {
            id: "user1",
            email: "admin@example.com",
            name: "管理员",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg5",
        title: "新功能发布",
        short: "V2.0版本发布通知",
        tags: ["发布", "功能"],
        sender: {
          id: "user2",
          email: "product@example.com",
          name: "产品经理",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        organization: {
          id: "org2",
          name: "产品团队",
          description: "产品管理团队",
          owner: {
            id: "user2",
            email: "product@example.com",
            name: "产品经理",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg6",
        title: "技术分享会",
        short: "前端技术分享",
        tags: ["会议", "技术"],
        sender: {
          id: "user1",
          email: "admin@example.com",
          name: "管理员",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        organization: {
          id: "org1",
          name: "研发团队",
          description: "公司研发部门",
          owner: {
            id: "user1",
            email: "admin@example.com",
            name: "管理员",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "msg7",
        title: "项目计划制定",
        short: "制定下季度项目计划",
        tags: ["会议", "计划"],
        sender: {
          id: "user2",
          email: "product@example.com",
          name: "产品经理",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        organization: {
          id: "org2",
          name: "产品团队",
          description: "产品管理团队",
          owner: {
            id: "user2",
            email: "product@example.com",
            name: "产品经理",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    
    setMessagesState({
      messages: mockMessages,
      isLoading: false,
      error: null,
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
