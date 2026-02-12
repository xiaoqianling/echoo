import { For, onMount, createMemo, createSignal, Show } from "solid-js";
import { messagesStore, fetchMessages } from "@stores/messagesStore";
import { authStore } from "@stores/authStore";
import { Message } from "@types";
import { LineChart, DonutChart, BarChart } from "@/~/components/ui/charts";
import { useVimShortcuts } from "../hooks/useVimShortcuts";
import { toast } from "@stores/toast";
import "./dashboard.scss";

type TimeRange = "7d" | "30d" | "all";

export const DashboardPage = () => {
  const [timeRange, setTimeRange] = createSignal<TimeRange>("7d");

  onMount(() => {
    fetchMessages();
  });

  const recentMessages = createMemo(() => messagesStore.messages.slice(0, 8));

  const { selectedIndex } = useVimShortcuts({
    itemsLength: () => recentMessages().length,
    onEnter: (index) => {
      const msg = recentMessages()[index];
      toast.info(`Selected: ${msg.title}`);
    },
    onDelete: (index) => {
      const msg = recentMessages()[index];
      toast.error(`Cannot delete from dashboard: ${msg.title}`);
    },
  });

  // 过滤后的消息列表
  const filteredMessages = createMemo(() => {
    const messages = messagesStore.messages;
    const range = timeRange();

    if (range === "all") return messages;

    const now = new Date();
    const days = range === "7d" ? 7 : 30;
    const cutoffDate = new Date(now.setDate(now.getDate() - days));

    return messages.filter((msg) => new Date(msg.createdAt) >= cutoffDate);
  });

  // 统计数据
  const stats = createMemo(() => {
    const messages = filteredMessages();
    const totalMessages = messages.length;
    const uniqueSenders = new Set(messages.map((m) => m.sender.id)).size;
    const uniqueOrgs = new Set(
      messages.filter((m) => m.organization).map((m) => m.organization!.id)
    ).size;

    return {
      totalMessages,
      uniqueSenders,
      uniqueOrgs,
    };
  });

  // 图表颜色配置
  const chartColors = {
    primary: ["#4f46e5", "#7c3aed", "#2563eb", "#3b82f6", "#60a5fa"],
    secondary: ["#ec4899", "#d946ef", "#a855f7", "#8b5cf6", "#6366f1"],
    mixed: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1"],
  };

  // 趋势图数据
  const trendData = createMemo(() => {
    const messages = filteredMessages();
    const range = timeRange();
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 14; // Default to 14 for "all" view in trend

    const counts: Record<string, number> = {};
    const labels: string[] = [];

    // 生成日期标签
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      labels.push(dateStr);
      counts[dateStr] = 0;
    }

    messages.forEach((msg) => {
      const dateStr = new Date(msg.createdAt).toISOString().split("T")[0];
      if (counts[dateStr] !== undefined) {
        counts[dateStr]++;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Message Volume",
          data: labels.map((date) => counts[date]),
          backgroundColor: "rgba(79, 70, 229, 0.2)",
          borderColor: "#4f46e5",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  });

  // 标签分布数据
  const tagDistributionData = createMemo(() => {
    const tagCounts: Record<string, number> = {};
    filteredMessages().forEach((msg) => {
      msg.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    return {
      labels: sortedTags.map(([tag]) => tag),
      datasets: [
        {
          data: sortedTags.map(([, count]) => count),
          backgroundColor: chartColors.mixed,
          borderWidth: 0,
        },
      ],
    };
  });

  // 组织活跃度数据
  const orgActivityData = createMemo(() => {
    const orgCounts: Record<string, number> = {};
    filteredMessages().forEach((msg) => {
      if (msg.organization) {
        orgCounts[msg.organization.name] =
          (orgCounts[msg.organization.name] || 0) + 1;
      } else {
        orgCounts["Personal"] = (orgCounts["Personal"] || 0) + 1;
      }
    });

    const sortedOrgs = Object.entries(orgCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    return {
      labels: sortedOrgs.map(([name]) => name),
      datasets: [
        {
          label: "Messages Count",
          data: sortedOrgs.map(([, count]) => count),
          backgroundColor: chartColors.primary,
          borderRadius: 4,
        },
      ],
    };
  });

  return (
    <div class="dashboard-page">
      <div class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">Dashboard</h1>
          <p class="dashboard-subtitle">
            Overview of your message activities and metrics
          </p>
        </div>

        <div class="time-filter-group">
          <button
            class={`filter-btn ${timeRange() === "7d" ? "active" : ""}`}
            onClick={() => setTimeRange("7d")}
          >
            7 Days
          </button>
          <button
            class={`filter-btn ${timeRange() === "30d" ? "active" : ""}`}
            onClick={() => setTimeRange("30d")}
          >
            30 Days
          </button>
          <button
            class={`filter-btn ${timeRange() === "all" ? "active" : ""}`}
            onClick={() => setTimeRange("all")}
          >
            All Time
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{stats().totalMessages}</span>
            <span class="stat-label">Total Messages</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper green">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{stats().uniqueSenders}</span>
            <span class="stat-label">Active Senders</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper purple">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{stats().uniqueOrgs}</span>
            <span class="stat-label">Active Organizations</span>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card main-chart">
          <div class="chart-header">
            <h3>Message Volume Trend</h3>
          </div>
          <div class="chart-body">
            <LineChart
              data={trendData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { mode: "index", intersect: false },
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        <div class="chart-row">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Top Tags Distribution</h3>
            </div>
            <div class="chart-body">
              <Show
                when={tagDistributionData().labels.length > 0}
                fallback={<div class="no-data">No tag data available</div>}
              >
                <DonutChart
                  data={tagDistributionData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: { usePointStyle: true, padding: 20 },
                      },
                    },
                  }}
                />
              </Show>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Messages by Organization</h3>
            </div>
            <div class="chart-body">
              <Show
                when={orgActivityData().labels.length > 0}
                fallback={
                  <div class="no-data">No organization data available</div>
                }
              >
                <BarChart
                  data={orgActivityData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(0,0,0,0.05)" },
                      },
                      x: { grid: { display: false } },
                    },
                  }}
                />
              </Show>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-messages-section">
        <div class="section-header">
          <h2>Recent Messages</h2>
        </div>
        <div class="table-card">
          <table class="modern-table">
            <thead>
              <tr>
                <th width="30%">Title & Description</th>
                <th width="20%">Organization</th>
                <th width="15%">Sender</th>
                <th width="20%">Tags</th>
                <th width="15%">Date</th>
              </tr>
            </thead>
            <tbody>
              <For each={recentMessages()}>
                {(msg, index) => (
                  <tr class={selectedIndex() === index() ? "vim-selected" : ""}>
                    <td>
                      <div class="cell-content primary">
                        <div class="msg-title">{msg.title}</div>
                        <div class="msg-desc">
                          {msg.short || msg.desp?.slice(0, 50)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        class={`org-badge ${
                          !msg.organization ? "personal" : ""
                        }`}
                      >
                        {msg.organization?.name || "Personal"}
                      </span>
                    </td>
                    <td>
                      <div class="sender-info">
                        <div class="sender-avatar">
                          {msg.sender.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{msg.sender.name}</span>
                      </div>
                    </td>
                    <td>
                      <div class="tags-list">
                        <For each={msg.tags?.slice(0, 3) || []}>
                          {(tag) => <span class="tag-badge">{tag}</span>}
                        </For>
                        {msg.tags && msg.tags.length > 3 && (
                          <span class="tag-more">+{msg.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td class="date-cell">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                )}
              </For>
              <Show when={messagesStore.messages.length === 0}>
                <tr>
                  <td colspan="5" class="empty-state">
                    No messages found
                  </td>
                </tr>
              </Show>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
