import { For } from "solid-js";
import { toasts, removeToast, Toast as ToastType } from "../stores/toast";

// Toast 图标组件
const ToastIcon = (props: { type: ToastType["type"] }) => {
  switch (props.type) {
    case "success":
      return (
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      );
    case "warning":
      return (
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      );
    case "error":
      return (
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
};

// 单个 Toast 组件
const ToastItem = (props: { toast: ToastType }) => {
  const getToastStyles = (type: ToastType["type"]) => {
    const baseStyles =
      "flex items-center p-4 mb-2 rounded-lg shadow-lg transition-all duration-300 transform";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border border-yellow-200 text-yellow-800`;
      case "error":
        return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
      default:
        return `${baseStyles} bg-gray-50 border border-gray-200 text-gray-800`;
    }
  };

  const getIconStyles = (type: ToastType["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div
      class={getToastStyles(props.toast.type)}
      style={{
        animation:
          "toastSlideIn 0.3s ease-out, toastSlideOut 0.3s ease-in 2.7s forwards",
      }}
    >
      <div class={`flex-shrink-0 mr-3 ${getIconStyles(props.toast.type)}`}>
        <ToastIcon type={props.toast.type} />
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">{props.toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(props.toast.id)}
        class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

// Toast 容器组件
export const ToastContainer = () => {
  return (
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div class="space-y-2">
        <For each={toasts()}>{(toast) => <ToastItem toast={toast} />}</For>
      </div>

      {/* 动画样式 */}
      <style>
        {`
          @keyframes toastSlideIn {
            from {
              opacity: 0;
              transform: translateY(-100%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes toastSlideOut {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(-100%) scale(0.9);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ToastContainer;
