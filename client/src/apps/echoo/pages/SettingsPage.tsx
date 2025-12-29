import { createSignal } from 'solid-js';

export const SettingsPage = () => {
  const [settings, setSettings] = createSignal({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'English',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div class="w-full">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-800">Push Notifications</h3>
              <p class="text-sm text-gray-600">Receive notifications for new messages and updates</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings().notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-800">Email Alerts</h3>
              <p class="text-sm text-gray-600">Receive email notifications for important updates</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings().emailAlerts}
                onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-800">Dark Mode</h3>
              <p class="text-sm text-gray-600">Switch between light and dark theme</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings().darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Language Settings</h2>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Language</label>
          <select
            value={settings().language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      </div>
      
      <div class="mt-8">
        <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
};
