# 组织功能服务端技术方案

## 1. 需求分析

### 1.1 核心功能

- 组织管理：创建、查看、更新、删除组织
- 成员管理：添加成员、移除成员、任命管理员、移交所有者权限
- 权限管理：区分owner、管理员、成员三种角色权限
- 消息管理：发布组织消息、查看组织消息历史

### 1.2 权限设计

| 权限项 | Owner | 管理员 | 成员 |
|--------|-------|--------|------|
| 创建组织 | ✅ | ❌ | ❌ |
| 解散组织 | ✅ | ❌ | ❌ |
| 移交owner权限 | ✅ | ❌ | ❌ |
| 添加成员 | ✅ | ✅ | ❌ |
| 移除成员 | ✅ | ✅ | ❌ |
| 任命管理员 | ✅ | ✅ | ❌ |
| 发布消息 | ✅ | ✅ | ❌ |
| 查看组织信息 | ✅ | ✅ | ✅ |
| 查看成员列表 | ✅ | ✅ | ✅ |
| 查看消息列表 | ✅ | ✅ | ✅ |
| 退出组织 | ❌ | ✅ | ✅ |

## 2. 数据模型设计

### 2.1 组织表 (organizations)

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY | 组织唯一标识 |
| name | VARCHAR(255) | NOT NULL | 组织名称 |
| description | TEXT | | 组织描述 |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| created_by | UUID | NOT NULL REFERENCES users(id) | 创建人ID |

### 2.2 组织成员表 (organization_members)

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY | 成员关系唯一标识 |
| organization_id | UUID | NOT NULL REFERENCES organizations(id) ON DELETE CASCADE | 组织ID |
| user_id | UUID | NOT NULL REFERENCES users(id) | 用户ID |
| role | VARCHAR(20) | NOT NULL DEFAULT 'member' | 角色：owner、admin、member |
| joined_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 加入时间 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 2.3 组织消息表 (organization_messages)

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | UUID | PRIMARY KEY | 消息唯一标识 |
| organization_id | UUID | NOT NULL REFERENCES organizations(id) ON DELETE CASCADE | 组织ID |
| title | VARCHAR(255) | NOT NULL | 消息标题 |
| content | TEXT | NOT NULL | 消息内容 |
| author_id | UUID | NOT NULL REFERENCES users(id) | 作者ID |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |

## 3. API接口设计

### 3.1 组织管理接口

#### 3.1.1 创建组织

- **URL**: `POST /api/organizations`
- **权限**: 所有登录用户
- **请求体**:
  ```json
  {
    "name": "组织名称",
    "description": "组织描述"
  }
  ```
- **响应**:
  ```json
  {
    "id": "org-uuid",
    "name": "组织名称",
    "description": "组织描述",
    "created_at": "2026-01-08T12:00:00Z",
    "created_by": "user-uuid"
  }
  ```

#### 3.1.2 获取组织列表

- **URL**: `GET /api/organizations`
- **权限**: 所有登录用户
- **响应**:
  ```json
  [
    {
      "id": "org-uuid",
      "name": "组织名称",
      "description": "组织描述",
      "member_count": 10,
      "role": "owner",
      "created_at": "2026-01-08T12:00:00Z"
    }
  ]
  ```

#### 3.1.3 获取组织详情

- **URL**: `GET /api/organizations/:id`
- **权限**: 组织成员
- **响应**:
  ```json
  {
    "id": "org-uuid",
    "name": "组织名称",
    "description": "组织描述",
    "member_count": 10,
    "role": "owner",
    "created_at": "2026-01-08T12:00:00Z",
    "created_by": "user-uuid"
  }
  ```

#### 3.1.4 更新组织

- **URL**: `PUT /api/organizations/:id`
- **权限**: Owner
- **请求体**:
  ```json
  {
    "name": "新组织名称",
    "description": "新组织描述"
  }
  ```
- **响应**: 组织详情

#### 3.1.5 解散组织

- **URL**: `DELETE /api/organizations/:id`
- **权限**: Owner
- **响应**: `{ "success": true }`

### 3.2 成员管理接口

#### 3.2.1 获取成员列表

- **URL**: `GET /api/organizations/:id/members`
- **权限**: 组织成员
- **响应**:
  ```json
  [
    {
      "id": "user-uuid",
      "name": "用户名",
      "email": "user@example.com",
      "role": "owner",
      "joined_at": "2026-01-08T12:00:00Z"
    }
  ]
  ```

#### 3.2.2 添加成员

- **URL**: `POST /api/organizations/:id/members`
- **权限**: Owner/管理员
- **请求体**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **响应**: 成员详情

#### 3.2.3 移除成员

- **URL**: `DELETE /api/organizations/:id/members/:userId`
- **权限**: Owner/管理员 (不能移除管理员)
- **响应**: `{ "success": true }`

#### 3.2.4 更新成员角色

- **URL**: `PUT /api/organizations/:id/members/:userId`
- **权限**: Owner/管理员
- **请求体**:
  ```json
  {
    "role": "admin"
  }
  ```
- **响应**: 成员详情

#### 3.2.5 移交Owner权限

- **URL**: `POST /api/organizations/:id/transfer-owner`
- **权限**: Owner
- **请求体**:
  ```json
  {
    "userId": "user-uuid"
  }
  ```
- **响应**: 组织详情

#### 3.2.6 退出组织

- **URL**: `POST /api/organizations/:id/leave`
- **权限**: 管理员/成员 (Owner不能退出)
- **响应**: `{ "success": true }`

### 3.3 消息管理接口

#### 3.3.1 获取组织消息列表

- **URL**: `GET /api/organizations/:id/messages`
- **权限**: 组织成员
- **响应**:
  ```json
  [
    {
      "id": "msg-uuid",
      "title": "消息标题",
      "content": "消息内容",
      "author": {
        "id": "user-uuid",
        "name": "用户名"
      },
      "created_at": "2026-01-08T12:00:00Z"
    }
  ]
  ```

#### 3.3.2 发布组织消息

- **URL**: `POST /api/organizations/:id/messages`
- **权限**: Owner/管理员
- **请求体**:
  ```json
  {
    "title": "消息标题",
    "content": "消息内容"
  }
  ```
- **响应**: 消息详情

## 4. 业务逻辑设计

### 4.1 组织创建流程

1. 验证用户身份
2. 创建组织记录，设置创建人为Owner
3. 创建组织成员记录，设置Owner角色
4. 返回组织详情

### 4.2 成员添加流程

1. 验证请求者权限（Owner/管理员）
2. 验证被添加用户存在
3. 验证被添加用户未在组织中
4. 创建组织成员记录，默认角色为成员
5. 发送WebSocket消息通知组织成员
6. 返回成员详情

### 4.3 消息发布流程

1. 验证请求者权限（Owner/管理员）
2. 创建组织消息记录
3. 通过WebSocket向所有组织成员发送消息
4. 返回消息详情

### 4.4 权限验证逻辑

1. 每次API请求验证用户身份
2. 检查用户是否为组织成员
3. 根据请求的操作类型，验证用户角色权限
4. 对于敏感操作，添加二次确认机制

## 5. 安全性设计

### 5.1 认证与授权

- 使用JWT进行身份认证
- 基于角色的访问控制（RBAC）
- 接口级别的权限验证
- 敏感操作添加操作日志

### 5.2 数据安全

- 所有敏感操作需要二次确认
- 密码使用bcrypt加密存储
- 防止SQL注入攻击
- 防止XSS攻击
- 防止CSRF攻击

### 5.3 隐私保护

- 成员只能查看组织内其他成员的基本信息
- 消息内容加密存储
- 敏感操作记录审计日志

## 6. 性能考虑

### 6.1 数据库优化

- 为频繁查询的字段添加索引
- 合理设计表结构，避免冗余数据
- 使用事务确保数据一致性
- 定期清理过期数据

### 6.2 API性能

- 实现API缓存
- 合理使用分页
- 异步处理非关键操作
- 优化查询语句，避免N+1问题

### 6.3 WebSocket优化

- 实现消息分组，减少不必要的消息推送
- 使用Redis管理WebSocket连接
- 实现消息队列，确保消息可靠送达

## 7. 技术栈

- **后端框架**: NestJS
- **数据库**: PostgreSQL
- **ORM**: TypeORM
- **认证**: JWT
- **WebSocket**: Socket.IO
- **缓存**: Redis
- **日志**: Winston

## 8. 部署与监控

### 8.1 部署架构

- 容器化部署（Docker）
- 负载均衡
- 高可用设计
- 自动扩展

### 8.2 监控与告警

- API请求监控
- 数据库性能监控
- WebSocket连接监控
- 错误日志收集
- 实时告警

## 9. 测试策略

### 9.1 单元测试

- 测试核心业务逻辑
- 测试数据模型
- 测试权限验证

### 9.2 集成测试

- 测试API接口
- 测试数据库交互
- 测试WebSocket功能

### 9.3 端到端测试

- 测试完整业务流程
- 测试各种权限场景
- 测试异常情况处理

## 10. 开发计划

1. **数据模型开发**：创建组织、组织成员、组织消息表
2. **API接口开发**：实现组织管理、成员管理、消息管理接口
3. **业务逻辑开发**：实现权限验证、消息发布、成员管理逻辑
4. **WebSocket集成**：实现组织消息实时推送
5. **测试**：单元测试、集成测试、端到端测试
6. **部署**：容器化部署、监控配置
7. **文档**：API文档、技术文档、使用文档

## 11. 风险与应对

### 11.1 风险

- 权限管理复杂，容易出现权限漏洞
- WebSocket连接管理困难，可能导致性能问题
- 数据一致性问题，尤其是在分布式环境下

### 11.2 应对措施

- 严格的权限测试，覆盖所有权限场景
- 使用成熟的WebSocket框架，优化连接管理
- 合理使用事务，确保数据一致性
- 实现完善的监控和告警机制

## 12. 结论

本技术方案详细设计了组织功能的服务端实现，包括数据模型、API接口、业务逻辑、安全性设计、性能考虑等方面。通过本方案的实施，可以实现一个功能完整、安全可靠、性能优良的组织管理系统，满足用户的需求。