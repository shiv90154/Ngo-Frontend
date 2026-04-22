"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  Home,
  Search,
  User,
  PlusSquare,
  Bell,
  Settings,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationAPI } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "@/components/LogoutButton"; // 🆕 导入独立注销组件

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function NewsNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await notificationAPI.getNotifications({ filter: "unread", limit: 1 });
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      // Silent catch
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [mounted, fetchUnreadCount]);

  const navItems = useMemo<NavItem[]>(() => {
    const base: NavItem[] = [
      { name: "Home", href: "/news", icon: Home },
      { name: "Search", href: "/news/search", icon: Search },
      { name: "Create", href: "/news/create", icon: PlusSquare },
      { name: "Alerts", href: "/news/notifications", icon: Bell, badge: unreadCount },
    ];
    if (mounted && user?._id) {
      base.push({ name: "Profile", href: `/news/profile/${user._id}`, icon: User });
    } else {
      base.push({ name: "Profile", href: "/news/profile", icon: User });
    }
    return base;
  }, [mounted, user, unreadCount]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/news" && pathname === "/news") return true;
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname]
  );

  if (!mounted) {
    return (
      <header className="hidden lg:block sticky top-0 z-50 bg-white border-b border-slate-200 h-16" />
    );
  }

  const userInitial = user?.fullName?.charAt(0) || "";
  const userFullName = user?.fullName || "";
  const userEmail = user?.email || "";

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/news" className="flex items-center gap-3 group">
              <div>
                <h1 className="text-xl font-black text-[#1a237e] tracking-tight">Samraddh</h1>
                <p className="text-[10px] text-slate-500 -mt-0.5 font-semibold uppercase tracking-wider">News & Media</p>
              </div>
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full hover:bg-slate-50 ring-1 ring-transparent hover:ring-slate-200 transition-all"
              >
                <span className="text-sm font-medium text-slate-700">{userFullName}</span>
                <div className="w-8 h-8 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {userInitial}
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl ring-1 ring-slate-900/5 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="font-semibold text-slate-900">{userFullName}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{userEmail}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href={`/news/profile/${user?._id}`}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Profile
                      </Link>
                      <Link
                        href="/news/settings"
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 text-slate-400" /> Settings
                      </Link>
                      <Link
                        href="/services"
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Newspaper className="w-4 h-4 text-slate-400" /> All Services
                      </Link>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-1">
                      <LogoutButton /> {/* 🆕 使用独立注销组件 */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex flex-col items-center px-4 py-2 rounded-xl transition-colors ${
                  active ? "text-[#1a237e]" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 transition-transform ${active ? "scale-110" : ""}`} />
                  {item.badge ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm px-1 ring-2 ring-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${active ? "font-bold" : ""}`}>
                  {item.name}
                </span>
                
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-2 w-10 h-1 bg-[#1a237e] rounded-b-full"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}