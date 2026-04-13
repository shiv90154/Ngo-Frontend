'use client';
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NAV_ITEMS = [
    { path: "/", label: "Home"  },
    { path: "/about", label: "About"},
    { path: "/contact", label: "Contact" },
];

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth() || {};
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    const handleNavigation = (path) => {
        router.push(path);
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout?.();
        toast.success("Logged out successfully! 👋");
        handleNavigation("/");
    };

    const isActive = (path) => pathname === path;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="light" />
            
            {/* NAVBAR - NO GAP, NO BORDER LINE */}
            <div className="fixed top-0 left-0 w-full z-[9999]">
                {/* Top Bar */}
                <div className="hidden md:block bg-[#1a1f2e] text-white">
                    <div className="container mx-auto px-4 py-2">
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex gap-4">
                                <a href="mailto:support@samraddhbharat.gov.in" className="flex items-center gap-1 hover:text-[#FF9933] transition">
                                    📧 support@samraddhbharat.gov.in
                                </a>
                                <a href="tel:18001234567" className="flex items-center gap-1 hover:text-[#FF9933] transition">
                                    📞 1800-123-4567
                                </a>
                            </div>
                            <div className="flex gap-3">
                                <span>Follow Us:</span>
                                <a href="#" className="hover:text-[#FF9933] transition">💼 LinkedIn</a>
                                <a href="#" className="hover:text-[#FF9933] transition">📷 Instagram</a>
                                <a href="#" className="hover:text-[#FF9933] transition">▶️ YouTube</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Header - NO BORDER LINE */}
                <header className={`bg-white transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}>
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16 md:h-20">
                            {/* LOGO */}
                            <button onClick={() => handleNavigation("/")} className="flex items-center gap-3 group">
                                <div className="relative">
                                    <img 
                                        src="https://imgs.search.brave.com/Z7BsBjTSP1eF97u5i-Huj5-6iGwHN3DTNmoU50xd4ls/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzM4LzEvYWF0bWFu/aXJiaGFyLWJoYXJh/dC1sb2dvLXBuZ19z/ZWVrbG9nby0zODk4/NzMucG5n" 
                                        alt="Logo" 
                                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-all"
                                    />
                                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 flex">
                                        <span className="flex-1 bg-[#FF9933]" />
                                        <span className="flex-1 bg-white" />
                                        <span className="flex-1 bg-[#138808]" />
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-sm md:text-base font-black flex items-center gap-1">
                                     SAMRADDH BHARAT
                                    </div>
                                  
                                </div>
                            </button>

                            {/* NAV LINKS */}
                            <nav className="hidden md:flex items-center gap-2">
                                {NAV_ITEMS.map(({ path, label, icon }) => (
                                    <button
                                        key={path}
                                        onClick={() => handleNavigation(path)}
                                        className={`flex items-center gap-2 px-5 py-2.5 text-base font-bold rounded-xl transition-all
                                            ${isActive(path) 
                                                ? "text-[#FF9933] bg-[#FF9933]/10" 
                                                : "text-gray-700 hover:text-[#FF9933] hover:bg-gray-50"
                                            }`}
                                    >
                                        <span>{icon}</span> {label}
                                    </button>
                                ))}
                            </nav>

                            {/* AUTH BUTTONS */}
                            <div className="hidden md:flex gap-3">
                                {user ? (
                                    <>
                                        <button onClick={() => handleNavigation("/services")} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#138808] rounded-xl hover:bg-[#0a5c06] transition-all">
                                            📊 Dashboard
                                        </button>
                                        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all">
                                            🚪 Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleNavigation("/login")} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#FF9933] border-2 border-[#FF9933] rounded-xl hover:bg-[#FF9933] hover:text-white transition-all">
                                            Login
                                        </button>
                                        <button onClick={() => handleNavigation("/register")} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#FF9933] rounded-xl hover:bg-[#e6891c] transition-all">
                                             Register
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* MOBILE MENU BUTTON */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg z-[10000] relative"
                            >
                                {!mobileMenuOpen ? (
                                    <span className="text-2xl">☰</span>
                                ) : (
                                    <span className="text-2xl">✕</span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[9998] md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    
                    <div className="absolute top-16 md:top-20 left-0 right-0 bottom-0 bg-white overflow-y-auto">
                        <div className="p-4">
                            {/* Contact Info */}
                            <div className="bg-gradient-to-r from-[#1a1f2e] to-[#1e2436] rounded-xl p-4 mb-4 text-white">
                                <a href="mailto:support@samraddhbharat.gov.in" className="flex items-center gap-2 text-sm mb-2 hover:text-[#FF9933] transition">
                                    ✉️ support@samraddhbharat.gov.in
                                </a>
                                <a href="tel:18001234567" className="flex items-center gap-2 text-sm hover:text-[#FF9933] transition">
                                    📞 1800-123-4567
                                </a>
                            </div>

                            {/* Nav Links Mobile */}
                            {NAV_ITEMS.map(({ path, label, icon }) => (
                                <button
                                    key={path}
                                    onClick={() => handleNavigation(path)}
                                    className={`flex items-center gap-3 w-full text-left py-4 px-4 rounded-xl font-bold text-base mb-2 transition-all
                                        ${isActive(path) 
                                            ? "bg-[#FF9933]/10 text-[#FF9933] border-l-4 border-[#FF9933]" 
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-2xl">{icon}</span> {label}
                                </button>
                            ))}

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4" />

                            {/* Auth Buttons Mobile */}
                            {user ? (
                                <>
                                    <button onClick={() => handleNavigation("/services")} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white bg-[#138808] mb-2 transition-all">
                                        📊 Dashboard
                                    </button>
                                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white bg-red-500 transition-all">
                                        🚪 Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleNavigation("/login")} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-[#FF9933] border-2 border-[#FF9933] mb-2 transition-all">
                                        🔐 Login
                                    </button>
                                    <button onClick={() => handleNavigation("/register")} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white bg-[#FF9933] transition-all">
                                        📝 Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;