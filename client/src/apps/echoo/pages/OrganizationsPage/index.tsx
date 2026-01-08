import { createSignal, For, Show, onMount } from "solid-js";
import { toast } from "@stores/toast";
import { ConfirmDialog } from "@components/ConfirmDialog";
import { apiService } from "@services/api";
import { MemberItem } from "./components/MemberItem";
import { MessageItem } from "./components/MessageItem";
import { OrganizationCard } from "./components/OrganizationCard";
import { CreateOrganizationModal } from "./components/CreateOrganizationModal";
import "./styles.scss";
import { useNavigate, useParams } from "@solidjs/router";

// 组织数据类型定义
interface Organization {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  role: "owner" | "admin" | "member";
  createdAt: string;
}

// 成员数据类型定义
interface Member {
  id: string;
  name: string;
  role: "owner" | "admin" | "member";
  email: string;
  joinedAt: string;
}

// 消息数据类型定义
interface Message {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  // 状态管理
  const [organizations, setOrganizations] = createSignal<Organization[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false);
  const [selectedOrganization, setSelectedOrganization] =
    createSignal<Organization | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = createSignal(false);
  const [confirmAction, setConfirmAction] = createSignal(() => {});
  const [confirmMessage, setConfirmMessage] = createSignal("");

  // 创建组织表单状态
  const [organizationName, setOrganizationName] = createSignal("");
  const [organizationDescription, setOrganizationDescription] =
    createSignal("");
  const [nameError, setNameError] = createSignal("");

  // 表单验证
  const validateForm = () => {
    let isValid = true;

    // 名称验证：必填，长度1-50
    if (!organizationName().trim()) {
      setNameError("组织名称不能为空");
      isValid = false;
    } else if (organizationName().trim().length < 1) {
      setNameError("组织名称长度不能少于1个字符");
      isValid = false;
    } else if (organizationName().trim().length > 50) {
      setNameError("组织名称长度不能超过50个字符");
      isValid = false;
    } else {
      setNameError("");
    }

    return isValid;
  };

  // 重置表单
  const resetForm = () => {
    setOrganizationName("");
    setOrganizationDescription("");
    setNameError("");
  };

  // 关闭创建模态框
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    resetForm();
  };

  // 处理创建组织
  const handleSubmitCreateOrganization = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await apiService.createOrganization(
          organizationName().trim(),
          organizationDescription().trim()
        );
        toast.success("组织创建成功");
        await fetchOrganizations();
        handleCloseCreateModal();
      } catch (error) {
        console.error("Failed to create organization:", error);
        toast.error("组织创建失败");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 组织详情状态
  const [members, setMembers] = createSignal<Member[]>([]);
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [activeTab, setActiveTab] = createSignal("members");

  // 发布消息表单状态
  const [messageTitle, setMessageTitle] = createSignal("");
  const [messageContent, setMessageContent] = createSignal("");

  // 组件挂载时获取组织列表
  onMount(async () => {
    setIsLoading(true);
    try {
      const orgs = await apiService.getOrganizations();
      // 转换API返回的组织数据结构以匹配前端需求
      const formattedOrgs: Organization[] = orgs.map((org: any) => ({
        id: org.id,
        name: org.name,
        description: org.description || "",
        memberCount: org.memberCount || 0,
        role: org.role || "member",
        createdAt: org.createdAt,
      }));
      setOrganizations(formattedOrgs);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      toast.error("获取组织列表失败");
    } finally {
      setIsLoading(false);
    }
  });

  // 获取组织列表
  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const orgs = await apiService.getOrganizations();
      // 转换API返回的组织数据结构以匹配前端需求
      const formattedOrgs: Organization[] = orgs.map((org: any) => ({
        id: org.id,
        name: org.name,
        description: org.description || "",
        memberCount: org.memberCount || 0,
        role: org.role || "member",
        createdAt: org.createdAt,
      }));
      setOrganizations(formattedOrgs);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      toast.error("获取组织列表失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 打开创建组织模态框
  const handleCreateOrganization = () => {
    setIsCreateModalOpen(true);
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 查看组织详情
  const handleViewOrganization = async (org: Organization) => {
    setSelectedOrganization(org);
    try {
      // 获取组织成员
      const orgMembers = await apiService.getOrganizationMembers(org.id);
      setMembers(orgMembers);

      // 获取组织消息
      const orgMessages = await apiService.getOrganizationMessages(org.id);
      setMessages(orgMessages);
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
      toast.error("获取组织详情失败");
    }
  };

  // 关闭组织详情
  const handleCloseOrganization = () => {
    setSelectedOrganization(null);
    setActiveTab("members");
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
    showConfirmDialog("确定要删除该组织吗？此操作不可恢复。", async () => {
      try {
        await apiService.deleteOrganization(orgId);
        toast.success("组织已成功删除");
        // 重新获取组织列表
        await fetchOrganizations();
        // 如果删除的是当前选中的组织，关闭详情
        if (selectedOrganization()?.id === orgId) {
          handleCloseOrganization();
        }
      } catch (error) {
        console.error("Failed to delete organization:", error);
        toast.error("删除组织失败");
      }
    });
  };

  // 处理发布消息
  const handlePublishMessage = async () => {
    if (!selectedOrganization()) return;

    try {
      if (!messageTitle().trim()) {
        toast.error("消息标题不能为空");
        return;
      }

      if (!messageContent().trim()) {
        toast.error("消息内容不能为空");
        return;
      }

      setIsLoading(true);
      await apiService.publishMessage(
        selectedOrganization()!.id,
        messageTitle().trim(),
        messageContent().trim()
      );
      toast.success("消息发布成功");

      // 重新获取消息列表
      const orgMessages = await apiService.getOrganizationMessages(
        selectedOrganization()!.id
      );
      setMessages(orgMessages);

      // 重置表单
      setMessageTitle("");
      setMessageContent("");
    } catch (error) {
      console.error("Failed to publish message:", error);
      toast.error("消息发布失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理移除成员
  const handleRemoveMember = async (memberId: string) => {
    if (!selectedOrganization()) return;

    try {
      await apiService.removeMember(selectedOrganization()!.id, memberId);
      toast.success("成员移除成功");

      // 重新获取成员列表
      const orgMembers = await apiService.getOrganizationMembers(
        selectedOrganization()!.id
      );
      setMembers(orgMembers);

      // 更新组织成员数
      const updatedOrgs = organizations().map((org) => {
        if (org.id === selectedOrganization()!.id) {
          return {
            ...org,
            memberCount: org.memberCount - 1,
          };
        }
        return org;
      });
      setOrganizations(updatedOrgs);
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("成员移除失败");
    }
  };

  // 处理提升成员
  const handlePromoteMember = async (memberId: string) => {
    if (!selectedOrganization()) return;

    try {
      await apiService.promoteMember(selectedOrganization()!.id, memberId);
      toast.success("成员提升成功");

      // 重新获取成员列表
      const orgMembers = await apiService.getOrganizationMembers(
        selectedOrganization()!.id
      );
      setMembers(orgMembers);
    } catch (error) {
      console.error("Failed to promote member:", error);
      toast.error("成员提升失败");
    }
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

      <div
        class={`organizations-content ${
          selectedOrganization() ? "detail-open" : ""
        }`}
      >
        {/* 组织详情内容 */}
        <Show when={selectedOrganization()}>
          <div class="organization-detail">
            <div class="organization-detail-header">
              <div class="organization-detail-info">
                <h2 class="organization-detail-name">
                  {selectedOrganization()?.name}
                </h2>
                <p class="organization-detail-description">
                  {selectedOrganization()?.description}
                </p>
                <div class="organization-detail-meta">
                  <span class="organization-detail-member-count">
                    {selectedOrganization()?.memberCount} 成员
                  </span>
                  <span class="organization-detail-role">
                    角色: {selectedOrganization()?.role}
                  </span>
                </div>
              </div>
              <div class="organization-detail-actions">
                <button
                  class="organization-detail-back-btn"
                  onClick={handleCloseOrganization}
                >
                  返回列表
                </button>
                {selectedOrganization()?.role === "owner" && (
                  <button
                    class="organization-detail-delete-btn"
                    onClick={() =>
                      selectedOrganization() &&
                      handleDeleteOrganization(selectedOrganization()?.id)
                    }
                  >
                    解散组织
                  </button>
                )}
              </div>
            </div>

            {/* 详情标签页 */}
            <div class="organization-tabs">
              <button
                class={`organization-tab ${
                  activeTab() === "members" ? "active" : ""
                }`}
                onClick={() => setActiveTab("members")}
              >
                成员管理
              </button>
              <button
                class={`organization-tab ${
                  activeTab() === "messages" ? "active" : ""
                }`}
                onClick={() => setActiveTab("messages")}
              >
                组织消息
              </button>
              {(selectedOrganization()?.role === "owner" ||
                selectedOrganization()?.role === "admin") && (
                <button
                  class={`organization-tab ${
                    activeTab() === "publish" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("publish")}
                >
                  发布消息
                </button>
              )}
            </div>

            {/* 标签页内容 */}
            <div class="organization-tab-content">
              <Show when={activeTab() === "members"}>
                <div class="members-section">
                  <h3>成员列表</h3>
                  <div class="members-list">
                    <For each={members()}>
                      {(member) => (
                        <MemberItem
                          member={member}
                          organizationRole={
                            selectedOrganization()?.role || "member"
                          }
                          onRemoveMember={handleRemoveMember}
                          onPromoteMember={handlePromoteMember}
                          formatDate={formatDate}
                        />
                      )}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={activeTab() === "messages"}>
                <div class="messages-section">
                  <h3>组织消息</h3>
                  <div class="messages-list">
                    <For each={messages()}>
                      {(message) => (
                        <MessageItem
                          message={message}
                          formatDate={formatDate}
                        />
                      )}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={activeTab() === "publish"}>
                <div class="publish-section">
                  <h3>发布消息</h3>
                  <div class="publish-form">
                    <div class="form-group">
                      <label class="form-label">消息标题</label>
                      <input
                        type="text"
                        class="form-input"
                        placeholder="请输入消息标题"
                        value={messageTitle()}
                        onInput={(e) => setMessageTitle(e.target.value)}
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">消息内容</label>
                      <textarea
                        class="form-textarea"
                        placeholder="请输入消息内容"
                        rows={4}
                        value={messageContent()}
                        onInput={(e) => setMessageContent(e.target.value)}
                      ></textarea>
                    </div>
                    <div class="form-actions">
                      <button
                        class="publish-btn"
                        onClick={handlePublishMessage}
                        disabled={isLoading()}
                      >
                        {isLoading() ? "发布中..." : "发布消息"}
                      </button>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </Show>

        {/* 组织列表 - 根据是否选择了组织显示不同的视图 */}
        <div
          class={`organizations-list ${
            selectedOrganization()
              ? "organizations-list--list"
              : "organizations-list--grid"
          }`}
        >
          <h2 class="organizations-subtitle">我的组织</h2>
          <div
            class={`organizations-${selectedOrganization() ? "list" : "grid"}`}
          >
            <For each={organizations()}>
              {(org) => (
                <OrganizationCard
                  organization={org}
                  isSelected={selectedOrganization()?.id === org.id}
                  isDetailOpen={!!selectedOrganization()}
                  formatDate={formatDate}
                  onSelect={handleViewOrganization}
                  onViewDetail={handleViewOrganization}
                  onDelete={handleDeleteOrganization}
                />
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

      {/* 创建组织模态框 */}
      <CreateOrganizationModal
        isOpen={isCreateModalOpen()}
        isLoading={isLoading()}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (name, description) => {
          try {
            await apiService.createOrganization(name, description);
            toast.success("组织创建成功");
            await fetchOrganizations();
          } catch (error) {
            console.error("Failed to create organization:", error);
            toast.error("组织创建失败");
          }
        }}
      />
    </div>
  );
};

export default OrganizationsPage;
