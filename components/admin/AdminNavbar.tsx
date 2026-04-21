"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Shield, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#1a237e]" />
          <h1 className="text-xl font-bold text-[#1a237e]">Admin Panel</h1>
          {mounted && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {user?.role || "ADMIN"}
            </span>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-[#1a237e] rounded-full flex items-center justify-center text-white">
              {mounted && user?.fullName ? user.fullName.charAt(0) : "A"}
            </div>
            {mounted && <span>{user?.fullName || "Admin"}</span>}
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                onClick={() => setShowMenu(false)}
              >
                <User size={16} /> Profile
              </Link>
              <button
                onClick={() => {
                  setShowMenu(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}