import { createSignal } from "solid-js";
import { authStore } from "../../../shared/stores/authStore";
import { toast } from "../../../shared/stores/toast";
import "./settings.scss";

export const SettingsPage = () => {
  // 个人信息状态
  const [userInfo, setUserInfo] = createSignal({
    name: authStore.user?.name || "未知用户",
    email: authStore.user?.email || "",
    avatar: "",
  });

  // 设置状态
  const [settings, setSettings] = createSignal({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: "English",
  });

  // 编辑状态
  const [isEditing, setIsEditing] = createSignal(false);
  const [tempUserInfo, setTempUserInfo] = createSignal(userInfo());

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 开始编辑个人信息
  const handleStartEdit = () => {
    setTempUserInfo(userInfo());
    setIsEditing(true);
  };

  // 保存个人信息
  const handleSaveUserInfo = () => {
    setUserInfo(tempUserInfo());
    setIsEditing(false);
    toast.success("个人信息已更新");
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 退出登录
  const handleLogout = () => {
    authStore.logout();
  };

  return (
    <div class="settings-page">
      <h1 class="settings-page-title">Settings</h1>

      {/* 个人信息部分 */}
      <div class="settings-section">
        <div class="settings-section-header">
          <h2 class="settings-section-title">个人信息</h2>
          {!isEditing() && (
            <button class="settings-edit-btn" onClick={handleStartEdit}>
              编辑信息
            </button>
          )}
        </div>

        <div class="user-info-content">
          <div class="user-info-avatar">
            <div class="user-info-avatar-placeholder">
              {userInfo().name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div class="user-info-form">
            <div class="form-group">
              <label>姓名</label>
              {isEditing() ? (
                <input
                  type="text"
                  value={tempUserInfo().name}
                  onChange={(e) =>
                    setTempUserInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              ) : (
                <div class="user-info-value">{userInfo().name}</div>
              )}
            </div>

            <div class="form-group">
              <label>邮箱</label>
              <div class="user-info-value">{userInfo().email}</div>
            </div>

            {isEditing() && (
              <div class="form-actions">
                <button onClick={handleCancelEdit}>取消</button>
                <button onClick={handleSaveUserInfo}>保存</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 通知设置部分 */}
      <div class="settings-section">
        <h2 class="settings-section-title">通知设置</h2>

        <div class="settings-options">
          <div class="setting-item">
            <div>
              <h3 class="setting-item-title">推送通知</h3>
              <p class="setting-item-description">接收新消息和更新的通知</p>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                checked={settings().notifications}
                onChange={(e) =>
                  handleSettingChange("notifications", e.target.checked)
                }
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div>
              <h3 class="setting-item-title">邮件提醒</h3>
              <p class="setting-item-description">接收重要更新的邮件通知</p>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                checked={settings().emailAlerts}
                onChange={(e) =>
                  handleSettingChange("emailAlerts", e.target.checked)
                }
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div>
              <h3 class="setting-item-title">深色模式</h3>
              <p class="setting-item-description">切换亮色和暗色主题</p>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                checked={settings().darkMode}
                onChange={(e) =>
                  handleSettingChange("darkMode", e.target.checked)
                }
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* 语言设置部分 */}
      <div class="settings-section">
        <h2 class="settings-section-title">语言设置</h2>

        <div class="language-settings">
          <label>选择语言</label>
          <select
            value={settings().language}
            onChange={(e) => handleSettingChange("language", e.target.value)}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">中文</option>
          </select>
        </div>
      </div>

      {/* 操作按钮部分 */}
      <div class="settings-actions">
        <button class="logout-btn" onClick={handleLogout}>
          退出登录
        </button>

        <button class="save-btn">保存设置</button>
      </div>
    </div>
  );
};
