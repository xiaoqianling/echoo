import { createSignal, onMount, onCleanup, Show, For } from "solid-js";
import { apiService } from "../../../shared/services/api";
import {
  webSocketService,
  ConnectionState,
} from "../../../shared/services/websocket";
import { Message } from "../../../shared/types";
import { notificationsStore } from "../../../shared/stores/notificationsStore";

export default function PushTestPage() {
  const [form, setForm] = createSignal({
    title: "测试推送消息",
    desp: "# 测试Markdown内容\n\n这是一条测试推送消息",
    tags: ["test", "push"],
    short: "测试推送摘要",
  });

  const [response, setResponse] = createSignal<Message | null>(null);
  const [wsMessages, setWsMessages] = createSignal<Message[]>([]);
  const [connectionState, setConnectionState] = createSignal<ConnectionState>(
    ConnectionState.DISCONNECTED
  );
  const [error, setError] = createSignal<string | null>(null);
  const [stats, setStats] = createSignal({
    notifications: 0,
    unread: 0,
    wsState: "",
    retryCount: 0,
  });

  // 监听WebSocket消息
  const handleNewMessage = (message: Message) => {
    console.log("📨 Received WebSocket message:", message);
    setWsMessages((prev) => [message, ...prev]);

    // 添加到通知系统
    notificationsStore.addNotification(message);
  };

  // 监听连接状态变化
  const handleStateChange = (state: ConnectionState) => {
    console.log("🔌 WebSocket state changed:", state);
    setConnectionState(state);
    updateStats();
  };

  // 更新统计信息
  const updateStats = () => {
    setStats({
      notifications: notificationsStore.notifications.length,
      unread: notificationsStore.unreadCount,
      wsState: connectionState(),
      retryCount: webSocketService.getRetryCount(),
    });
  };

  // 组件挂载时添加监听并连接WebSocket
  onMount(async () => {
    webSocketService.on("message:new", handleNewMessage);
    webSocketService.on(
      "message:batch",
      (messages: Record<string, Message>) => {
        Object.values(messages).forEach(handleNewMessage);
      }
    );
    webSocketService.onStateChange(handleStateChange);

    // 初始状态
    setConnectionState(webSocketService.getConnectionState());
    updateStats();

    // 如果未连接，自动连接WebSocket
    if (
      webSocketService.getConnectionState() === ConnectionState.DISCONNECTED
    ) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        console.log("🔌 Auto-connecting WebSocket...");
        await webSocketService.connect(token);
      } else {
        console.log("⚠️ No access token available for WebSocket connection");
      }
    }

    // 定期更新统计
    const interval = setInterval(updateStats, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  // 组件卸载时移除监听
  onCleanup(() => {
    webSocketService.off("message:new", handleNewMessage);
    webSocketService.offStateChange(handleStateChange);
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      // 获取当前表单值
      const currentForm = form();

      // 发送请求
      console.log("📤 Sending message request...");
      const res = await apiService.sendMessage({
        title: currentForm.title,
        desp: currentForm.desp,
        tags: currentForm.tags.length > 0 ? currentForm.tags : undefined,
        short: currentForm.short || undefined,
      });

      console.log("✅ Message sent successfully:", res);
      setResponse(res);

      // 显示成功提示
      import("../../../shared/stores/toast").then(({ toast }) => {
        toast.success("消息发送成功");
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "发送失败";
      console.error("❌ Message send failed:", err);
      setError(errorMessage);

      // 显示错误提示
      import("../../../shared/stores/toast").then(({ toast }) => {
        toast.error(`发送失败: ${errorMessage}`);
      });
    }
  };

  const handleTagsChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const tags = target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setForm((prev) => ({ ...prev, tags }));
  };

  const clearMessages = () => {
    setWsMessages([]);
  };

  const clearNotifications = () => {
    notificationsStore.clearAllNotifications();
    updateStats();
  };

  const reconnectWebSocket = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      await webSocketService.connect(token);
    }
  };

  const disconnectWebSocket = () => {
    webSocketService.disconnect();
  };

  return (
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">推送功能测试页面</h1>

      {/* 统计信息 */}
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold mb-3">系统状态</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {stats().notifications}
            </div>
            <div class="text-sm text-gray-600">总通知数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{stats().unread}</div>
            <div class="text-sm text-gray-600">未读通知</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold capitalize">
              <span
                class={{
                  "text-green-600": stats().wsState === "connected",
                  "text-yellow-600":
                    stats().wsState === "connecting" ||
                    stats().wsState === "reconnecting",
                  "text-red-600": stats().wsState === "disconnected",
                }}
              >
                {stats().wsState}
              </span>
            </div>
            <div class="text-sm text-gray-600">WebSocket状态</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">
              {stats().retryCount}
            </div>
            <div class="text-sm text-gray-600">重试次数</div>
          </div>
        </div>

        <div class="mt-4 flex space-x-2">
          <button
            onClick={reconnectWebSocket}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={connectionState() === ConnectionState.CONNECTED}
          >
            重新连接
          </button>
          <button
            onClick={disconnectWebSocket}
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            disabled={connectionState() === ConnectionState.DISCONNECTED}
          >
            断开连接
          </button>
          <button
            onClick={clearNotifications}
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            清空通知
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 发送消息表单 */}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">发送测试消息</h2>

          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                标题 *
              </label>
              <input
                type="text"
                value={form().title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Markdown内容
              </label>
              <textarea
                value={form().desp}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, desp: e.target.value }))
                }
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                标签 (用逗号分隔)
              </label>
              <input
                type="text"
                value={form().tags.join(", ")}
                onChange={handleTagsChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test, push, demo"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                简短描述
              </label>
              <input
                type="text"
                value={form().short}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, short: e.target.value }))
                }
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
              disabled={connectionState() !== ConnectionState.CONNECTED}
            >
              发送消息
            </button>
          </form>

          <Show when={error()}>
            <div class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <strong>错误:</strong> {error()}
            </div>
          </Show>

          <Show when={response()}>
            <div class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              <strong>发送成功:</strong> 消息ID: {response()?.id}
            </div>
          </Show>
        </div>

        {/* WebSocket消息列表 */}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">实时消息列表</h2>
            <button
              onClick={clearMessages}
              class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              清空列表
            </button>
          </div>

          <div class="space-y-3 max-h-96 overflow-y-auto">
            <Show
              when={wsMessages().length > 0}
              fallback={
                <div class="text-center text-gray-500 py-8">
                  <div class="text-4xl mb-2">📨</div>
                  <div>等待接收消息...</div>
                </div>
              }
            >
              <For each={wsMessages()}>
                {(message, index) => (
                  <div class="p-3 bg-blue-50 border border-blue-200 rounded">
                    <div class="flex justify-between items-start">
                      <div>
                        <div class="font-semibold text-blue-800">
                          {message.title}
                        </div>
                        <div class="text-sm text-blue-600 mt-1">
                          {message.short}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          ID: {message.id} | 时间:{" "}
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        #{index() + 1}
                      </div>
                    </div>
                    <Show when={message.tags && message.tags.length > 0}>
                      <div class="mt-2 flex flex-wrap gap-1">
                        <For each={message.tags}>
                          {(tag) => (
                            <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                )}
              </For>
            </Show>
          </div>
        </div>
      </div>

      {/* 测试说明 */}
      <div class="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 class="text-lg font-semibold text-yellow-800 mb-2">测试说明</h3>
        <ul class="list-disc list-inside space-y-1 text-yellow-700">
          <li>确保WebSocket状态显示为"connected"才能发送消息</li>
          <li>发送消息后，会在右侧实时消息列表中显示推送的消息</li>
          <li>同时会显示在页面的通知横幅中</li>
          <li>可以打开多个浏览器标签页测试多客户端推送</li>
          <li>可以测试断开连接和重新连接功能</li>
        </ul>
      </div>
    </div>
  );
}
