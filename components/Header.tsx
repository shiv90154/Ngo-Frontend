"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
// import { FaHome, FaClipboardList, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { Home, FileText, Info, Mail } from "lucide-react";

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
  { name: "Home", href: "/", icon: Home },
  { name: "Schemes", href: "/schemes", icon: FileText },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
];

  // Fixed width container to prevent layout shift
  const AuthSection = () => (
    <div className="flex justify-end">
      {!mounted ? (
        // Placeholder with exact same dimensions
        <div className="hidden md:flex items-center gap-2 md:gap-3">
          <div className="w-[70px] md:w-[74px] h-[34px] md:h-[38px] rounded-lg"></div>
          <div className="w-[73px] md:w-[77px] h-[34px] md:h-[38px] rounded-lg"></div>
        </div>
      ) : user ? (
        // Logged in state - Dashboard and Logout buttons
        <div className="hidden md:flex items-center gap-2 md:gap-3">
          <Link
            href="/services"
            className="bg-[#1a237e] text-white hover:bg-[#0d1757] px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition shadow-sm whitespace-nowrap"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="text-[#1a237e] hover:bg-[#1a237e]/10 px-3 md:px-4 py-1.5 md:py-2 rounded-lg whitespace-nowrap text-xs md:text-sm font-medium border border-[#1a237e]/30 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        // Logged out state - exactly same dimensions as placeholder
        <div className="hidden md:flex items-center gap-2 md:gap-3">
          <Link
            href="/login"
            className="text-[#1a237e] hover:bg-[#1a237e]/10 px-3 md:px-4 py-1.5 md:py-2 rounded-lg whitespace-nowrap text-xs md:text-sm font-medium border border-[#1a237e]/30 transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-[#1a237e] text-white hover:bg-[#0d1757] px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition shadow-sm whitespace-nowrap"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );

  // Mobile auth section
  const MobileAuthSection = () => (
    <div className="pt-3 border-t border-gray-200">
      {user ? (
        <div className="flex flex-col gap-2">
          <Link
            href="/services"
            className="text-center bg-[#1a237e] text-white py-2.5 px-4 rounded-lg text-sm font-medium shadow-sm transition hover:bg-[#0d1757]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="text-center border border-[#1a237e] text-[#1a237e] py-2.5 px-4 rounded-lg text-sm font-medium transition hover:bg-[#1a237e]/10"
          >
            Logout
          </button>
        </div>
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
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-2 sm:gap-3 min-h-14 md:h-16 py-2 md:py-0">
            {/* Logo Section - responsive width */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                <Image
                  src="/logo-Photoroom.png"
                  alt="Samraddh Bharat Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                />
              </div>
              <div className="ml-0">
                <h1 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-[#1a237e] font-serif leading-tight">
                  SAMRADDH <span className="hidden xxs:inline">BHARAT</span>
                </h1>
                <p className=" xs:block text-[6px] sm:text-[8px] md:text-[10px] text-gray-500 leading-tight">
                  डिजिटल इंडिया - एकीकृत सेवा पोर्टल
                </p>
              </div>
            </Link>

            {/* Desktop Navigation - Centered, flexible */}
         <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center">
  {navItems.map((item) => {
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        href={item.href}
        className="group relative flex items-center gap-1.5 px-3 py-2 text-[15px] font-extrabold tracking-tight text-gray-700 transition-all duration-300 hover:text-[#1a237e]"
      >
        <Icon
          size={15}
          strokeWidth={2.4}
          className="shrink-0 text-gray-500 transition-all duration-300 group-hover:text-[#1a237e] group-hover:-translate-y-0.5"
        />

        <span className="relative">
          {item.name}

          <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#1a237e] transition-all duration-300 group-hover:w-full" />
        </span>
      </Link>
    );
  })}
</nav>

            {/* Auth Section - responsive */}
            <AuthSection />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-[#1a237e] hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
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
        /* Custom breakpoints for extra small screens */
        @media (min-width: 480px) {
          .xxs\\:inline {
            display: inline;
          }
        }
        
        @media (min-width: 520px) {
          .xs\\:block {
            display: block;
          }
        }
        
        /* Prevent any layout shift */
        header {
          transform: translateZ(0);
          backface-visibility: hidden;
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