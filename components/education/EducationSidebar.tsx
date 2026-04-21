"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, Award, Settings, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function EducationSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const studentLinks = [
    { name: "Browse Courses", href: "/education/courses", icon: BookOpen },
    { name: "My Learning", href: "/education/my-courses", icon: Clock },
    { name: "Certificates", href: "/education/certificates", icon: Award },
  ];

  const instructorLinks = [
    { name: "Dashboard", href: "/education/instructor/dashboard", icon: BookOpen },
    { name: "My Courses", href: "/education/instructor/courses", icon: BookOpen },
    { name: "Create Course", href: "/education/instructor/courses/new", icon: BookOpen },
  ];

  const links = user?.role === "TEACHER" ? instructorLinks : studentLinks;

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] sticky top-[65px] p-4">
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
      <div className="absolute bottom-4 left-4 right-4">
        <Link href="/help" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a237e]"><HelpCircle size={16} /> Help</Link>
      </div>
    </aside>
  );
}