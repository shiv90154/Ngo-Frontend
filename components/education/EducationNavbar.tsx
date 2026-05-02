"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  PenTool,
  User,
  Menu,
  X,
  ChevronDown,
  Globe,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/LogoutButton";

export default function EducationNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = useMemo(() => {
    const base = [
      { name: "Browse", href: "/education/courses", icon: BookOpen },
      { name: "My Learning", href: "/education/my-courses", icon: GraduationCap },
      { name: "Wikipedia", href: "/education/wikipedia", icon: Globe },
    ];
    if (mounted && user?.role === "TEACHER") {
      base.push({
        name: "Instructor",
        href: "/education/instructor/dashboard",
        icon: PenTool,
      });
    }
    return base;
  }, [mounted, user]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 h-16 flex items-center justify-between">
          <Link href="/education" className="flex items-center gap-4">
            {/* Logo - size increased to w-16 h-16 (64px) and added subtle styling */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
              <Image
                src="/education.jpeg"
                alt="Samraddh Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1a237e]">Samraddh</h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">Education</p>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-[#1a237e]/10 text-[#1a237e]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon size={16} /> {item.name}
              </Link>
            ))}
          </nav>
          <div className="relative">
            {mounted && (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5"
                >
                  <div className="w-8 h-8 bg-[#1a237e] rounded-full text-white flex items-center justify-center">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                  <ChevronDown size={16} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <LogoutButton />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center ${
                isActive(item.href) ? "text-[#1a237e]" : "text-gray-500"
              }`}
            >
              <item.icon size={22} />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}