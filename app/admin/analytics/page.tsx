"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

  const chartData = [
    { name: "Total Users", value: stats?.totalUsers || 0 },
    { name: "Active", value: stats?.activeUsers || 0 },
    { name: "Doctors", value: stats?.doctors || 0 },
    { name: "Teachers", value: stats?.teachers || 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1a237e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500">Total Posts</p>
          <p className="text-3xl font-bold">{stats?.totalPosts || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500">Total Appointments</p>
          <p className="text-3xl font-bold">{stats?.totalAppointments || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500">Active Loans</p>
          <p className="text-3xl font-bold">{stats?.activeLoans || 0}</p>
        </div>
      </div>
    </div>
  );
}