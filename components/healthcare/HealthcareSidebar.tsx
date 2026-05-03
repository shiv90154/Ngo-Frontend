"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Calendar,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Pill,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function HealthcareSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDoctor = mounted && user?.role === "DOCTOR";

  const patientLinks = [
    { name: "Dashboard", href: "/healthcare", icon: LayoutDashboard },
    { name: "Find Doctors", href: "/healthcare/patient/doctors", icon: Search },
    { name: "My Appointments", href: "/healthcare/patient/appointments", icon: Calendar },
    { name: "Health Records", href: "/healthcare/patient/records", icon: FileText },
    { name: "Prescriptions", href: "/healthcare/patient/prescriptions", icon: Pill },
    { name: "Medicines", href: "/healthcare/medicines", icon: ShoppingBag },
  ];

  const doctorLinks = [
    { name: "Dashboard", href: "/healthcare/doctor/dashboard", icon: LayoutDashboard },
    { name: "My Patients", href: "/healthcare/doctor/patients", icon: Users },
    { name: "Appointments", href: "/healthcare/doctor/appointments", icon: Calendar },
    { name: "Schedule", href: "/healthcare/doctor/schedule", icon: Clock },
    { name: "Prescriptions", href: "/healthcare/doctor/prescriptions", icon: Pill },
    { name: "Medicines", href: "/healthcare/medicines", icon: ShoppingBag },
  ];

  const links = isDoctor ? doctorLinks : patientLinks;

  const isActive = (href: string) => {
    if (href === "/healthcare") {
      return pathname === "/healthcare" || pathname === "/healthcare/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto p-4">
      <nav className="space-y-0.5">
        {links.map((link) => {
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

      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/healthcare/help"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-[#1a237e] rounded-lg transition"
        >
          <HelpCircle className="w-4 h-4" />
          Help & Support
        </Link>
        <Link
          href="/healthcare/settings"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-[#1a237e] rounded-lg transition"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}