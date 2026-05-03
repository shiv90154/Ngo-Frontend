"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, GitBranch, BarChart3, Settings,
  FileText, Bell, Pill, Database, TrendingUp, CreditCard, Wallet,
  BadgeDollarSign, Stethoscope, ShoppingBag, Package
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ['*'] },
  { href: "/admin/users", label: "Users", icon: Users, roles: ['*'] },
  { href: "/admin/ads", label: "Ads", icon: BadgeDollarSign, roles: ['SUPER_ADMIN'] },
  { href: "/admin/hierarchy", label: "Hierarchy", icon: GitBranch, roles: ['SUPER_ADMIN','ADDITIONAL_DIRECTOR'] },
  { href: "/admin/mlm", label: "MLM Commissions", icon: TrendingUp, roles: ['SUPER_ADMIN','ADDITIONAL_DIRECTOR'] },
  { href: "/admin/modules", label: "Modules", icon: Database, roles: ['*'] },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, roles: ['*'] },
  { href: "/admin/logs", label: "Activity Logs", icon: FileText, roles: ['SUPER_ADMIN'] },
  { href: "/admin/subscription/plans", label: "Subs. Plans", icon: CreditCard, roles: ['SUPER_ADMIN'] },
  { href: "/admin/subscription/payments", label: "Subs. Payments", icon: Wallet, roles: ['SUPER_ADMIN'] },
  { href: "/admin/notifications/send", label: "Send Alert", icon: Bell, roles: ['SUPER_ADMIN'] },
  // 🆕 Healthcare Admin Links
  { href: "/admin/doctors/verification", label: "Doctor Verifications", icon: Stethoscope, roles: ['SUPER_ADMIN'] },
  { href: "/admin/medicines", label: "Medicines", icon: Pill, roles: ['SUPER_ADMIN'] },
  { href: "/admin/medicines/orders", label: "Medicine Orders", icon: Package, roles: ['SUPER_ADMIN'] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ['SUPER_ADMIN'] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const role = mounted ? user?.role || "" : "";
  const filteredLinks = mounted
    ? links.filter(link => link.roles.includes('*') || link.roles.includes(role))
    : [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] p-4">
      {mounted ? (
        <nav className="space-y-1">
          {filteredLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                pathname === href ? "bg-[#1a237e] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      ) : (
        <div className="space-y-2 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg" />
          ))}
        </div>
      )}
    </aside>
  );
}