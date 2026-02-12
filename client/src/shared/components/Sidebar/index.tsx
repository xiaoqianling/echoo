import { A, useLocation } from "@solidjs/router";
import { Show } from "solid-js";
import { authStore } from "@stores/authStore";
import "./styles.scss";

// Icons
const HomeIcon = () => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const DashboardIcon = () => (
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
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const OrgIcon = () => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const PushIcon = () => (
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
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const SettingsIcon = () => (
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
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LoginIcon = () => (
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
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string): string => {
    return `sidebar-link ${isActive(path) ? "active" : ""}`;
  };

  return (
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <ul class="sidebar-list">
          <li class="sidebar-item">
            <A end href="/echoo" class={getLinkClass("/echoo")}>
              <HomeIcon />
              <span class="link-text">Home</span>
            </A>
          </li>

          <Show when={authStore.isAuthenticated}>
            <>
              <li class="sidebar-item">
                <A
                  end
                  href="/echoo/dashboard"
                  class={getLinkClass("/echoo/dashboard")}
                >
                  <DashboardIcon />
                  <span class="link-text">Dashboard</span>
                </A>
              </li>

              <li class="sidebar-item">
                <A
                  end
                  href="/echoo/organizations"
                  class={getLinkClass("/echoo/organizations")}
                >
                  <OrgIcon />
                  <span class="link-text">Organizations</span>
                </A>
              </li>

              <li class="sidebar-item">
                <A
                  end
                  href="/echoo/push-test"
                  class={getLinkClass("/echoo/push-test")}
                >
                  <PushIcon />
                  <span class="link-text">Push Test</span>
                </A>
              </li>

              <li class="sidebar-item">
                <A
                  end
                  href="/echoo/settings"
                  class={getLinkClass("/echoo/settings")}
                >
                  <SettingsIcon />
                  <span class="link-text">Settings</span>
                </A>
              </li>
            </>
          </Show>

          <Show when={!authStore.isAuthenticated}>
            <li class="sidebar-item">
              <A end href="/echoo/login" class={getLinkClass("/echoo/login")}>
                <LoginIcon />
                <span class="link-text">Login</span>
              </A>
            </li>
          </Show>
        </ul>
      </nav>
    </aside>
  );
};
