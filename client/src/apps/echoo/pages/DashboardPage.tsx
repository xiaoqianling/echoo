import { For, onMount } from "solid-js";
import {
  messagesStore,
  fetchMessages,
} from "../../../shared/stores/messagesStore";
import { authStore } from "../../../shared/stores/authStore";
import { Message } from "../../../shared/types";

export const DashboardPage = () => {
  // 组件挂载时获取消息列表
  onMount(() => {
    console.log("🚀 ~ DashboardPage ~ onMount:");
    fetchMessages();
  });

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">
            Welcome, {authStore.user?.name}!
          </h1>
          <p class="text-gray-600">
            Here's what's happening with your messages
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Messages</p>
              <h3 class="text-3xl font-bold text-gray-800">
                {messagesStore.messages.length}
              </h3>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <span class="text-blue-600 text-xl">💬</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Today's Messages</p>
              <h3 class="text-3xl font-bold text-gray-800">
                {
                  messagesStore.messages.filter((msg: Message) => {
                    const today = new Date();
                    const msgDate = new Date(msg.createdAt);
                    return msgDate.toDateString() === today.toDateString();
                  }).length
                }
              </h3>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <span class="text-green-600 text-xl">📅</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Unique Tags</p>
              <h3 class="text-3xl font-bold text-gray-800">
                {
                  new Set(
                    messagesStore.messages.flatMap(
                      (msg: Message) => msg.tags || []
                    )
                  ).size
                }
              </h3>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <span class="text-purple-600 text-xl">🏷️</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Recent Messages</h2>
        </div>

        {messagesStore.isLoading ? (
          <div class="flex justify-center items-center py-10">
            {messagesStore.isLoading ? "true" : "false"}
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <For each={messagesStore.messages.slice(0, 5)}>
                  {(message) => (
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">
                          {message.title}
                        </div>
                        {message.short && (
                          <div class="text-sm text-gray-500">
                            {message.short}
                          </div>
                        )}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                          {message.sender.name}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex space-x-2">
                          <For each={message.tags || []}>
                            {(tag) => (
                              <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {tag}
                              </span>
                            )}
                          </For>
                        </div>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
