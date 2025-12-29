# Echoo 自动推送系统

面向开发者的自动推送系统，提供简单的send HTTP接口发送消息，支持桌面应用、Web、App全平台推送。

## 技术栈

### 后端
- Node.js + NestJS（企业级框架，TypeScript优先）
- TypeORM + PostgreSQL（数据库）
- JWT（身份认证）
- Socket.IO（WebSocket实时通信）

### 前端
- SolidJS（高性能前端框架）
- TypeScript（全栈类型安全）
- TailwindCSS（样式）
- @solidjs/router（路由）

## 架构

### 前后端分离
- 后端：`/server` 目录
- 前端：`/client` 目录

## 快速开始

### 后端启动

```bash
cd server
pnpm install
pnpm run start:dev
```

服务端将运行在 http://localhost:3000

### 前端启动

```bash
cd client
pnpm install
pnpm run dev
```

前端将运行在 http://localhost:5173

## API 文档

### 对外公开的send接口

```
POST /api/send
```

**参数：**
- `title`：必填，消息标题
- `desp`：选填，Markdown格式的消息内容
- `tags`：选填，标签数组（string[]）
- `short`：选填，消息短摘要
- `organizationId`：选填，组织ID

**返回：**
- 成功：201 Created，返回消息对象
- 失败：400 Bad Request 或 401 Unauthorized

**示例请求：**

```bash
curl -X POST http://localhost:3000/api/send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试消息",
    "desp": "# 测试Markdown内容\n\n这是一条测试消息",
    "tags": ["test", "echoo"],
    "short": "测试摘要"
  }'
```

### 测试接口

#### 生成测试用户

```
POST /test/generate-test-user
```

**返回：**
- 测试用户信息和访问令牌

#### 发送测试消息

```
POST /test/send-test-message
```

**参数：**
- 同 `/api/send` 接口

**返回：**
- 测试消息对象

## 前端功能

### 路由
- `/login`：登录页面
- `/register`：注册页面
- `/`：仪表盘
- `/messages`：消息列表
- `/test`：测试页面（用于测试发送请求和结果、推送结果）

### 测试页面

测试页面位于 `/test`，提供以下功能：
- 发送消息表单，支持填写title、desp、tags、short参数
- 显示请求参数
- 显示响应结果
- 显示WebSocket推送的消息

## 开发说明

### 服务端模块化设计

服务端按功能分为以下模块：
- `auth`：认证模块
- `users`：用户模块
- `organizations`：组织模块
- `messages`：消息模块
- `websocket`：WebSocket模块

### 数据库设计

- `users`：用户表
- `organizations`：组织表
- `organization_members`：组织成员表
- `messages`：消息表

### Mock数据支持

服务端支持使用mock数据，通过修改 `messages.service.ts` 中的 `useMockData` 配置项控制：

```typescript
// 在 messages.service.ts 中
private readonly useMockData = true; // true：使用mock数据，false：使用数据库
```

## 部署说明

### 环境变量

服务端支持以下环境变量：

- `PORT`：服务端口（默认：3000）
- `DB_HOST`：数据库主机（默认：localhost）
- `DB_PORT`：数据库端口（默认：5432）
- `DB_USERNAME`：数据库用户名（默认：bytedance）
- `DB_PASSWORD`：数据库密码（默认：空）
- `DB_NAME`：数据库名称（默认：echoo）
- `JWT_SECRET`：JWT密钥（默认：secretKey）
- `JWT_EXPIRES_IN`：JWT过期时间（默认：86400秒）
- `JWT_REFRESH_SECRET`：JWT刷新密钥（默认：refreshSecretKey）
- `JWT_REFRESH_EXPIRES_IN`：JWT刷新过期时间（默认：604800秒）

## 许可证

MIT
