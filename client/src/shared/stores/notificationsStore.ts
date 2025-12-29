import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Message } from "../types";

// 定义通知状态接口
interface Notification {
  id: string;
  message: Message;
  read: boolean;
  createdAt: string;
}

// 定义通知状态
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

// 创建通知状态
const [notificationsState, setNotificationsState] =
  createStore<NotificationsState>({
    notifications: [],
    unreadCount: 0,
  });

// 创建信号
export const [showNotifications, setShowNotifications] = createSignal(false);

// 生成通知ID
const generateNotificationId = (): string =>
  `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 添加新通知
export const addNotification = (message: Message): void => {
  const newNotification: Notification = {
    id: generateNotificationId(),
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  setNotificationsState((prev) => ({
    notifications: [newNotification, ...prev.notifications],
    unreadCount: prev.unreadCount + 1,
  }));
};

// 标记通知为已读
export const markAsRead = (id: string): void => {
  setNotificationsState((prev) => {
    const notifications = prev.notifications.map((notification) => {
      if (notification.id === id && !notification.read) {
        return { ...notification, read: true };
      }
      return notification;
    });

    const unreadCount = Math.max(0, prev.unreadCount - 1);
    return { notifications, unreadCount };
  });
};

// 标记所有通知为已读
export const markAllAsRead = (): void => {
  setNotificationsState((prev) => ({
    notifications: prev.notifications.map((notification) => ({
      ...notification,
      read: true,
    })),
    unreadCount: 0,
  }));
};

// 移除通知
export const removeNotification = (id: string): void => {
  setNotificationsState((prev) => {
    const notification = prev.notifications.find((n) => n.id === id);
    const notifications = prev.notifications.filter((n) => n.id !== id);

    return {
      notifications,
      unreadCount: notification?.read
        ? prev.unreadCount
        : Math.max(0, prev.unreadCount - 1),
    };
  });
};

// 清除所有通知
export const clearAllNotifications = (): void => {
  setNotificationsState({
    notifications: [],
    unreadCount: 0,
  });
};

// 切换通知面板显示
export const toggleNotifications = (): void => {
  setShowNotifications(!showNotifications());
};

// 关闭通知面板
export const closeNotifications = (): void => {
  setShowNotifications(false);
};

// 导出通知store
export const notificationsStore = {
  // 状态
  get notifications() {
    return notificationsState.notifications;
  },
  get unreadCount() {
    return notificationsState.unreadCount;
  },
  get showNotifications() {
    return showNotifications();
  },

  // 方法
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  toggleNotifications,
  closeNotifications,
};

// 导出类型
export type NotificationsStore = typeof notificationsStore;
