import { createSignal, For, Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { toast } from '@stores/toast';
import { ConfirmDialog } from '@components/ConfirmDialog';
import './styles.scss';

// 模拟组织数据
const mockOrganizations = [
  {
    id: 'org1',
    name: '研发团队',
    description: '公司研发部门组织',
    memberCount: 25,
    role: 'owner',
    createdAt: '2026-01-01'
  },
  {
    id: 'org2',
    name: '产品团队',
    description: '产品管理组织',
    memberCount: 15,
    role: 'admin',
    createdAt: '2026-01-05'
  },
  {
    id: 'org3',
    name: '设计团队',
    description: 'UI/UX设计团队',
    memberCount: 10,
    role: 'member',
    createdAt: '2026-01-03'
  }
];

// 模拟组织成员数据
const mockMembers = [
  {
    id: 'user1',
    name: '张三',
    role: 'owner',
    email: 'zhangsan@example.com',
    joinedAt: '2026-01-01'
  },
  {
    id: 'user2',
    name: '李四',
    role: 'admin',
    email: 'lisi@example.com',
    joinedAt: '2026-01-02'
  },
  {
    id: 'user3',
    name: '王五',
    role: 'member',
    email: 'wangwu@example.com',
    joinedAt: '2026-01-03'
  }
];

// 模拟组织消息数据
const mockMessages = [
  {
    id: 'msg1',
    title: '项目进度会议',
    content: '本周项目进度报告，请各位准时参加。',
    author: '张三',
    createdAt: '2026-01-07'
  },
  {
    id: 'msg2',
    title: '需求变更通知',
    content: '关于产品需求的最新变更，请各位查看并反馈。',
    author: '李四',
    createdAt: '2026-01-06'
  }
];

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  
  // 状态管理
  const [organizations] = createSignal(mockOrganizations);
  const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false);
  const [selectedOrganization, setSelectedOrganization] = createSignal<typeof mockOrganizations[0] | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = createSignal(false);
  const [confirmAction, setConfirmAction] = createSignal(() => {});
  const [confirmMessage, setConfirmMessage] = createSignal('');
  
  // 组织详情状态
  const [members] = createSignal(mockMembers);
  const [messages] = createSignal(mockMessages);
  const [activeTab, setActiveTab] = createSignal('members');
  
  // 打开创建组织模态框
  const handleCreateOrganization = () => {
    setIsCreateModalOpen(true);
  };
  
  // 查看组织详情
  const handleViewOrganization = (org: typeof mockOrganizations[0]) => {
    setSelectedOrganization(org);
  };
  
  // 关闭组织详情
  const handleCloseOrganization = () => {
    setSelectedOrganization(null);
    setActiveTab('members');
  };
  
  // 显示确认对话框
  const showConfirmDialog = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setIsConfirmDialogOpen(true);
  };
  
  // 确认操作
  const handleConfirm = () => {
    confirmAction()();
    setIsConfirmDialogOpen(false);
  };
  
  // 取消操作
  const handleCancel = () => {
    setIsConfirmDialogOpen(false);
  };
  
  // 处理删除组织
  const handleDeleteOrganization = (orgId: string) => {
    showConfirmDialog('确定要删除该组织吗？此操作不可恢复。', () => {
      // 这里将实现实际的删除逻辑
      toast.success('组织已成功删除');
    });
  };
  
  return (
    <div class="organizations-page">
      <div class="organizations-header">
        <h1 class="organizations-title">组织管理</h1>
        <button 
          class="organizations-create-btn"
          onClick={handleCreateOrganization}
        >
          创建组织
        </button>
      </div>
      
      <div class={`organizations-content ${selectedOrganization() ? 'detail-open' : ''}`}>
        {/* 组织详情内容 */}
        <Show when={selectedOrganization()}>
          <div class="organization-detail">
            <div class="organization-detail-header">
              <div class="organization-detail-info">
                <h2 class="organization-detail-name">{selectedOrganization()?.name}</h2>
                <p class="organization-detail-description">{selectedOrganization()?.description}</p>
                <div class="organization-detail-meta">
                  <span class="organization-detail-member-count">{selectedOrganization()?.memberCount} 成员</span>
                  <span class="organization-detail-role">角色: {selectedOrganization()?.role}</span>
                </div>
              </div>
              <div class="organization-detail-actions">
                <button class="organization-detail-back-btn" onClick={handleCloseOrganization}>
                  返回列表
                </button>
                {selectedOrganization()?.role === 'owner' && (
                  <button 
                    class="organization-detail-delete-btn"
                    onClick={() => selectedOrganization() && handleDeleteOrganization(selectedOrganization()?.id)}
                  >
                    解散组织
                  </button>
                )}
              </div>
            </div>
            
            {/* 详情标签页 */}
            <div class="organization-tabs">
              <button 
                class={`organization-tab ${activeTab() === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                成员管理
              </button>
              <button 
                class={`organization-tab ${activeTab() === 'messages' ? 'active' : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                组织消息
              </button>
              {(selectedOrganization()?.role === 'owner' || selectedOrganization()?.role === 'admin') && (
                <button 
                  class={`organization-tab ${activeTab() === 'publish' ? 'active' : ''}`}
                  onClick={() => setActiveTab('publish')}
                >
                  发布消息
                </button>
              )}
            </div>
            
            {/* 标签页内容 */}
            <div class="organization-tab-content">
              <Show when={activeTab() === 'members'}>
                <div class="members-section">
                  <h3>成员列表</h3>
                  <div class="members-list">
                    <For each={members()}>
                      {(member) => (
                        <div class="member-item">
                          <div class="member-info">
                            <div class="member-name">{member.name}</div>
                            <div class="member-email">{member.email}</div>
                          </div>
                          <div class="member-role">{member.role}</div>
                          <div class="member-actions">
                            {(selectedOrganization()?.role === 'owner' || selectedOrganization()?.role === 'admin') && member.role === 'member' && (
                              <button class="member-action-btn">移除</button>
                            )}
                            {selectedOrganization()?.role === 'owner' && member.role === 'member' && (
                              <button class="member-action-btn">设为管理员</button>
                            )}
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
              
              <Show when={activeTab() === 'messages'}>
                <div class="messages-section">
                  <h3>组织消息</h3>
                  <div class="messages-list">
                    <For each={messages()}>
                      {(message) => (
                        <div class="message-item">
                          <div class="message-header">
                            <div class="message-title">{message.title}</div>
                            <div class="message-meta">
                              <span class="message-author">{message.author}</span>
                              <span class="message-date">{message.createdAt}</span>
                            </div>
                          </div>
                          <div class="message-content">{message.content}</div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
              
              <Show when={activeTab() === 'publish'}>
                <div class="publish-section">
                  <h3>发布消息</h3>
                  <div class="publish-form">
                    <div class="form-group">
                      <label class="form-label">消息标题</label>
                      <input 
                        type="text" 
                        class="form-input"
                        placeholder="请输入消息标题"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">消息内容</label>
                      <textarea 
                        class="form-textarea"
                        placeholder="请输入消息内容"
                        rows={4}
                      ></textarea>
                    </div>
                    <div class="form-actions">
                      <button class="publish-btn">发布消息</button>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </Show>
        
        {/* 组织列表 - 根据是否选择了组织显示不同的视图 */}
        <div class={`organizations-list ${selectedOrganization() ? 'organizations-list--list' : 'organizations-list--grid'}`}>
          <h2 class="organizations-subtitle">我的组织</h2>
          <div class={`organizations-${selectedOrganization() ? 'list' : 'grid'}`}>
            <For each={organizations()}>
              {(org) => (
                <div 
                  class={`organization-card ${selectedOrganization()?.id === org.id ? 'active' : ''}`}
                  onClick={() => handleViewOrganization(org)}
                >
                  <div class="organization-card-header">
                    <h3 class="organization-card-name">{org.name}</h3>
                    <div class="organization-card-role">{org.role}</div>
                  </div>
                  <p class="organization-card-description">{org.description}</p>
                  <div class="organization-card-footer">
                    <div class="organization-card-meta">
                      <span>{org.memberCount} 成员</span>
                      <span>{org.createdAt}</span>
                    </div>
                    <Show when={!selectedOrganization()}>
                      <div class="organization-card-actions">
                        <button 
                          class="organization-card-view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrganization(org);
                          }}
                        >
                          查看详情
                        </button>
                        {org.role === 'owner' && (
                          <button 
                            class="organization-card-delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrganization(org.id);
                            }}
                          >
                            解散
                          </button>
                        )}
                      </div>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      
      {/* 二次确认对话框 */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen()}
        title="确认操作"
        message={confirmMessage()}
        confirmText="确认"
        cancelText="取消"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmVariant="danger"
      />
    </div>
  );
};

export default OrganizationsPage;