"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import { Wallet, IndianRupee, TrendingUp, Clock, Loader2, PlusCircle, Send, FileText, Banknote, ArrowUpRight, ArrowDownRight, CreditCard, Calendar } from "lucide-react";

export default function FinanceDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    else if (user) fetchDashboard();
  }, [user, authLoading]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/finance/dashboard");
      setDashboard(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button onClick={fetchDashboard} className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard || { walletBalance: 0, totalEarnings: 0, totalLoanOutstanding: 0, activeLoansCount: 0 };
  const recent = dashboard?.recentTransactions || [];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tricolor header (government touch) */}
      <div className="flex">
        <div className="h-1 w-1/3 bg-[#FF9933]"></div>
        <div className="h-1 w-1/3 bg-white"></div>
        <div className="h-1 w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Finance Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your wallet, loans, and payments</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/finance/wallet?action=add')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition"
            >
              <PlusCircle size={16} /> Add Funds
            </button>
            <button
              onClick={() => router.push('/finance/wallet?action=transfer')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-sm font-medium shadow-sm transition"
            >
              <Send size={16} /> Transfer
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Wallet Balance - Gradient card */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-lg p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={18} className="text-indigo-200" />
                <span className="text-indigo-200 text-sm">Wallet Balance</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(stats.walletBalance)}</p>
              <p className="text-indigo-200 text-xs mt-2">Total Earnings: {formatCurrency(stats.totalEarnings)}</p>
            </div>
          </div>

          {/* Other stats cards - White with icons */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Loans</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeLoansCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText size={20} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Loan Outstanding</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(stats.totalLoanOutstanding)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <IndianRupee size={20} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Two column layout: Recent Transactions + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions - Full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Clock size={18} className="text-indigo-500" />
                Recent Transactions
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recent.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No transactions yet</div>
              ) : (
                recent.map((tx) => (
                  <div key={tx._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {tx.type === 'credit' ? (
                          <ArrowUpRight size={16} className="text-green-600" />
                        ) : (
                          <ArrowDownRight size={16} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                        <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-100 text-center">
              <button onClick={() => router.push('/finance/wallet')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all transactions →
              </button>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-500" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/finance/wallet?action=add')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
              >
                <span className="text-gray-700">Add Funds</span>
                <PlusCircle size={18} className="text-indigo-500 group-hover:scale-105 transition" />
              </button>
              <button
                onClick={() => router.push('/finance/wallet?action=transfer')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
              >
                <span className="text-gray-700">Transfer Money</span>
                <Send size={18} className="text-indigo-500 group-hover:scale-105 transition" />
              </button>
              <button
                onClick={() => router.push('/finance/loans')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
              >
                <span className="text-gray-700">Apply for Loan</span>
                <FileText size={18} className="text-green-500 group-hover:scale-105 transition" />
              </button>
              <button
                onClick={() => router.push('/finance/bills')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
              >
                <span className="text-gray-700">Pay Bill</span>
                <Banknote size={18} className="text-purple-500 group-hover:scale-105 transition" />
              </button>
              <button
                onClick={() => router.push('/finance/bank')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
              >
                <span className="text-gray-700">Bank Account</span>
                <CreditCard size={18} className="text-gray-500 group-hover:scale-105 transition" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          <p>Samraddh Bharat Foundation – Digital India Initiative | Secure & Encrypted</p>
        </div>
      </div>
    </div>
  );
}