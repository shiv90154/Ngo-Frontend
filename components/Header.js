'use client';
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastConfig = {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    icon: "🚀",
    style: {
        borderRadius: "12px",
        fontWeight: "500",
        padding: "12px 16px",
    },
    progressStyle: {
        background: "#fff",
    },
};

const NAV_ITEMS = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
];

const NavLink = React.memo(({ path, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium ${isActive ? "text-blue-600 font-semibold" : ""
            }`}
        aria-current={isActive ? "page" : undefined}
    >
        {label}
    </button>
));
NavLink.displayName = "NavLink";

const Header = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth() || {};

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isAuthenticated = useMemo(() => user !== null && user !== undefined, [user]);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => setScrolled(window.scrollY > 20));
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

    const handleNav = useCallback((path) => {
        router.push(path);
        closeMobileMenu();
    }, [router, closeMobileMenu]);

    const handleLogout = useCallback(() => {
        logout?.();
        toast.success("Logged out successfully 👋", toastConfig);
        router.push("/");
        closeMobileMenu();
    }, [logout, router, closeMobileMenu]);

    const handleLogin = useCallback(() => {
        router.push("/login");
        closeMobileMenu();
    }, [router, closeMobileMenu]);

    const handleRegister = useCallback(() => {
        router.push("/register");
        closeMobileMenu();
    }, [router, closeMobileMenu]);

    const handleDashboard = useCallback(() => {
        router.push("/services");
        closeMobileMenu();
    }, [router, closeMobileMenu]);

    const isActive = useCallback((path) => pathname === path, [pathname]);

    // Inject animation styles once
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (document.querySelector("#header-animation-style")) return;
        const style = document.createElement("style");
        style.id = "header-animation-style";
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-8px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            .animate-slideDown { animation: slideDown 0.22s ease-out; }

            @keyframes fadeInOverlay {
                from { opacity: 0; }
                to   { opacity: 1; }
            }
            .animate-fadeInOverlay { animation: fadeInOverlay 0.22s ease-out; }
        `;
        document.head.appendChild(style);
    }, []);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white ${scrolled ? "shadow-md" : "border-b border-gray-100"
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

                    {/* ── Logo ── */}
                    <button
                        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                        onClick={() => handleNav("/")}
                        aria-label="Go to Home"
                    >
                        <img
                            src="/logo.jpg"
                            alt="Samraddh Bharat Foundation Logo"
                            className="w-9 h-9 rounded-md object-cover"
                        />
                        <span className="text-base sm:text-lg font-bold text-gray-800 leading-tight">
                            SAMRADDH BHARAT
                        </span>
                    </button>

                    {/* ── Desktop Nav + Auth ── */}
                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.path}
                                path={item.path}
                                label={item.label}
                                isActive={isActive(item.path)}
                                onClick={() => handleNav(item.path)}
                            />
                        ))}

                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={handleDashboard}
                                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        aria-label="Dashboard"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:ring-2 focus:ring-red-400 focus:outline-none"
                                        aria-label="Logout"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleLogin}
                                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        aria-label="Login"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={handleRegister}
                                        className="border-2 border-blue-600 text-blue-600 text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        aria-label="Register"
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* ── Hamburger Toggle ── */}
                    <button
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {/* Animated hamburger icon */}
                        <span
                            className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-200 mt-1 ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""
                                }`}
                        />
                        <span
                            className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 mt-1 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </button>
                </div>

                {/* ── Mobile Menu Dropdown ── */}
                {mobileMenuOpen && (
                    <div
                        id="mobile-menu"
                        className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slideDown"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-1">

                            {/* Nav links */}
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNav(item.path)}
                                    className={`text-left w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive(item.path)
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            {/* Divider */}
                            <div className="my-2 border-t border-gray-100" />

                            {/* Auth buttons — always inside hamburger on mobile */}
                            {isAuthenticated ? (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={handleDashboard}
                                        className="w-full bg-green-600 text-white text-sm py-2.5 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-medium"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-500 text-white text-sm py-2.5 px-3 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:ring-2 focus:ring-red-400 focus:outline-none font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={handleLogin}
                                        className="w-full bg-blue-600 text-white text-sm py-2.5 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={handleRegister}
                                        className="w-full border-2 border-blue-600 text-blue-600 text-sm py-2.5 px-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default React.memo(Header);