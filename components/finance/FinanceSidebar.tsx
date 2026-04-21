// components/finance/FinanceSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wallet,
  CreditCard,
  FileText,
  Building2,
  Banknote,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { financeAPI } from "@/lib/api";

export default function FinanceSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;
    const fetchBalance = async () => {
      try {
        const res = await financeAPI.getWallet();
        setWalletBalance(res.data.data.balance);
      } catch (error) {
        console.error("Failed to fetch wallet balance", error);
      }
    };
    fetchBalance();
  }, [mounted, user]);

  const navLinks = [
    { name: "Dashboard", href: "/finance", icon: Home },
    { name: "Wallet", href: "/finance/wallet", icon: Wallet },
    { name: "Loans", href: "/finance/loans", icon: CreditCard },
    { name: "Bill Payments", href: "/finance/bills", icon: FileText },
    { name: "Bank Account", href: "/finance/bank", icon: Building2 },
    { name: "AEPS Withdraw", href: "/finance/aeps", icon: Banknote },
  ];

  const isActive = (href: string) => {
    if (href === "/finance" && pathname === "/finance") return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] sticky top-[65px] p-4 overflow-y-auto">
      {/* 用户卡片（带余额） */}
      {mounted && user ? (
        <div className="mb-6 p-4 bg-gradient-to-br from-[#1a237e]/5 to-transparent rounded-2xl border border-[#1a237e]/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1a237e] to-[#283593] rounded-full flex items-center justify-center text-white font-medium text-lg shadow-sm">
              {user.fullName?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          {walletBalance !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Wallet Balance</span>
              <span className="font-semibold text-[#1a237e]">₹{walletBalance.toLocaleString()}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-100 rounded-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        </div>
      )}

      {/* 主导航 */}
      <nav className="space-y-1 mb-6">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#1a237e]/10 text-[#1a237e] border-l-3 border-[#1a237e]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#1a237e]"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* 理财提示 */}
      <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[#1a237e]" />
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Financial Tip
          </h4>
        </div>
        <p className="text-sm text-gray-700">
          Save at least 20% of your income for a secure future.
        </p>
      </div>
    </aside>
  );
}