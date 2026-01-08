import { For, onMount, createMemo } from "solid-js";
import { messagesStore, fetchMessages } from "@stores/messagesStore";
import { authStore } from "@stores/authStore";
import { Message } from "@types";
import { LineChart, DonutChart, BarChart } from "@/~/components/ui/charts";
import { unwrap } from "solid-js/store";

export const DashboardPage = () => {
  // 组件挂载时获取消息列表
  onMount(() => {
    fetchMessages();
  });

  // 按天统计消息数量
  const messagesByDay = createMemo(() => {
    const counts: Record<string, number> = {};
    const messages = messagesStore.messages;

    // 获取最近7天的日期
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    // 初始化计数为0
    last7Days.forEach((day) => {
      counts[day.toString()] = 0;
    });

    // 统计每天的消息数量
    messages.forEach((msg) => {
      const msgDate = new Date(msg.createdAt).toISOString().split("T")[0];
      if (counts[msgDate] !== undefined) {
        counts[msgDate]++;
      }
    });

    console.log(
      "🚀 Chill ~ DashboardPage ~ counts: !!!",
      counts,
      unwrap(messages)
    );
    return {
      labels: last7Days,
      values: last7Days.map((day) => {
        return counts[day];
      }),
    };
  });

  // 按标签统计消息数量
  const messagesByTag = createMemo(() => {
    const tagCounts: Record<string, number> = {};

    messagesStore.messages.forEach((msg) => {
      msg.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // 只显示前5个标签
    const sortedTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedTags.map(([tag]) => tag),
      values: sortedTags.map(([, count]) => count),
    };
  });

  // 按组织统计消息数量
  const messagesByOrganization = createMemo(() => {
    const orgCounts: Record<string, number> = {};

    messagesStore.messages.forEach((msg) => {
      if (msg.organization) {
        const orgName = msg.organization.name;
        orgCounts[orgName] = (orgCounts[orgName] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(orgCounts),
      values: Object.values(orgCounts),
    };
  });

  // 图表配置
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeInOutQuart" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "Segoe UI, system-ui, sans-serif",
            size: 14,
            weight: "bold" as const,
          },
        },
      },
      title: {
        display: true,
        text: "最近7天消息趋势",
        font: {
          family: "Segoe UI, system-ui, sans-serif",
          size: 18,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: "Segoe UI, system-ui, sans-serif",
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "Segoe UI, system-ui, sans-serif",
            size: 12,
          },
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1500,
      easing: "easeInOutQuart" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "Segoe UI, system-ui, sans-serif",
            size: 14,
            weight: "bold" as const,
          },
        },
      },
      title: {
        display: true,
        text: "消息标签分布",
        font: {
          family: "Segoe UI, system-ui, sans-serif",
          size: 18,
          weight: "bold" as const,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeInOutQuart" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "Segoe UI, system-ui, sans-serif",
            size: 14,
            weight: "bold" as const,
          },
        },
      },
      title: {
        display: true,
        text: "组织消息分布",
        font: {
          family: "Segoe UI, system-ui, sans-serif",
          size: 18,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: "Segoe UI, system-ui, sans-serif",
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: "Segoe UI, system-ui, sans-serif",
            size: 12,
          },
        },
      },
    },
  };

  // 图表数据 - 使用createMemo使其响应式
  const lineChartData = createMemo(() => ({
    labels: messagesByDay().labels,
    datasets: [
      {
        label: "消息数量",
        data: messagesByDay().values,
      },
    ],
  }));

  const doughnutChartData = createMemo(() => ({
    labels: messagesByTag().labels,
    datasets: [
      {
        data: messagesByTag().values,
      },
    ],
  }));

  const barChartData = createMemo(() => ({
    labels: messagesByOrganization().labels,
    datasets: [
      {
        label: "消息数量",
        data: messagesByOrganization().values,
      },
    ],
  }));

  return (
    <div class="dashboard-page">
      <div class="flex justify-between items-center mb-8">
        <div class="dashboard-header-content">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {authStore.user?.name}!
          </h1>
          <p class="text-gray-600">
            Here's what's happening with your messages
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Messages</p>
              <h3 class="text-3xl font-bold text-gray-800">
                {messagesStore.messages.length}
              </h3>
            </div>
            <div class="bg-blue-100 p-4 rounded-full transition-all duration-300 hover:bg-blue-200">
              <span class="text-blue-600 text-2xl">💬</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
            <div class="bg-green-100 p-4 rounded-full transition-all duration-300 hover:bg-green-200">
              <span class="text-green-600 text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
            <div class="bg-purple-100 p-4 rounded-full transition-all duration-300 hover:bg-purple-200">
              <span class="text-purple-600 text-2xl">🏷️</span>
            </div>
          </div>
        </div>
      </div>

      {/* 图表部分 */}
      <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 折线图 - 最近7天消息趋势 */}
        <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <div class="h-80">
            <LineChart data={lineChartData()} />
          </div>
        </div>

        {/* 环形图 - 消息标签分布 */}
        <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <div class="h-80">
            <DonutChart data={doughnutChartData()} />
          </div>
        </div>

        {/* 柱状图 - 组织消息分布 */}
        <div class="bg-white rounded-xl shadow-lg p-6 lg:col-span-2 transition-all duration-300 hover:shadow-xl">
          <div class="h-80">
            <BarChart data={barChartData()} />
          </div>
        </div>
      </div>

      <div class="mt-10">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Recent Messages</h2>
        </div>

        {messagesStore.isLoading ? (
          <div class="flex justify-center items-center py-10 bg-white rounded-xl shadow-lg">
            {messagesStore.isLoading ? "true" : "false"}
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <For each={messagesStore.messages.slice(0, 5)}>
                  {(message) => (
                    <tr class="transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                      <td class="px-8 py-6 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">
                          {message.title}
                        </div>
                        {message.short && (
                          <div class="text-sm text-gray-500 mt-1">
                            {message.short}
                          </div>
                        )}
                      </td>
                      <td class="px-8 py-6 whitespace-nowrap">
                        <div class="text-sm text-gray-900">
                          {message.sender.name}
                        </div>
                      </td>
                      <td class="px-8 py-6 whitespace-nowrap">
                        <div class="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td class="px-8 py-6 whitespace-nowrap">
                        <div class="flex space-x-2">
                          <For each={message.tags || []}>
                            {(tag) => (
                              <span class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full transition-all duration-300 hover:bg-blue-200">
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
