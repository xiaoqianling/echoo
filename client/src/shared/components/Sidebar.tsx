import { A, useLocation } from "@solidjs/router";

export const Sidebar = () => {
  // In SolidJS, useLocation returns a reactive object with getters
  const location = useLocation();

  // Log current path for debugging - use the getter function
  console.log("Current Path:", location.pathname);

  return (
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <ul>
          {/* Home Link - Never active */}
          <li class="sidebar-item">
            <A
              href="/"
              class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-gray-600 hover:text-blue-700"
            >
              <span class="text-lg">🏠</span>
              <span>Home</span>
            </A>
          </li>

          {/* Dashboard Link - Active only on exact match */}
          <li class="sidebar-item">
            <A
              href="/echoo"
              class={
                location.pathname === "/echoo"
                  ? "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-blue-600 bg-blue-50"
                  : "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-gray-600 hover:text-blue-700"
              }
            >
              <span class="text-lg">📢</span>
              <span>Echoo Dashboard</span>
            </A>
          </li>

          {/* Messages Link - Active only on exact match */}
          <li class="sidebar-item">
            <A
              href="/echoo/messages"
              class={
                location.pathname === "/echoo/messages"
                  ? "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-blue-600 bg-blue-50"
                  : "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-gray-600 hover:text-blue-700"
              }
            >
              <span class="text-lg">💬</span>
              <span>Messages</span>
            </A>
          </li>

          {/* Test Link - Active only on exact match */}
          <li class="sidebar-item">
            <A
              href="/echoo/test"
              class={
                location.pathname === "/echoo/test"
                  ? "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-blue-600 bg-blue-50"
                  : "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-gray-600 hover:text-blue-700"
              }
            >
              <span class="text-lg">🧪</span>
              <span>Test</span>
            </A>
          </li>

          {/* Settings Link - Active only on exact match */}
          <li class="sidebar-item">
            <A
              href="/echoo/settings"
              class={
                location.pathname === "/echoo/settings"
                  ? "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-blue-600 bg-blue-50"
                  : "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-gray-600 hover:text-blue-700"
              }
            >
              <span class="text-lg">⚙️</span>
              <span>Settings</span>
            </A>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
