"use client";
import React from "react";
import Link from "next/link";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";

const CURRENT_YEAR = new Date().getFullYear();

const QUICK_LINKS = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Dashboard", path: "/education" },
];

const LEGAL_LINKS = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Refund Policy", path: "/refund" },
    { name: "Disclaimer", path: "/disclaimer" },
    { name: "FAQ", path: "/faq" },
];

const SOCIALS = [
    { icon: <FaFacebookF />, label: "Facebook" },
    { icon: <FaTwitter />, label: "Twitter" },
    { icon: <FaInstagram />, label: "Instagram" },
    { icon: <FaLinkedinIn />, label: "LinkedIn" },
];

// Reusable Link
const FooterLink = ({ href, children }) => (
    <li>
        <Link
            href={href}
            className="group flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-800"
        >
            <span className="text-[#FF9933] transition-transform group-hover:translate-x-1">
                ›
            </span>
            <span className="text-gray-300 group-hover:text-white text-sm">
                {children}
            </span>
        </Link>
    </li>
);
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6 border-t border-gray-800">
            <div className="max-w-6xl mx-auto">

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 bg-[#FF9933] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                SB
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-xl tracking-wide leading-tight">
                                    Samraddh Bharat
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    Digital India Initiative
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 leading-relaxed">
                            Empowering citizens with accessible digital services,
                            transparency, and efficient governance systems across India.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-5">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map((link) => (
                                <FooterLink key={link.path} href={link.path}>
                                    {link.name}
                                </FooterLink>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-5">
                            Legal
                        </h3>
                        <ul className="space-y-2">
                            {LEGAL_LINKS.map((link) => (
                                <FooterLink key={link.path} href={link.path}>
                                    {link.name}
                                </FooterLink>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-5">
                            Contact
                        </h3>

                        <div className="space-y-4 text-sm">

                            <div className="flex items-start gap-3 hover:translate-x-[5px]  transition-all">
                                <a href="tel:18001234567"><FaPhoneAlt className=" mt-1" /><span>1800-123-4567 </span></a>
                            </div>

                            <div className="flex items-start gap-3 hover:translate-x-[5px] transition-all">
                                <a href="mailto:support@samraddhbharat.gov.in"><FaEnvelope className=" mt-1" /><span>  support@samraddhbharat.gov.in </span></a>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className=" mt-1" />
                                <span>New Delhi, India</span>
                            </div>

                        </div>

                        {/* Socials */}
                        <div className="flex gap-3 mt-6">
                            {SOCIALS.map((item, i) => (
                                <button
                                    key={i}
                                    aria-label={item.label}
                                    className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-800 hover:bg-[#c56c14] hover:text-white transition"
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500 text-center">
                    <p>© {CURRENT_YEAR} Samraddh Bharat Foundation</p>
                    <p className="text-gray-400">Built for Digital India</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;