"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  CheckSquare,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  MonitorSmartphone,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ITNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = useMemo(() => {
    return [
      { name: "Dashboard", href: "/it", icon: LayoutDashboard },
      { name: "Clients", href: "/it/clients", icon: Users },
      { name: "Projects", href: "/it/projects", icon: FolderKanban },
      { name: "Invoices", href: "/it/invoices", icon: FileText },
      { name: "Tasks", href: "/it/tasks", icon: CheckSquare },
    ];
  }, []);

  const isActive = (href: string) => {
    if (href === "/it" && pathname === "/it") return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const userInitial = mounted && user?.fullName ? user.fullName.charAt(0) : "";
  const userFullName = mounted && user?.fullName ? user.fullName : "";
  const userEmail = mounted && user?.email ? user.email : "";

  return (
    <>
      {/* 桌面端顶部 */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/it" className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-[#1a237e] rounded-full flex items-center justify-center border border-[#FF9933]">
                  <span className="text-white text-sm font-serif">अ</span>
                </div>
                <div className="w-8 h-8 bg-[#1a237e] rounded-full flex items-center justify-center border border-[#FF9933]">
                  <span className="text-white text-sm font-serif">₹</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1a237e] font-serif">Samraddh</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">IT Services</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              {mounted && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#1a237e] to-[#283593] rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {userInitial || "U"}
                    </div>
                    <span className="text-sm font-medium">{userFullName}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{userFullName}</p>
                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/services" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <MonitorSmartphone className="w-4 h-4" /> All Services
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
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

      {/* 移动端底部导航 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${active ? "text-[#1a237e]" : "text-gray-500 hover:text-[#1a237e]"}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-0.5">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}