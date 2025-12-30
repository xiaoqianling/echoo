import { createSignal, For, Show, onMount } from "solid-js";
import {
  messagesStore,
  fetchMessages,
  sendMessage,
} from "../../../shared/stores/messagesStore";
import { toast } from "../../../shared/stores/toast";

export const MessagesPage = () => {
  const [isSending, setIsSending] = createSignal(false);
  const [sendError, setSendError] = createSignal("");

  const [title, setTitle] = createSignal("");
  const [desp, setDesp] = createSignal("");
  const [short, setShort] = createSignal("");
  const [tags, setTags] = createSignal("");

  // 组件挂载时获取消息
  onMount(() => {
    fetchMessages();
  });

  const handleSendMessage = async (e: Event) => {
    e.preventDefault();
    setSendError("");
    setIsSending(true);

    try {
      const tagsArray = tags()
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await sendMessage({
        title: title(),
        desp: desp(),
        short: short(),
        tags: tagsArray,
      });

      // 清空表单
      setTitle("");
      setDesp("");
      setShort("");
      setTags("");

      // 显示成功提示
      toast.success("消息发送成功！");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "发送消息失败";
      setSendError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Messages</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Message Form */}
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">
              Send New Message
            </h2>

            {sendError() && (
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {sendError()}
              </div>
            )}

            <form onSubmit={handleSendMessage}>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={title()}
                  onInput={(e) => setTitle(e.currentTarget.value)}
                  required
                />
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-medium mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={short()}
                  onInput={(e) => setShort(e.currentTarget.value)}
                  placeholder="A short summary of the message"
                />
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-medium mb-2">
                  Description (Markdown)
                </label>
                <textarea
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  value={desp()}
                  onInput={(e) => setDesp(e.currentTarget.value)}
                  placeholder="Message content in Markdown format"
                ></textarea>
              </div>

              <div class="mb-6">
                <label class="block text-gray-700 text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={tags()}
                  onInput={(e) => setTags(e.currentTarget.value)}
                  placeholder="e.g., alert, info, urgent"
                />
              </div>

              <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                disabled={isSending()}
              >
                {isSending() ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Messages List */}
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800">Message History</h2>
              <button
                onClick={() => fetchMessages()}
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                Refresh
              </button>
            </div>

            {messagesStore.error && (
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {messagesStore.error}
              </div>
            )}

            {messagesStore.isLoading ? (
              <div class="flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Show
                when={messagesStore.messages.length > 0}
                fallback={
                  <div class="text-center py-10 text-gray-500">
                    No messages yet
                  </div>
                }
              >
                <div class="space-y-4">
                  <For each={messagesStore.messages}>
                    {(message) => (
                      <div class="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div class="flex justify-between items-start mb-2">
                          <div>
                            <h3 class="text-lg font-semibold text-gray-800">
                              {message.title}
                            </h3>
                            <p class="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {message.short && (
                          <div class="text-gray-700 mb-2">{message.short}</div>
                        )}

                        {message.desp && (
                          <div class="text-gray-600 mb-3 whitespace-pre-wrap">
                            {message.desp}
                          </div>
                        )}

                        <Show when={message.tags && message.tags.length > 0}>
                          <div class="flex flex-wrap gap-2">
                            <For each={message.tags}>
                              {(tag) => (
                                <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {tag}
                                </span>
                              )}
                            </For>
                          </div>
                        </Show>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
