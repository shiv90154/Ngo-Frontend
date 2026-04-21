"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Shield,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      appointments: true,
      promotions: false,
    },
    privacy: {
      shareRecords: false,
      showProfile: true,
    },
    appearance: {
      theme: "light",
      language: "en",
    },
  });

  const handleToggle = (category: string, key: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaveMessage("Settings saved successfully!");
    setLoading(false);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-[#1a237e]" />
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <button
              onClick={() => handleToggle("notifications", "email")}
              className={`relative w-11 h-6 rounded-full transition ${
                settings.notifications.email ? "bg-[#1a237e]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                  settings.notifications.email ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">SMS Notifications</p>
              <p className="text-sm text-gray-500">Get appointment reminders via SMS</p>
            </div>
            <button
              onClick={() => handleToggle("notifications", "sms")}
              className={`relative w-11 h-6 rounded-full transition ${
                settings.notifications.sms ? "bg-[#1a237e]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                  settings.notifications.sms ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-[#1a237e]" />
          <h2 className="text-lg font-semibold text-gray-800">Privacy</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Share Health Records</p>
              <p className="text-sm text-gray-500">Allow doctors to view your history</p>
            </div>
            <button
              onClick={() => handleToggle("privacy", "shareRecords")}
              className={`relative w-11 h-6 rounded-full transition ${
                settings.privacy.shareRecords ? "bg-[#1a237e]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
                  settings.privacy.shareRecords ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-[#1a237e]" />
          <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setSettings({ ...settings, appearance: { ...settings.appearance, theme: "light" } })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  settings.appearance.theme === "light"
                    ? "border-[#1a237e] bg-[#1a237e]/5"
                    : "border-gray-200"
                }`}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
              <button
                onClick={() =>
                  setSettings({ ...settings, appearance: { ...settings.appearance, theme: "dark" } })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  settings.appearance.theme === "dark"
                    ? "border-[#1a237e] bg-[#1a237e]/5"
                    : "border-gray-200"
                }`}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.appearance.language}
              onChange={(e) =>
                setSettings({ ...settings, appearance: { ...settings.appearance, language: e.target.value } })
              }
              className="w-full md:w-64 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        {saveMessage && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> {saveMessage}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-[#1a237e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0d1757] transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}   