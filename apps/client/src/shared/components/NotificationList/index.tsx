import { For, Show } from "solid-js";
import { notificationsStore } from "@stores/notificationsStore";
import "./styles.scss";

export const NotificationList = () => {
  const notifications = () => notificationsStore.notifications;
  const hasUnread = () => notificationsStore.unreadCount > 0;

  const handleMarkAllRead = (e: MouseEvent) => {
    e.stopPropagation();
    notificationsStore.markAllAsRead();
  };

  const handleRead = (id: string) => {
    notificationsStore.markAsRead(id);
  };

  return (
    <div class="notification-popover" onClick={(e) => e.stopPropagation()}>
      <div class="popover-header">
        <h3>Notifications</h3>
        <Show when={hasUnread()}>
          <button class="mark-read-btn" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        </Show>
      </div>
      
      <div class="notification-list">
        <Show when={notifications().length > 0} fallback={
          <div class="empty-state">No notifications</div>
        }>
          <For each={notifications()}>
            {(notification) => (
              <div 
                class={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => handleRead(notification.id)}
              >
                <div class="notification-dot"></div>
                <div class="notification-content">
                  <div class="notification-text">
                    <strong>{notification.message.title}</strong>
                    <Show when={notification.message.desp}>
                      <p>{notification.message.desp}</p>
                    </Show>
                  </div>
                  <div class="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};
