import { Show } from "solid-js";
import "./styles.scss";
import { notificationsStore } from "../../stores/notificationsStore";
import { authStore } from "../../stores/authStore";

export const Header = () => {
  const handleLogout = async () => {
    await authStore.logout();
  };

  const handleToggleNotifications = () => {
    notificationsStore.toggleNotifications();
  };

  return (
    <header class="header">
      <div class="header-container">
        <div class="header-brand">
          <h1 class="header-title">Echoo</h1>
        </div>
        <div class="header-actions">
          <Show when={authStore.user && !authStore.isLoading}>
            <div class="header-user-info">
              <button
                onClick={handleToggleNotifications}
                class="header-notification-btn"
                title="Notifications"
              >
                <svg
                  class="header-notification-btn-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <Show when={notificationsStore.unreadCount > 0}>
                  <span class="header-notification-btn-badge">
                    {notificationsStore.unreadCount}
                  </span>
                </Show>
              </button>
              <span class="header-username">{authStore.user?.name}</span>
              <button onClick={handleLogout} class="header-logout-btn">
                Logout
              </button>
            </div>
          </Show>
          <Show when={authStore.isLoading}>
            <div class="header-loading">Loading...</div>
          </Show>
        </div>
      </div>
    </header>
  );
};
