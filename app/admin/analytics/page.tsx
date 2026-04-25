"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Loader2, Users, FileText, Calendar, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!isAdmin) router.replace("/services"); }, [isAdmin]);

  useEffect(() => {
    adminAPI.getStats().then(res => setStats(res.data.stats)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  const items = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Active Users", value: stats?.activeUsers, icon: Users, color: "bg-green-100 text-green-700" },
    { label: "Doctors", value: stats?.doctors, icon: Users, color: "bg-purple-100 text-purple-700" },
    { label: "Teachers", value: stats?.teachers, icon: Users, color: "bg-orange-100 text-orange-700" },
    { label: "Total Posts", value: stats?.totalPosts, icon: FileText, color: "bg-pink-100 text-pink-700" },
    { label: "Appointments", value: stats?.totalAppointments, icon: Calendar, color: "bg-indigo-100 text-indigo-700" },
    { label: "Transactions", value: stats?.totalTransactions, icon: Wallet, color: "bg-yellow-100 text-yellow-700" },
    { label: "Active Loans", value: stats?.activeLoans, icon: Wallet, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{item.value ?? 0}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}