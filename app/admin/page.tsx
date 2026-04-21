"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import { Users, UserCheck, Stethoscope, GraduationCap } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import RecentUsersTable from "@/components/admin/RecentUsersTable";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/services");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats);
        setRecentUsers(res.data.recentUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, router]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-100 text-blue-700" />
        <StatCard title="Active Users" value={stats.activeUsers} icon={UserCheck} color="bg-green-100 text-green-700" />
        <StatCard title="Doctors" value={stats.doctors} icon={Stethoscope} color="bg-purple-100 text-purple-700" />
        <StatCard title="Teachers" value={stats.teachers} icon={GraduationCap} color="bg-orange-100 text-orange-700" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
        <RecentUsersTable users={recentUsers} />
      </div>
    </div>
  );
}