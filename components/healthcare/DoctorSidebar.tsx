"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, Clock, FileText, Settings } from "lucide-react";

export default function DoctorSidebar() {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", href: "/healthcare/doctor/dashboard", icon: LayoutDashboard },
    { name: "Patients", href: "/healthcare/doctor/patients", icon: Users },
    { name: "Appointments", href: "/healthcare/doctor/appointments", icon: Calendar },
    { name: "Schedule", href: "/healthcare/doctor/schedule", icon: Clock },
    { name: "Prescriptions", href: "/healthcare/doctor/prescriptions", icon: FileText },
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-97px)] sticky top-[97px] p-4">
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${active ? "bg-[#1a237e]/10 text-[#1a237e]" : "text-gray-600 hover:bg-gray-50"}`}>
              <link.icon size={18} /> {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}