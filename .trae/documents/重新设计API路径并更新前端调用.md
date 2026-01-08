# 重新设计API路径并更新前端调用

## 1. 后端API路径重新设计

### 1.1 设计原则
- 按功能分类（member、message、owner等）
- 按操作分类（add、remove、publish、list等）
- 路径包含明确的操作语义
- HTTP方法与操作语义结合

### 1.2 重新设计的API路径

#### 组织相关API
| 功能 | 旧路径 | 新路径 | 方法 |
|------|--------|--------|------|
| 创建组织 | POST /organizations | POST /organizations/create | POST |
| 获取组织列表 | GET /organizations | GET /organizations/list | GET |
| 获取组织详情 | GET /organizations/:id | GET /organizations/:id/detail | GET |
| 添加成员 | POST /organizations/:id/members | POST /organizations/:id/member/add | POST |
| 移除成员 | DELETE /organizations/:id/members/:userId | DELETE /organizations/:id/member/remove | DELETE |
| 发布消息 | POST /organizations/:id/messages | POST /organizations/:id/message/publish | POST |
| 获取组织消息 | GET /organizations/:id/messages | GET /organizations/:id/message/list | GET |
| 任命管理员 | POST /organizations/:id/members/:userId/promote | POST /organizations/:id/member/promote | POST |
| 移除管理员 | POST /organizations/:id/members/:userId/demote | POST /organizations/:id/member/demote | POST |
| 转移所有权 | POST /organizations/:id/transfer-ownership | POST /organizations/:id/owner/transfer | POST |
| 解散组织 | DELETE /organizations/:id | DELETE /organizations/:id/delete | DELETE |
| 退出组织 | POST /organizations/:id/leave | POST /organizations/:id/member/leave | POST |

#### 消息相关API
| 功能 | 旧路径 | 新路径 | 方法 |
|------|--------|--------|------|
| 发送消息 | POST /messages | POST /messages/send | POST |
| 获取消息列表 | GET /messages | GET /messages/list | GET |
| 获取消息详情 | GET /messages/:id | GET /messages/:id/detail | GET |

## 2. 后端代码修改

### 2.1 更新OrganizationsController
- 修改每个路由的@Post/@Get/@Delete装饰器路径
- 调整参数获取方式，如从路径参数改为请求体参数

### 2.2 更新MessagesController
- 修改每个路由的@Post/@Get装饰器路径

## 3. 前端代码修改

### 3.1 更新ApiService
- 修改apiService中所有组织相关方法的endpoint
- 修改apiService中所有消息相关方法的endpoint
- 确保参数传递方式与后端新API一致

### 3.2 更新OrganizationsPage
- 替换mock数据为真实API调用
- 修改createOrganization、handleDeleteOrganization等方法使用真实API
- 更新成员管理和消息发布功能使用真实API

### 3.3 更新DashboardPage
- 确保消息获取使用真实API
- 图表数据基于真实消息数据生成

## 4. 测试验证
- 构建前后端确保无编译错误
- 测试组织创建、删除、成员管理等功能
- 测试消息发送、获取等功能
- 确保图表数据正确显示

## 5. 注意事项
- 后端API路径修改后需重启服务器
- 前端需确保API调用与后端新路径匹配
- 需考虑向后兼容性（如果有现有客户端）
- 确保所有操作都有适当的错误处理