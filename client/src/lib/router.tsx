import { RouteDefinition } from "@solidjs/router";
import { EchooLayout } from "../apps/echoo/components/EchooLayout";
import { HomePage } from "../pages/HomePage";
import { BlogPage } from "../apps/blog/pages/BlogPage";
import { DashboardPage } from "../apps/echoo/pages/DashboardPage";
import { MessagesPage } from "../apps/echoo/pages/MessagesPage";
import TestPage from "../apps/echoo/pages/TestPage";
import { SettingsPage } from "../apps/echoo/pages/SettingsPage";
import { LoginPage } from "../apps/echoo/pages/LoginPage";
import { RegisterPage } from "../apps/echoo/pages/RegisterPage";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    // component: EchooLayout, // 根布局（全局导航、页脚）
    children: [
      { path: "", component: HomePage }, // 首页（聚合导航）
      { path: "blog", component: BlogPage }, // 博客子站（路径 /blog）
      {
        path: "echoo",
        component: EchooLayout,
        children: [
          { path: "", component: DashboardPage }, // Echoo 子站（路径 /echoo）
          { path: "messages", component: MessagesPage }, // Echoo 子站（路径 /echoo/messages）
          { path: "test", component: TestPage }, // Echoo 子站（路径 /echoo/test）
          { path: "settings", component: SettingsPage }, // Echoo 子站（路径 /echoo/settings）
          { path: "login", component: LoginPage },
          { path: "register", component: RegisterPage },
        ],
      }, // Echoo 子站（路径 /echoo）
    ],
  },
  // 404 页面配置（兜底路由）
  {
    path: "**",
    component: () => <div>404 页面未找到</div>,
  },
];
