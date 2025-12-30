import { Show } from "solid-js";
import { authStore } from "../stores/authStore";
import { notificationsStore } from "../stores/notificationsStore";

export const Header = () => {

  const handleLogout = async () => {
    await authStore.logout();
  };

  const handleToggleNotifications = () => {
    notificationsStore.toggleNotifications();
  };

  return (
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold text-gray-800">Echoo</h1>
        </div>
        <div class="flex items-center space-x-4">
          <Show when={authStore.user && !authStore.isLoading}>
            <div class="flex items-center space-x-3">
              <button
                onClick={handleToggleNotifications}
                class="relative text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Notifications"
              >
                <svg
                  class="h-5 w-5"
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
                  <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationsStore.unreadCount}
                  </span>
                </Show>
              </button>
              <span class="text-gray-600">{authStore.user?.name}</span>
              <button
                onClick={handleLogout}
                class="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </Show>
          <Show when={authStore.isLoading}>
            <div class="text-gray-500">Loading...</div>
          </Show>
        </div>
      </div>
    </header>
  );
};
