'use client';
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastConfig = {
    position: "top-right", autoClose: 2500, hideProgressBar: false,
    closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored",
    style: { borderRadius: "12px", fontWeight: "500", padding: "12px 16px" },
    progressStyle: { background: "#fff" },
};

const NAV_ITEMS = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
];

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);
const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);
const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

/* ── Top Info Bar ── */
const TopBar = React.memo(() => (
    <div className="w-full bg-[#1a1f2e] hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-gray-300">
                <a href="mailto:support@samraddhbharat.gov.in"
                    className="flex items-center gap-1.5 hover:text-[#FF9933] transition-colors duration-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    support@samraddhbharat.gov.in
                </a>
                <a href="tel:18001234567"
                    className="flex items-center gap-1.5 hover:text-[#FF9933] transition-colors duration-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.41-1.41a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    +91 1800-123-4567 (Toll Free)
                </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Follow Us:</span>
                {[
                    { label: "LinkedIn", Icon: LinkedInIcon },
                    { label: "Instagram", Icon: InstagramIcon },
                    { label: "YouTube", Icon: YouTubeIcon },
                ].map(({ label, Icon }) => (
                    <a key={label} href="#" aria-label={label}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF9933] text-gray-300 hover:text-white transition-all duration-200">
                        <Icon />
                    </a>
                ))}
            </div>
        </div>
    </div>
));
TopBar.displayName = "TopBar";

/* ── Main Header ── */
const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth() || {};

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isAuthenticated = useMemo(() => Boolean(user), [user]);

    useEffect(() => {
        const onScroll = () => requestAnimationFrame(() => setScrolled(window.scrollY > 10));
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

    useEffect(() => {
        if (document.getElementById("sbf-header-styles")) return;
        const s = document.createElement("style");
        s.id = "sbf-header-styles";
        s.textContent = `
            @keyframes sbfSlideDown {
                from { opacity:0; transform:translateY(-8px); }
                to   { opacity:1; transform:translateY(0); }
            }
            .sbf-slide-down { animation: sbfSlideDown 0.22s ease-out; }
        `;
        document.head.appendChild(s);
    }, []);

    const go = useCallback((path) => { router.push(path); setMobileMenuOpen(false); }, [router]);
    const isAct = useCallback((p) => pathname === p, [pathname]);

    const handleLogout = useCallback(() => {
        logout?.();
        toast.success("Logged out successfully 👋", toastConfig);
        go("/");
    }, [logout, go]);

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="light"
                hideProgressBar={false} closeOnClick draggable pauseOnHover />

            {/* Sticky wrapper wrapping both bars */}
            <div className="fixed top-0 left-0 w-full z-50 ">
                <TopBar />

                <header className={`w-full bg-white transition-shadow duration-300 ${scrolled ? "shadow-lg" : "border-b border-gray-100"}`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">

                            {/* ── Logo ── */}
                            <button onClick={() => go("/")} aria-label="Samraddh Bharat Home"
                                className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF9933] rounded-lg shrink-0">
                                <div className="relative">
                                    <img src="/logo.jpg" alt="SBF Logo"
                                        className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                                    <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 flex rounded-b-lg overflow-hidden">
                                        <span className="flex-1 bg-[#FF9933]" />
                                        <span className="flex-1 bg-white border-t border-gray-200" />
                                        <span className="flex-1 bg-[#138808]" />
                                    </div>
                                </div>
                                <div className="leading-tight text-left hidden sm:block">
                                    <span className="block text-sm font-extrabold text-gray-900 tracking-wide">SAMRADDH BHARAT</span>
                                    <span className="block text-[10px] text-gray-500 font-semibold tracking-widest uppercase">Foundation</span>
                                </div>
                            </button>

                            {/* ── Desktop Nav Links — hidden on mobile ── */}
                            <nav className="hidden md:flex items-center gap-0.5">
                                {NAV_ITEMS.map(({ path, label }) => (
                                    <button key={path} onClick={() => go(path)}
                                        aria-current={isAct(path) ? "page" : undefined}
                                        className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 group
                                            ${isAct(path) ? "text-[#FF9933]" : "text-gray-700 hover:text-[#FF9933]"}`}>
                                        {label}
                                        <span className={`absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-[#FF9933] transition-all duration-200
                                            ${isAct(path) ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"}`} />
                                    </button>
                                ))}
                            </nav>

                            {/* ── Desktop Auth Buttons — hidden on mobile ── */}
                            <div className="hidden md:flex items-center gap-2">
                                {isAuthenticated ? (
                                    <>
                                        <button onClick={() => go("/services")}
                                            className="px-4 py-2 text-sm font-semibold text-white bg-[#138808] rounded-lg hover:bg-[#0a5c06] transition-colors focus:outline-none focus:ring-2 focus:ring-[#138808]">
                                            Dashboard
                                        </button>
                                        <button onClick={handleLogout}
                                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => go("/login")}
                                            className="px-4 py-2 text-sm font-semibold text-[#FF9933] border-2 border-[#FF9933] rounded-lg hover:bg-[#FF9933] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF9933]">
                                            Login
                                        </button>
                                        <button onClick={() => go("/register")}
                                            className="px-4 py-2 text-sm font-semibold text-white bg-[#FF9933] rounded-lg hover:bg-[#e6891c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF9933]">
                                            Register
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* ── Hamburger — ONLY visible on mobile (md:hidden) ── */}
                            <button
                                onClick={() => setMobileMenuOpen(p => !p)}
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileMenuOpen}
                                aria-controls="sbf-mobile-nav"
                                className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF9933]">
                                <span className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                                <span className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-200 my-[5px] ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
                                <span className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {/* ── Mobile Dropdown — md:hidden ensures desktop never shows this ── */}
                    {mobileMenuOpen && (
                        <div id="sbf-mobile-nav"
                            className="md:hidden bg-white border-t border-gray-100 shadow-xl sbf-slide-down">
                            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">

                                {/* Contact strip (replaces TopBar on mobile) */}
                                <div className="bg-[#1a1f2e] rounded-xl px-4 py-3 mb-2 space-y-1.5">
                                    <a href="mailto:support@samraddhbharat.gov.in"
                                        className="flex items-center gap-2 text-xs text-gray-300 hover:text-[#FF9933] transition-colors">
                                        ✉ support@samraddhbharat.gov.in
                                    </a>
                                    <a href="tel:18001234567"
                                        className="flex items-center gap-2 text-xs text-gray-300 hover:text-[#FF9933] transition-colors">
                                        📞 1800-123-4567 (Toll Free)
                                    </a>
                                </div>

                                {/* Nav links */}
                                {NAV_ITEMS.map(({ path, label }) => (
                                    <button key={path} onClick={() => go(path)}
                                        className={`text-left w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors duration-150
                                            ${isAct(path) ? "bg-[#FF9933]/10 text-[#FF9933]" : "text-gray-700 hover:bg-gray-50"}`}>
                                        {label}
                                    </button>
                                ))}

                                <div className="my-2 border-t border-gray-100" />

                                {/* Auth buttons — inside hamburger only */}
                                {isAuthenticated ? (
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => go("/services")}
                                            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#138808] hover:bg-[#0a5c06] transition-colors">
                                            Dashboard
                                        </button>
                                        <button onClick={handleLogout}
                                            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => go("/login")}
                                            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-[#FF9933] border-2 border-[#FF9933] hover:bg-[#FF9933] hover:text-white transition-all">
                                            Login
                                        </button>
                                        <button onClick={() => go("/register")}
                                            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#FF9933] hover:bg-[#e6891c] transition-colors">
                                            Register
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>
            </div>
        </>
    );
};

export default React.memo(Header);