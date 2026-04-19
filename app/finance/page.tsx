"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { financeAPI } from "@/lib/api";
import { Wallet, CreditCard, FileText, TrendingUp, Loader2, IndianRupee } from "lucide-react";
import Link from "next/link";

export default function FinanceDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await financeAPI.getDashboard();
      setDashboardData(res.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  const stats = [
    { label: "Wallet Balance", value: `₹${dashboardData?.walletBalance || 0}`, icon: Wallet, color: "bg-blue-100 text-blue-700" },
    { label: "Active Loans", value: dashboardData?.activeLoansCount || 0, icon: CreditCard, color: "bg-purple-100 text-purple-700" },
    { label: "Outstanding", value: `₹${dashboardData?.totalLoanOutstanding || 0}`, icon: TrendingUp, color: "bg-orange-100 text-orange-700" },
  ];

  const quickActions = [
    { label: "Add Money", href: "/finance/wallet", color: "from-green-600 to-green-700", icon: Wallet },
    { label: "Pay Bill", href: "/finance/bills/pay", color: "from-blue-600 to-blue-700", icon: FileText },
    { label: "Apply Loan", href: "/finance/loans/apply", color: "from-purple-600 to-purple-700", icon: CreditCard },
    { label: "AEPS Withdraw", href: "/finance/aeps", color: "from-orange-600 to-orange-700", icon: IndianRupee },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
            <IndianRupee size={28} className="text-[#FF9933]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Finance Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">
              Welcome back, {user?.fullName?.split(" ")[0] || "User"}!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`bg-gradient-to-r ${action.color} text-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col items-center text-center gap-2`}
          >
            <action.icon size={24} />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        {dashboardData?.recentTransactions?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent transactions</p>
        ) : (
          <div className="space-y-3">
            {dashboardData?.recentTransactions?.map((txn: any) => (
              <div key={txn._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{txn.description}</p>
                  <p className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
                <p className={`font-semibold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}