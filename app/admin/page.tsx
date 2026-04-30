"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import {
  Users, UserCheck, BookOpen, Stethoscope, GraduationCap,
  TrendingUp, Wallet, Newspaper, Loader2, Shield
} from "lucide-react";
import Link from "next/link";

// Define what each role can see/do
const ROLE_CONFIG: Record<string, { title: string; managementLinks: { label: string; href: string }[] }> = {
  SUPER_ADMIN: {
    title: "Super Admin Dashboard",
    managementLinks: [
      { label: "User Management", href: "/admin/users" },
      { label: "Hierarchy", href: "/admin/hierarchy" },
      { label: "MLM Commissions", href: "/admin/mlm" },
      { label: "Subscription Plans", href: "/admin/subscription/plans" },
      { label: "Settings", href: "/admin/settings" },
    ],
  },
  ADDITIONAL_DIRECTOR: {
    title: "Director Dashboard",
    managementLinks: [
      { label: "User Management", href: "/admin/users" },
      { label: "Hierarchy", href: "/admin/hierarchy" },
      { label: "MLM Commissions", href: "/admin/mlm" },
    ],
  },
  STATE_OFFICER: {
    title: "State Officer Dashboard",
    managementLinks: [
      { label: "User Management", href: "/admin/users" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  DISTRICT_MANAGER: {
    title: "District Manager Dashboard",
    managementLinks: [
      { label: "User Management", href: "/admin/users" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  DISTRICT_PRESIDENT: {
    title: "District President Dashboard",
    managementLinks: [
      { label: "User Management", href: "/admin/users" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  FIELD_OFFICER: {
    title: "Field Officer Dashboard",
    managementLinks: [
      { label: "My Assignments", href: "/admin/users" },
    ],
  },
  BLOCK_OFFICER: {
    title: "Block Officer Dashboard",
    managementLinks: [
      { label: "Block Users", href: "/admin/users" },
    ],
  },
  VILLAGE_OFFICER: {
    title: "Village Officer Dashboard",
    managementLinks: [
      { label: "Village Users", href: "/admin/users" },
    ],
  },
  DEFAULT: {
    title: "Admin Dashboard",
    managementLinks: [
      { label: "User Management", href: "/admin/users" },
    ],
  },
};

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { router.replace("/services"); return; }
    fetchDashboard();
  }, [isAdmin]);

  const fetchDashboard = async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.stats);
      setRecentUsers(res.data.recentUsers || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#1a237e]" size={32} />
      </div>
    );
  }

  const roleConfig = ROLE_CONFIG[user?.role || ""] || ROLE_CONFIG.DEFAULT;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Shield className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">{roleConfig.title}</h1>
            <p className="text-blue-100 text-sm mt-1">
              Welcome, {user?.fullName} · Role: {user?.role?.replace(/_/g, " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-100 text-blue-700" />
        <StatCard icon={UserCheck} label="Active Users" value={stats?.activeUsers || 0} color="bg-green-100 text-green-700" />
        <StatCard icon={Stethoscope} label="Doctors" value={stats?.doctors || 0} color="bg-purple-100 text-purple-700" />
        <StatCard icon={GraduationCap} label="Teachers" value={stats?.teachers || 0} color="bg-orange-100 text-orange-700" />
        <StatCard icon={BookOpen} label="Courses" value={stats?.totalCourses || 0} color="bg-indigo-100 text-indigo-700" />
        <StatCard icon={TrendingUp} label="Active Loans" value={stats?.activeLoans || 0} color="bg-red-100 text-red-700" />
        <StatCard icon={Wallet} label="Transactions" value={stats?.totalTransactions || 0} color="bg-yellow-100 text-yellow-700" />
        <StatCard icon={Newspaper} label="Posts" value={stats?.totalPosts || 0} color="bg-pink-100 text-pink-700" />
      </div>

      {/* Quick Actions (role‑based) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {roleConfig.managementLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center gap-2"
          >
            <Shield size={22} className="text-[#1a237e]" />
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Users (only for higher admins) */}
      {(user?.role === "SUPER_ADMIN" || user?.role === "ADDITIONAL_DIRECTOR" || user?.role === "STATE_OFFICER") && (
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          {recentUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent users.</p>
          ) : (
            <div className="divide-y">
              {recentUsers.map((u: any) => (
                <div key={u._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{u.fullName}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}