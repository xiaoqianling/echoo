import { A, useLocation } from "@solidjs/router";
import { Show } from "solid-js";
import { authStore } from "@stores/authStore";
import "./styles.scss";

export const Sidebar = () => {
  // In SolidJS, useLocation returns a reactive object with getters
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Helper function to get link class
  const getLinkClass = (path: string): string => {
    return `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive(path) ? "active" : "text-gray-600"
    }`;
  };

  return (
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <ul>
          {/* Home Link - 始终显示 */}
          <li class="sidebar-item">
            <A end href="/" class={getLinkClass("/")}>
              <span class="sidebar-icon">🏠</span>
              <span>Home</span>
            </A>
          </li>

          {/* 登录状态下显示的导航项 */}
          <Show when={authStore.isAuthenticated}>
            <>
              {/* Dashboard Link */}
              <li class="sidebar-item">
                <A end href="/echoo" class={getLinkClass("/echoo")}>
                  <span class="sidebar-icon">📢</span>
                  <span>Echoo Dashboard</span>
                </A>
              </li>

              {/* Organizations Link */}
              <li class="sidebar-item">
                <A
                  end
                  href="/echoo/organizations"
                  class={getLinkClass("/echoo/organizations")}
                >
                  <span class="sidebar-icon">👥</span>
                  <span>Organizations</span>
                </A>
              </li>

              {/* Push Test Link */}
              <li class="sidebar-item">
                <A
                  end
                  href="/echoo/push-test"
                  class={getLinkClass("/echoo/push-test")}
                >
                  <span class="sidebar-icon">🚀</span>
                  <span>Push Test</span>
                </A>
              </li>

              {/* Settings Link */}
              <li class="sidebar-item">
                <A
                  end
                  href="/echoo/settings"
                  class={getLinkClass("/echoo/settings")}
                >
                  <span class="sidebar-icon">⚙️</span>
                  <span>Settings</span>
                </A>
              </li>
            </>
          </Show>

          {/* 未登录状态下只显示Login */}
          <Show when={!authStore.isAuthenticated}>
            <li class="sidebar-item">
              <A end href="/echoo/login" class={getLinkClass("/echoo/login")}>
                <span class="sidebar-icon">🔑</span>
                <span>Login</span>
              </A>
            </li>
          </Show>
        </ul>
      </nav>
    </aside>
  );
};
