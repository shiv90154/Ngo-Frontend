"use client";

import { useEffect, useState } from "react";
import { itAPI } from "@/lib/api";
import { Users, FolderKanban, FileText, CheckSquare, Loader2 } from "lucide-react";
import StatCard from "@/components/it/StatCard";

export default function ITDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await itAPI.getDashboard();
        setStats(res.data.stats);
        setRecentTasks(res.data.recentTasks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Clients" value={stats?.clientCount || 0} icon={Users} color="bg-blue-100 text-blue-700" />
        <StatCard title="Projects" value={stats?.projectCount || 0} icon={FolderKanban} color="bg-green-100 text-green-700" />
        <StatCard title="Active Projects" value={stats?.activeProjects || 0} icon={CheckSquare} color="bg-purple-100 text-purple-700" />
        <StatCard title="Unpaid Invoices" value={stats?.unpaidInvoices || 0} icon={FileText} color="bg-orange-100 text-orange-700" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No pending tasks</p>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((task: any) => (
              <div key={task._id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.project?.name}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'todo' ? 'bg-gray-200' : task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{task.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}