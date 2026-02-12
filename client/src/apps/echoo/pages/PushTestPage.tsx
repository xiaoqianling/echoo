import { createSignal, onMount, onCleanup, Show, For } from "solid-js";
import { apiService } from "../../../shared/services/api";
import {
  webSocketService,
  ConnectionState,
} from "../../../shared/services/websocket";
import { Message } from "../../../shared/types";
import { notificationsStore } from "../../../shared/stores/notificationsStore";
import "./push-test.scss";

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
    <div class="push-test-page">
      <h1 class="page-title">推送功能测试页面</h1>

      {/* 统计信息 */}
      <div class="status-panel">
        <h2 class="status-title">系统状态</h2>
        <div class="status-grid">
          <div class="status-item">
            <div class="status-value blue">{stats().notifications}</div>
            <div class="status-label">总通知数</div>
          </div>
          <div class="status-item">
            <div class="status-value red">{stats().unread}</div>
            <div class="status-label">未读通知</div>
          </div>
          <div class="status-item">
            <div class="status-value">
              <span
                class={`status-text ${
                  stats().wsState === "connected"
                    ? "connected"
                    : stats().wsState === "connecting" ||
                      stats().wsState === "reconnecting"
                    ? "connecting"
                    : "disconnected"
                }`}
              >
                {stats().wsState}
              </span>
            </div>
            <div class="status-label">WebSocket状态</div>
          </div>
          <div class="status-item">
            <div class="status-value orange">{stats().retryCount}</div>
            <div class="status-label">重试次数</div>
          </div>
        </div>

        <div class="status-actions">
          <button
            onClick={reconnectWebSocket}
            class="btn-reconnect"
            disabled={connectionState() === ConnectionState.CONNECTED}
          >
            重新连接
          </button>
          <button
            onClick={disconnectWebSocket}
            class="btn-disconnect"
            disabled={connectionState() === ConnectionState.DISCONNECTED}
          >
            断开连接
          </button>
          <button onClick={clearNotifications} class="btn-clear">
            清空通知
          </button>
        </div>
      </div>

      <div class="content-grid">
        {/* 发送消息表单 */}
        <div class="card">
          <div class="card-header">
            <h2>发送测试消息</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div class="form-group">
              <label>标题 *</label>
              <input
                type="text"
                value={form().title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div class="form-group">
              <label>Markdown内容</label>
              <textarea
                value={form().desp}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, desp: e.target.value }))
                }
                rows={4}
              ></textarea>
            </div>

            <div class="form-group">
              <label>标签 (用逗号分隔)</label>
              <input
                type="text"
                value={form().tags.join(", ")}
                onChange={handleTagsChange}
                placeholder="test, push, demo"
              />
            </div>

            <div class="form-group">
              <label>简短描述</label>
              <input
                type="text"
                value={form().short}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, short: e.target.value }))
                }
              />
            </div>

            <button
              type="submit"
              class="btn-submit"
              disabled={connectionState() !== ConnectionState.CONNECTED}
            >
              发送消息
            </button>
          </form>

          <Show when={error()}>
            <div class="message-alert error">
              <strong>错误:</strong> {error()}
            </div>
          </Show>

          <Show when={response()}>
            <div class="message-alert success">
              <strong>发送成功:</strong> 消息ID: {response()?.id}
            </div>
          </Show>
        </div>

        {/* WebSocket消息列表 */}
        <div class="card">
          <div class="card-header">
            <h2>实时消息列表</h2>
            <button onClick={clearMessages} class="btn-sm">
              清空列表
            </button>
          </div>

          <div class="messages-list">
            <Show
              when={wsMessages().length > 0}
              fallback={
                <div class="empty-state">
                  <div class="icon">📨</div>
                  <div>等待接收消息...</div>
                </div>
              }
            >
              <For each={wsMessages()}>
                {(message, index) => (
                  <div class="message-item">
                    <div class="message-header">
                      <div class="message-title">{message.title}</div>
                      <div class="message-index">#{index() + 1}</div>
                    </div>
                    <div class="message-short">{message.short}</div>
                    <div class="message-meta">
                      ID: {message.id} | 时间:{" "}
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                    <Show when={message.tags && message.tags.length > 0}>
                      <div class="message-tags">
                        <For each={message.tags}>
                          {(tag) => <span class="tag">{tag}</span>}
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
      <div class="instructions">
        <h3>测试说明</h3>
        <ul>
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
