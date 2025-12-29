import { RouteDefinition } from "@solidjs/router";
import { EchooLayout } from "../apps/echoo/components/EchooLayout";
import { HomePage } from "../pages/HomePage";
import { BlogPage } from "../apps/blog/pages/BlogPage";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: EchooLayout, // 根布局（全局导航、页脚）
    children: [
      { path: "", component: HomePage }, // 首页（聚合导航）
      { path: "blog", component: BlogPage }, // 博客子站（路径 /blog）
    ],
  },
  // 404 页面配置（兜底路由）
  {
    path: "**",
    component: () => <div>404 页面未找到</div>,
  },
];
