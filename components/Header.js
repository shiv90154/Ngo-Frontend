'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/initiatives', label: 'Initiatives' },
    { path: '/contact', label: 'Contact' }
];

const TopBar = () => (
    <div className="w-full bg-[#1e293b] text-white hidden md:block border-b border-[#334155]">
        <div className="container mx-auto px-4 lg:px-8 py-2 flex items-center justify-between">
            <div className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-wider">
                <a href="mailto:support@samraddhbharat.gov.in" className="flex items-center gap-2 hover:text-[#FF7B00] transition-colors">
                    <span>✉</span> support@samraddhbharat.gov.in
                </a>
                <a href="tel:18001234567" className="flex items-center gap-2 hover:text-[#FF7B00] transition-colors">
                    <span>📞</span> Toll Free: 1800-123-4567
                </a>
            </div>
            <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block text-gray-400">Connect with us:</span>
                {/* Facebook Icon */}
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-[#FF7B00] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                {/* X (Twitter) Icon */}
                <a href="#" aria-label="X (Twitter)" className="text-gray-400 hover:text-[#FF7B00] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                </a>
                {/* YouTube Icon */}
                <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-[#FF7B00] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.418-7.814.418-7.814.418s-6.255 0-7.814-.418a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.504 2.504 0 0 1 1.768-1.768C5.746 5 12 5 12 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" /></svg>
                </a>
            </div>
        </div>
    </div>
);

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const isAuthenticated = useMemo(() => Boolean(user), [user]);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const go = useCallback((path) => {
        setMobileMenuOpen(false);
        router.push(path);
    }, [router]);

    const handleLogout = useCallback(() => {
        logout();
        toast.info("Logged out successfully");
        go("/");
    }, [logout, go]);

    const isAct = useCallback((path) => {
        if (path === '/' && pathname !== '/') return false;
        return pathname?.startsWith(path);
    }, [pathname]);

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />

            {/* Top Info Bar - Normal Document Flow */}
            <TopBar />

            {/* Main Header - Sticky */}
            <header className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${scrolled ? "shadow-md border-b-2 border-[#FF7B00]" : "border-b border-gray-200"}`}>
                <div className="container mx-auto px-4 lg:px-8 py-3">
                    <div className="flex items-center justify-between min-h-[50px]">

                        {/* Logo */}
                        <button onClick={() => go("/")} aria-label="Home" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#FF7B00] px-1 rounded-sm">
                            <img src="/logo.jpg" alt="Logo" className="w-12 h-12 object-contain" onError={(e) => { e.target.onerror = null; e.target.src = '/fallback-logo.png'; }} />
                            <div className="leading-tight text-left hidden sm:flex flex-col">
                                <span className="block text-[16px] font-black text-gray-900 tracking-tight uppercase">Samraddh Bharat</span>
                                <span className="block text-[11px] text-[#FF7B00] font-bold tracking-widest uppercase">Foundation</span>
                            </div>
                        </button>

                        {/* Center Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {NAV_ITEMS.map(({ path, label }) => (
                                <button key={path} onClick={() => go(path)} className={`text-[13px] font-bold uppercase tracking-wider transition-colors duration-150 border-b-2 py-1 ${isAct(path) ? "text-[#FF7B00] border-[#FF7B00]" : "text-gray-700 hover:text-[#FF7B00] border-transparent"}`}>
                                    {label}
                                </button>
                            ))}
                        </nav>

                        {/* Right Desktop Action Buttons */}
                        <div className="hidden lg:flex items-center gap-3" suppressHydrationWarning>

                            <div className="w-px h-6 bg-gray-300 mx-1 block" />

                            {mounted ? (
                                isAuthenticated ? (
                                    <>
                                        <button onClick={() => go("/services")} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#FF7B00] hover:bg-[#cc6200] border border-[#cc6200] rounded-sm transition-colors shadow-sm">
                                            Dashboard
                                        </button>
                                        <button onClick={handleLogout} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm transition-colors">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => go("/login")} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-sm transition-colors shadow-sm">
                                            Login
                                        </button>
                                        <button onClick={() => go("/register")} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#FF7B00] hover:bg-[#cc6200] border border-[#cc6200] rounded-sm transition-colors shadow-sm">
                                            Register Base
                                        </button>
                                    </>
                                )
                            ) : (
                                <>
                                    <button className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 bg-white border border-gray-300 rounded-sm">
                                        Login
                                    </button>
                                    <button className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#FF7B00] border border-[#cc6200] rounded-sm">
                                        Register Base
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Hamburger for Mobile */}
                        <button
                            onClick={() => setMobileMenuOpen(p => !p)}
                            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none bg-gray-100 border border-gray-300 rounded-sm">
                            <span className={`block w-4 h-[2px] bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
                            <span className={`block w-4 h-[2px] bg-gray-800 transition-all duration-200 my-[2px] ${mobileMenuOpen ? "opacity-0" : ""}`} />
                            <span className={`block w-4 h-[2px] bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
                        </button>

                    </div>
                </div>

                {/* Mobile Dropdown Panel */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
                        <div className="flex flex-col p-4 bg-gray-50 border-b border-gray-200">
                            <button onClick={() => alert("Grievance portal coming soon!")} className="w-full text-center px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#d97706] bg-white border border-[#d97706] rounded-sm">
                                Track Grievance
                            </button>
                        </div>
                        <div className="flex flex-col p-2">
                            {NAV_ITEMS.map(({ path, label }) => (
                                <button key={path} onClick={() => go(path)}
                                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wide border-b border-gray-100 last:border-0 ${isAct(path) ? "text-[#FF7B00] bg-orange-50/50" : "text-gray-700 hover:bg-gray-50"}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-100 border-t border-gray-200 flex flex-col gap-2">
                            {mounted && (
                                isAuthenticated ? (
                                    <>
                                        <button onClick={() => go("/services")} className="w-full py-3 text-xs font-bold uppercase text-white bg-[#FF7B00] border border-[#cc6200] rounded-sm">Dashboard</button>
                                        <button onClick={handleLogout} className="w-full py-3 text-xs font-bold uppercase text-gray-700 bg-white border border-gray-300 rounded-sm">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => go("/login")} className="w-full py-3 text-xs font-bold uppercase text-gray-700 bg-white border border-gray-300 rounded-sm">Login</button>
                                        <button onClick={() => go("/register")} className="w-full py-3 text-xs font-bold uppercase text-white bg-[#FF7B00] border border-[#cc6200] rounded-sm">Register</button>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;