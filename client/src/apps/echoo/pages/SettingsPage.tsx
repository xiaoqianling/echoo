import { createSignal } from "solid-js";
import { authStore } from "../../../shared/stores/authStore";
import { toast } from "../../../shared/stores/toast";

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
      <h1 class="settings-page-title text-3xl font-bold text-gray-800 mb-6">
        Settings
      </h1>

      {/* 个人信息部分 */}
      <div class="settings-section bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="settings-section-header flex justify-between items-center mb-4">
          <h2 class="settings-section-title text-xl font-semibold text-gray-800">
            个人信息
          </h2>
          {!isEditing() && (
            <button
              class="settings-edit-btn px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              onClick={handleStartEdit}
            >
              编辑信息
            </button>
          )}
        </div>

        <div class="user-info-content">
          <div class="user-info-avatar mb-4 flex justify-center">
            <div class="user-info-avatar-placeholder w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
              {userInfo().name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div class="user-info-form space-y-4">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
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
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div class="user-info-value text-gray-800 font-medium">
                  {userInfo().name}
                </div>
              )}
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <div class="user-info-value text-gray-800 font-medium">
                {userInfo().email}
              </div>
            </div>

            {isEditing() && (
              <div class="form-actions flex justify-end gap-3 mt-6">
                <button
                  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={handleCancelEdit}
                >
                  取消
                </button>
                <button
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleSaveUserInfo}
                >
                  保存
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 通知设置部分 */}
      <div class="settings-section bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="settings-section-title text-xl font-semibold text-gray-800 mb-4">
          通知设置
        </h2>

        <div class="settings-options space-y-4">
          <div class="setting-item flex items-center justify-between">
            <div>
              <h3 class="setting-item-title font-medium text-gray-800">
                推送通知
              </h3>
              <p class="setting-item-description text-sm text-gray-600">
                接收新消息和更新的通知
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings().notifications}
                onChange={(e) =>
                  handleSettingChange("notifications", e.target.checked)
                }
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div class="setting-item flex items-center justify-between">
            <div>
              <h3 class="setting-item-title font-medium text-gray-800">
                邮件提醒
              </h3>
              <p class="setting-item-description text-sm text-gray-600">
                接收重要更新的邮件通知
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings().emailAlerts}
                onChange={(e) =>
                  handleSettingChange("emailAlerts", e.target.checked)
                }
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div class="setting-item flex items-center justify-between">
            <div>
              <h3 class="setting-item-title font-medium text-gray-800">
                深色模式
              </h3>
              <p class="setting-item-description text-sm text-gray-600">
                切换亮色和暗色主题
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings().darkMode}
                onChange={(e) =>
                  handleSettingChange("darkMode", e.target.checked)
                }
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 语言设置部分 */}
      <div class="settings-section bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="settings-section-title text-xl font-semibold text-gray-800 mb-4">
          语言设置
        </h2>

        <div class="language-settings">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            选择语言
          </label>
          <select
            value={settings().language}
            onChange={(e) => handleSettingChange("language", e.target.value)}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div class="settings-actions flex justify-between items-center mt-8">
        <button
          class="logout-btn px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          onClick={handleLogout}
        >
          退出登录
        </button>

        <button class="save-btn px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          保存设置
        </button>
      </div>
    </div>
  );
};
