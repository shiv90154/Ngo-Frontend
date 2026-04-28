"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, Award, PenTool, Video, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";

export default function EducationSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = useMemo(() => {
    // Student links (default for all non‑teachers)
    const studentLinks = [
      { name: "Browse Courses", href: "/education/courses", icon: BookOpen },
      { name: "My Learning", href: "/education/my-courses", icon: Clock },
      { name: "Live Classes", href: "/education/live", icon: Video },
      { name: "Wikipedia", href: "/education/wikipedia", icon: Globe },
      { name: "Certificates", href: "/education/certificates", icon: Award },
    ];

    // Teacher links – only shown when mounted and user is a teacher
    if (mounted && user?.role === "TEACHER") {
      return [
        { name: "Dashboard", href: "/education/instructor/dashboard", icon: BookOpen },
        { name: "My Courses", href: "/education/instructor/courses", icon: BookOpen },
        { name: "Create Course", href: "/education/instructor/courses/new", icon: PenTool },
        { name: "Tests", href: "/education/instructor/tests", icon: Clock },
        { name: "Live Classes", href: "/education/live", icon: Video },
        { name: "Wikipedia", href: "/education/wikipedia", icon: Globe },
      ];
    }

    return studentLinks;
  }, [mounted, user]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] sticky top-[65px] p-4">
      <nav className="space-y-1">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                active
                  ? "bg-[#1a237e]/10 text-[#1a237e]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}