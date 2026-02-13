import { Show } from "solid-js";
import { A } from "@solidjs/router";
import "./styles.scss";
import { notificationsStore } from "@stores/notificationsStore";
import { authStore } from "@stores/authStore";
import { useTheme } from "@stores/themeStore";
import { NotificationList } from "@components/NotificationList";

// Icons
const NotificationIcon = () => (
  <svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const ThemeIcon = (props: { theme: string }) => (
  <svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <Show when={props.theme === "light"}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </Show>
    <Show when={props.theme === "dark"}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Show>
    <Show when={props.theme === "aemeath"}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </Show>
  </svg>
);

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

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
          <A href="/" class="header-link">
            <h1 class="header-title">Echoo</h1>
          </A>
        </div>
        <div class="header-actions">
          <button
            onClick={toggleTheme}
            class="header-btn theme-btn"
            title="Toggle Theme"
          >
            <ThemeIcon theme={theme()} />
          </button>

          <Show when={authStore.user && !authStore.isLoading}>
            <div class="header-user-info">
              <div style={{ position: "relative" }}>
                <button
                  onClick={handleToggleNotifications}
                  class="header-btn notification-btn"
                  title="Notifications"
                >
                  <NotificationIcon />
                  <Show when={notificationsStore.unreadCount > 0}>
                    <span class="badge">{notificationsStore.unreadCount}</span>
                  </Show>
                </button>
                <Show when={notificationsStore.showNotifications}>
                  <NotificationList />
                </Show>
              </div>
              <span class="username">{authStore.user?.name}</span>
              <button onClick={handleLogout} class="header-btn logout-btn">
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
