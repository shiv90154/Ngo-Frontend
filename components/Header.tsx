"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Schemes", href: "/schemes" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Fixed width container to prevent layout shift
  const AuthSection = () => (
    <div className="w-[140px] flex justify-end">
      {!mounted ? (
        // Placeholder with exact same dimensions
        <div className="hidden md:flex items-center gap-3">
          <div className="w-[74px] h-[38px] rounded-lg"></div>
          <div className="w-[77px] h-[38px] rounded-lg"></div>
        </div>
      ) : user ? (
        // Logged in state - same width container
        <div className="hidden md:flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#1a237e] font-medium transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#1a237e]/10 flex items-center justify-center">
                <User size={18} className="text-[#1a237e]" />
              </div>
              <span className="text-sm font-semibold max-w-[80px] truncate">
                {user?.fullName?.split(" ")[0] || "User"}
              </span>
              <ChevronDown size={16} className={`transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <User size={16} /> My Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Logged out state - exactly same dimensions as placeholder
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[#1a237e] hover:bg-[#1a237e]/10 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium border border-[#1a237e]/30 transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-[#1a237e] text-white hover:bg-[#0d1757] px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );

  // Mobile auth section - also fixed width
  const MobileAuthSection = () => (
    <div className="pt-3 border-t border-gray-200">
      {user ? (
        <>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-gray-700 text-base py-2.5 px-3 rounded-lg hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={18} /> My Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-red-600 text-base py-2.5 px-3 rounded-lg hover:bg-red-50 w-full text-left"
          >
            <LogOut size={18} /> Logout
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="text-center border border-[#1a237e] text-[#1a237e] py-2.5 rounded-lg text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-center bg-[#1a237e] text-white py-2.5 rounded-lg text-sm font-medium shadow-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo Section - fixed width */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 min-w-[160px] md:min-w-[200px]">
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                <Image
                  src="/logo-Photoroom.png"
                  alt="Samraddh Bharat Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="40px"
                />
              </div>
              <div className="ml-0 md:ml-1">
                <h1 className="text-base md:text-xl font-bold text-[#1a237e] font-serif leading-tight">
                  SAMRADDH BHARAT
                </h1>
                <p className="hidden sm:block text-[8px] md:text-[10px] text-gray-500 leading-tight">
                  डिजिटल इंडिया - एकीकृत सेवा पोर्टल
                </p>
              </div>
            </Link>

            {/* Desktop Navigation - Centered, flexible */}
            <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#1a237e] font-semibold text-sm transition whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Auth Section - fixed width to prevent CLS */}
            <AuthSection />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-[#1a237e] hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#1a237e] hover:bg-gray-50 font-medium text-base py-2.5 px-3 rounded-lg transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <MobileAuthSection />
            </nav>
          </div>
        )}
      </header>

      <style jsx global>{`
        /* Prevent any layout shift */
        header {
          min-height: 56px;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        @media (min-width: 768px) {
          header {
            min-height: 64px;
          }
        }
        
        /* Ensure consistent rendering */
        .flex {
          flex-shrink: 0;
        }
        
        /* Smooth transitions for auth state changes */
        .transition-opacity {
          transition-property: opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </>
  );
};

export default Header;