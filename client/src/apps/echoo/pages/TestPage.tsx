import { createSignal, onMount, onCleanup } from 'solid-js';
import { apiService } from '../../../shared/services/api';
import { webSocketService } from '../../../shared/services/websocket';
import { Message } from '../../../shared/types';

export default function TestPage() {
  const [form, setForm] = createSignal({
    title: '测试消息',
    desp: '# 测试Markdown内容\n\n这是一条测试消息',
    tags: ['test', 'echoo'],
    short: '测试摘要',
  });
  
  const [response, setResponse] = createSignal<Message | null>(null);
  const [requestParams, setRequestParams] = createSignal<any>(null);
  const [wsMessages, setWsMessages] = createSignal<Message[]>([]);
  const [error, setError] = createSignal<string | null>(null);

  // 监听WebSocket消息
  const handleNewMessage = (message: Message) => {
    setWsMessages(prev => [message, ...prev]);
  };

  // 组件挂载时添加监听
  onMount(() => {
    webSocketService.onNewMessage(handleNewMessage);
  });

  // 组件卸载时移除监听
  onCleanup(() => {
    webSocketService.offNewMessage(handleNewMessage);
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    
    try {
      // 获取当前表单值
      const currentForm = form();
      
      // 保存请求参数用于打印
      const params = {
        title: currentForm.title,
        desp: currentForm.desp,
        tags: currentForm.tags.length > 0 ? currentForm.tags : undefined,
        short: currentForm.short || undefined,
      };
      setRequestParams(params);
      
      // 发送请求
      const res = await apiService.sendMessage(params);
      setResponse(res);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送失败';
      setError(errorMessage);
    }
  };

  const handleTagsChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const tags = target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setForm(prev => ({ ...prev, tags }));
  };

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Echoo 测试页面</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 发送消息表单 */}
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">发送测试消息</h2>
          
          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
              <input
                type="text"
                value={form().title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Markdown内容</label>
              <textarea
                value={form().desp}
                onChange={(e) => setForm(prev => ({ ...prev, desp: e.target.value }))}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">标签 (用逗号分隔)</label>
              <input
                type="text"
                value={form().tags.join(', ')}
                onChange={handleTagsChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test, echoo"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">短摘要</label>
              <input
                type="text"
                value={form().short}
                onChange={(e) => setForm(prev => ({ ...prev, short: e.target.value }))}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="测试摘要"
              />
            </div>
            
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              发送测试消息
            </button>
          </form>
          
          {error() && (
            <div class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              <h3 class="font-semibold mb-2">错误信息:</h3>
              <pre class="whitespace-pre-wrap">{error()}</pre>
            </div>
          )}
        </div>
        
        {/* 结果展示 */}
        <div class="space-y-6">
          {/* 请求参数 */}
          {requestParams() && (
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-xl font-semibold mb-4">请求参数</h2>
              <pre class="whitespace-pre-wrap p-4 bg-gray-50 border border-gray-200 rounded-md overflow-x-auto">
                {JSON.stringify(requestParams(), null, 2)}
              </pre>
            </div>
          )}
          
          {/* 响应结果 */}
          {response() && (
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-xl font-semibold mb-4">响应结果</h2>
              <pre class="whitespace-pre-wrap p-4 bg-gray-50 border border-gray-200 rounded-md overflow-x-auto">
                {JSON.stringify(response(), null, 2)}
              </pre>
            </div>
          )}
          
          {/* WebSocket推送消息 */}
          {wsMessages().length > 0 && (
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-xl font-semibold mb-4">WebSocket推送消息 ({wsMessages().length})</h2>
              <div class="space-y-4 max-h-80 overflow-y-auto">
                {wsMessages().map((msg, index) => (
                  <div class="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <pre class="whitespace-pre-wrap">{JSON.stringify(msg, null, 2)}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}