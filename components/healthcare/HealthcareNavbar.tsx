"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Heart,
  Bell,
  User,
  Search,
  Calendar,
  FileText,
  Menu,
  X,
  ChevronDown,
  Stethoscope,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import LogoutButton from "@/components/LogoutButton";

export default function HealthcareNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safer: default to patient dashboard until mounted
  const dashboardHref =
    mounted && user?.role === "DOCTOR"
      ? "/healthcare/doctor/dashboard"
      : "/healthcare";

  // Mobile navigation items (only used in mobile menu)
  const mobileNavItems = [
    { name: "Dashboard", href: dashboardHref, icon: Heart },
    { name: "Find Doctors", href: "/healthcare/doctors", icon: Search },
    { name: "Appointments", href: "/healthcare/appointments", icon: Calendar },
    { name: "Health Records", href: "/healthcare/records", icon: FileText },
    { name: "Prescriptions", href: "/healthcare/prescriptions", icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === "/healthcare" && pathname === "/healthcare") return true;
    if (
      href === "/healthcare/doctor/dashboard" &&
      pathname.startsWith("/healthcare/doctor/dashboard")
    )
      return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const userInitial = mounted && user?.fullName ? user.fullName.charAt(0) : "";
  const userFullName = mounted && user?.fullName ? user.fullName : "";
  const userEmail = mounted && user?.email ? user.email : "";
  const userRole = mounted && user?.role ? user.role.replace(/_/g, " ") : "";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - size increased to w-16 h-16 (64px) with subtle styling */}
          <Link href={dashboardHref} className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
              <Image
                src="/doctor.png"  // 👈 Change to your actual healthcare logo path
                alt="Samraddh Healthcare Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1a237e] font-serif">
                Samraddh
              </h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">
                Healthcare Services
              </p>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-100 transition border border-red-200">
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Emergency</span>
              <span className="animate-pulse">🚑</span>
            </button>

            <NotificationBell />

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
                      <span className="inline-block mt-1 text-xs bg-[#1a237e]/10 text-[#1a237e] px-2 py-0.5 rounded-full">{userRole}</span>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}><User size={16} /> My Profile</Link>
                    <Link href="/services" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}><Heart size={16} /> All Services</Link>
                    <hr className="my-1 border-gray-100" />
                    <LogoutButton />
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#1a237e]"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-2 px-4">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  active ? "bg-[#1a237e]/10 text-[#1a237e]" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}