// app/(admin)/settings/page.tsx
"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Samraddh Bharat",
    maintenanceMode: false,
    allowRegistration: true,
    defaultRole: "USER",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call – replace with actual backend request later
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success("Settings saved successfully!");
    // Optional: store in localStorage for demo
    localStorage.setItem("adminSettings", JSON.stringify(settings));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h1>

        <div className="space-y-6 max-w-xl">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent"
            />
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Maintenance Mode</p>
              <p className="text-sm text-gray-500">
                When enabled, only admins can access the platform.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                settings.maintenanceMode ? "bg-[#1a237e]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Allow Registration */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Allow New Registrations</p>
              <p className="text-sm text-gray-500">
                Turn off to prevent new users from signing up.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, allowRegistration: !settings.allowRegistration })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                settings.allowRegistration ? "bg-[#1a237e]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowRegistration ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Default User Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Role for New Users
            </label>
            <select
              value={settings.defaultRole}
              onChange={(e) => setSettings({ ...settings, defaultRole: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1a237e] focus:border-transparent"
            >
              <option value="USER">User</option>
              <option value="TEACHER">Teacher</option>
              <option value="DOCTOR">Doctor</option>
              <option value="AGENT">Agent</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium py-2.5 px-6 rounded-lg transition disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}