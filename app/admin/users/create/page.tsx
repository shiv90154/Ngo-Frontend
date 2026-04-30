"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

const ALL_ROLES = [
  "SUPER_ADMIN",
  "ADDITIONAL_DIRECTOR",
  "STATE_OFFICER",
  "DISTRICT_MANAGER",
  "DISTRICT_PRESIDENT",
  "FIELD_OFFICER",
  "BLOCK_OFFICER",
  "VILLAGE_OFFICER",
  "DOCTOR",
  "TEACHER",
  "AGENT",
  "USER",
];

const ALL_MODULES = [
  "EDUCATION",
  "HEALTHCARE",
  "AGRICULTURE",
  "FINANCE",
  "IT",
  "MEDIA",
  "CRM",
  "ECOMMERCE",
];

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
    modules: [] as string[],
    state: "",
    district: "",
    block: "",
    village: "",
    isActive: true,
  });

  const [autoPassword, setAutoPassword] = useState(true);

  // Auto‑generate a random password
  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, password: pass });
    setAutoPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      toast.error("Please fill all mandatory fields");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone must be 10 digits");
      return;
    }
    setLoading(true);
    try {
      // Use the bulk user creation logic (you may need a dedicated backend endpoint)
      // For now, we use the existing admin register endpoint or a new admin‑create endpoint
      const res = await adminAPI.createUser?.(form);
      if (res?.data?.success) {
        toast.success("User created successfully!");
        router.push("/admin/users");
      } else {
        // If no dedicated endpoint, you can call the public register endpoint
        // but that would send OTP – for admin creation we need a direct route.
        toast.error("User creation endpoint is not yet set up. Please check backend.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (mod: string) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.includes(mod)
        ? prev.modules.filter((m) => m !== mod)
        : [...prev.modules, mod],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="text-gray-600 hover:text-[#1a237e] flex items-center gap-1"
        >
          <ArrowLeft size={18} /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Create New User</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone (10 digits) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm"
                maxLength={10}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="flex-1 border rounded-lg p-2.5 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg text-sm font-medium"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#1a237e] rounded"
                />
                <span className="text-sm font-medium">Active Account</span>
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="border rounded-lg p-2.5 text-sm"
            />
            <input
              placeholder="District"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="border rounded-lg p-2.5 text-sm"
            />
            <input
              placeholder="Block"
              value={form.block}
              onChange={(e) => setForm({ ...form, block: e.target.value })}
              className="border rounded-lg p-2.5 text-sm"
            />
            <input
              placeholder="Village"
              value={form.village}
              onChange={(e) => setForm({ ...form, village: e.target.value })}
              className="border rounded-lg p-2.5 text-sm"
            />
          </div>

          {/* Modules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Modules</label>
            <div className="flex flex-wrap gap-2">
              {ALL_MODULES.map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => toggleModule(mod)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    form.modules.includes(mod)
                      ? "bg-[#1a237e] text-white border-[#1a237e]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link
              href="/admin/users"
              className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1757] text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}