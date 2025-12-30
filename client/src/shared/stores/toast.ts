import { createSignal, createEffect, onCleanup } from "solid-js";

export type ToastType = "success" | "warning" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// 全局Toast状态
const [toasts, setToasts] = createSignal<Toast[]>([]);

// 显示Toast的函数
export const toast = {
  success: (message: string, duration = 3000) =>
    showToast("success", message, duration),
  warning: (message: string, duration = 3000) =>
    showToast("warning", message, duration),
  error: (message: string, duration = 3000) =>
    showToast("error", message, duration),
};

// 内部函数：显示Toast
function showToast(type: ToastType, message: string, duration: number) {
  const id = Math.random().toString(36).substr(2, 9);
  const toast: Toast = { id, type, message, duration };

  // 添加到toast列表
  setToasts((prev) => [...prev, toast]);

  // 自动移除
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

// 移除Toast
function removeToast(id: string) {
  setToasts((prev) => prev.filter((t) => t.id !== id));
}

// 导出状态和函数
export { toasts, removeToast };
