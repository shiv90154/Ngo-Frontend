// components/finance/FinanceNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  Home,
  CreditCard,
  FileText,
  Banknote,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function FinanceNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 移动端底部导航项（与侧边栏一致）
  const mobileNavItems = [
    { name: "Dashboard", href: "/finance", icon: Home },
    { name: "Wallet", href: "/finance/wallet", icon: Wallet },
    { name: "Loans", href: "/finance/loans", icon: CreditCard },
    { name: "Bills", href: "/finance/bills", icon: FileText },
    { name: "Bank", href: "/finance/bank", icon: Building2 },
    { name: "AEPS", href: "/finance/aeps", icon: Banknote },
  ];

  const isActive = (href: string) => {
    if (href === "/finance" && pathname === "/finance") return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const userInitial = mounted && user?.fullName ? user.fullName.charAt(0) : "";
  const userFullName = mounted && user?.fullName ? user.fullName : "";
  const userEmail = mounted && user?.email ? user.email : "";

  return (
    <>
      {/* 桌面端顶部栏（仅 Logo 和用户菜单） */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/finance" className="flex items-center gap-3 group">
            
              <div>
                <h1 className="text-lg font-bold text-[#1a237e] font-serif tracking-tight">Samraddh</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5 font-medium">Finance Services</p>
              </div>
            </Link>

            {/* 用户菜单（桌面端） */}
            <div className="flex items-center gap-2">
              {mounted && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#1a237e] to-[#283593] rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {userInitial || "U"}
                    </div>
                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{userFullName}</p>
                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        href="/services"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Wallet className="w-4 h-4" /> All Services
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 移动端底部导航栏 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex items-center justify-around py-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition ${
                  active ? "text-[#1a237e]" : "text-gray-500 hover:text-[#1a237e]"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] mt-0.5 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}