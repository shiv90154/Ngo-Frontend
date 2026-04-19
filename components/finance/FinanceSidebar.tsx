"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, CreditCard, FileText, Building2, Banknote, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function FinanceSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

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
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-97px)] sticky top-[97px] p-4">
      <nav className="space-y-0.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#1a237e]/10 text-[#1a237e] border-l-3 border-[#1a237e]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#1a237e]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
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