// app/admin/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import { Users, UserCheck, Stethoscope, GraduationCap, FileText, Calendar, Wallet } from "lucide-react";

export default function AnalyticsPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/services");
      return;
    }
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isAdmin, router]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const statItems = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Active Users", value: stats?.activeUsers || 0, icon: UserCheck, color: "bg-green-100 text-green-700" },
    { label: "Doctors", value: stats?.doctors || 0, icon: Stethoscope, color: "bg-purple-100 text-purple-700" },
    { label: "Teachers", value: stats?.teachers || 0, icon: GraduationCap, color: "bg-orange-100 text-orange-700" },
    { label: "Total Posts", value: stats?.totalPosts || 0, icon: FileText, color: "bg-pink-100 text-pink-700" },
    { label: "Appointments", value: stats?.totalAppointments || 0, icon: Calendar, color: "bg-indigo-100 text-indigo-700" },
    { label: "Transactions", value: stats?.totalTransactions || 0, icon: Wallet, color: "bg-yellow-100 text-yellow-700" },
    { label: "Active Loans", value: stats?.activeLoans || 0, icon: Wallet, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{item.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <p className="text-gray-500 text-center">Detailed charts will be available in the next update.</p>
      </div>
    </div>
  );
}