"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/config/api';
import { Users, Briefcase, FileText, DollarSign, Clock, CheckCircle, Loader2, Plus } from 'lucide-react';

export default function ITDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchStats();
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/it/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-[#FF9933]" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Clients', value: stats?.totalClients || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: Briefcase, color: 'bg-purple-500' },
    { label: 'Active Projects', value: stats?.activeProjects || 0, icon: Clock, color: 'bg-green-500' },
    { label: 'Invoices', value: stats?.totalInvoices || 0, icon: FileText, color: 'bg-orange-500' },
    { label: 'Paid Invoices', value: stats?.paidInvoices || 0, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Revenue (₹)', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'bg-amber-500' },
    { label: 'Pending Requests', value: stats?.pendingRequests || 0, icon: Clock, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex"><div className="h-1 w-1/3 bg-[#FF9933]"></div><div className="h-1 w-1/3 bg-white"></div><div className="h-1 w-1/3 bg-[#138808]"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center"><Briefcase className="text-[#FF9933]" size={20} /></div>
          <div><h1 className="text-2xl font-bold text-gray-800">IT Services Dashboard</h1><p className="text-sm text-gray-500">Manage clients, projects, invoices & service requests</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-start">
                <div><p className="text-gray-500 text-sm">{card.label}</p><p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p></div>
                <div className={`${card.color} p-2 rounded-lg text-white`}><card.icon size={20} /></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => router.push('/it/clients')} className="flex items-center gap-2 px-4 py-2 bg-[#FF9933] text-white rounded-lg hover:bg-[#ff8800]"><Plus size={16} /> Add Client</button>
            <button onClick={() => router.push('/it/projects')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={16} /> Create Project</button>
            <button onClick={() => router.push('/it/invoices')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Plus size={16} /> Generate Invoice</button>
            <button onClick={() => router.push('/it/service-requests')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><Plus size={16} /> New Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}