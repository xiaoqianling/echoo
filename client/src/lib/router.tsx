import { RouteDefinition } from "@solidjs/router";
import { EchooLayout } from "../apps/echoo/components/EchooLayout";
import { HomePage } from "../pages/HomePage";
import { BlogPage } from "../apps/blog/pages/BlogPage";
import { DashboardPage } from "../apps/echoo/pages/DashboardPage";
import PushTestPage from "../apps/echoo/pages/PushTestPage";
import { SettingsPage } from "../apps/echoo/pages/SettingsPage";
import { LoginPage } from "../apps/echoo/pages/LoginPage";
import { RegisterPage } from "../apps/echoo/pages/RegisterPage";
import OrganizationsPage from "../apps/echoo/pages/OrganizationsPage";
import { AuthGuard } from "../shared/components/AuthGuard";

// 受保护的路由包装器
const ProtectedRoute = (props: { component: any }) => (
  <AuthGuard requireAuth>
    <props.component />
  </AuthGuard>
);

// 公开路由（仅未登录用户可访问）
const PublicRoute = (props: { component: any }) => (
  <AuthGuard requireAuth={false}>
    <props.component />
  </AuthGuard>
);

export const routes: RouteDefinition[] = [
  {
    path: "/",
    children: [
      { path: "", component: HomePage }, // 首页（聚合导航）
      { path: "blog", component: BlogPage }, // 博客子站（路径 /blog）
      {
        path: "echoo",
        component: EchooLayout,
        children: [
          // 受保护的路由
          {
            path: "",
            component: () => <ProtectedRoute component={DashboardPage} />,
          },
          {
            path: "organizations",
            component: () => <ProtectedRoute component={OrganizationsPage} />,
          },
          {
            path: "push-test",
            component: () => <ProtectedRoute component={PushTestPage} />,
          },
          {
            path: "settings",
            component: () => <ProtectedRoute component={SettingsPage} />,
          },
          {
            path: "login",
            component: () => <PublicRoute component={LoginPage} />,
          },

          // 公开路由（仅未登录用户可访问）
          {
            path: "register",
            component: () => <PublicRoute component={RegisterPage} />,
          },
        ],
      },
    ],
  },
  // 404 页面配置（兜底路由）
  {
    path: "**",
    component: () => <div>404 页面未找到</div>,
  },
];
