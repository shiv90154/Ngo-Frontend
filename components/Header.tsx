"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, ChevronDown, User, LogOut, Globe } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After hydration, we can safely show the real auth state
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Schemes", href: "/schemes" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-20 h-30 md:w-12 md:h-12 flex-shrink-0">
                <Image
                  src="/logo.webp"
    
                  alt="Samraddh Bharat Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="ml-1">
                <h1 className="text-lg md:text-xl font-bold text-[#1a237e] font-serif leading-tight">
                  SAMRADDH BHARAT
                </h1>
                <p className="text-[8px] md:text-[10px] text-gray-500 leading-tight">
                  डिजिटल इंडिया - एकीकृत सेवा पोर्टल
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#1a237e] font-semibold text-lg transition"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons - Hydration Safe */}
            <div className="hidden md:flex items-center gap-3">
              {!mounted ? (
                // Show the same unauthenticated UI during SSR and initial client render
                <>
                  <Link
                    href="/login"
                    className="text-[#1a237e] hover:bg-[#1a237e]/10 px-4 py-1.5 rounded-md text-base font-medium border border-[#1a237e]/30 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-[#1a237e] text-white hover:bg-[#0d1757] px-4 py-1.5 rounded-md text-base font-medium transition"
                  >
                    Register
                  </Link>
                </>
              ) : user ? (
                // Actual authenticated UI (only rendered on client after mount)
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-1.5 text-gray-700 hover:text-[#1a237e] text-base font-medium"
                  >
                    <User size={30} />
                    {user.fullName?.split(" ")[0] || "Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-base font-medium"
                  >
                    <LogOut size={30} />
                    Logout
                  </button>
                </>
              ) : (
                // Unauthenticated UI (also shown when user is null)
                <>
                  <Link
                    href="/login"
                    className="text-[#1a237e] hover:bg-[#1a237e]/10 px-4 py-1.5 rounded-md text-base font-medium border border-[#1a237e]/30 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-[#1a237e] text-white hover:bg-[#0d1757] px-4 py-1.5 rounded-md text-base font-medium transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#1a237e] hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Hydration Safe */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-3 px-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#1a237e] font-semibold text-lg py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
                {!mounted ? (
                  // Placeholder for mobile
                  <>
                    <Link
                      href="/login"
                      className="text-center border border-[#1a237e] text-[#1a237e] py-2 rounded-md text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="text-center bg-[#1a237e] text-white py-2 rounded-md text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-gray-700 text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={18} /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-red-600 text-base"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-center border border-[#1a237e] text-[#1a237e] py-2 rounded-md text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="text-center bg-[#1a237e] text-white py-2 rounded-md text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;