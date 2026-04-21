"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FolderKanban, FileText, CheckSquare, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { itAPI } from "@/lib/api";

export default function ITSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [stats, setStats] = useState({ clientCount: 0, projectCount: 0, unpaidInvoices: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await itAPI.getDashboard();
        setStats(res.data.stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/it", icon: LayoutDashboard },
    { name: "Clients", href: "/it/clients", icon: Users, badge: stats.clientCount },
    { name: "Projects", href: "/it/projects", icon: FolderKanban, badge: stats.projectCount },
    { name: "Invoices", href: "/it/invoices", icon: FileText, badge: stats.unpaidInvoices },
    { name: "Tasks", href: "/it/tasks", icon: CheckSquare },
  ];

  const isActive = (href: string) => {
    if (href === "/it" && pathname === "/it") return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-97px)] sticky top-[97px] p-4">
      <div className="flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-[#1a237e]/5 to-transparent rounded-xl">
        <div className="w-10 h-10 bg-[#1a237e] rounded-full flex items-center justify-center text-white text-sm">
          {user?.fullName?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{user?.fullName}</p>
          <p className="text-xs text-gray-500 truncate">{user?.role}</p>
        </div>
      </div>
      <nav className="space-y-0.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition ${active ? "bg-[#1a237e]/10 text-[#1a237e]" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {link.name}
              </span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="bg-[#1a237e] text-white text-xs px-2 py-0.5 rounded-full">{link.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs text-gray-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Quick Tip</p>
        <p className="text-sm text-gray-700 mt-1">Use keyboard shortcuts to navigate faster.</p>
      </div>
    </aside>
  );
}