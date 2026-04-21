"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Samraddh Bharat",
    maintenanceMode: false,
    allowRegistration: true,
  });

  const handleSave = () => {
    // 实际项目中可调用 API 保存设置
    toast.success("Settings saved (demo)");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            />
            <label className="text-sm font-medium">Maintenance Mode</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
            />
            <label className="text-sm font-medium">Allow New Registrations</label>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg"
          >
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}