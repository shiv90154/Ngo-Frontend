"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight, GraduationCap, Wallet, HeartPulse,
  Newspaper, Sprout, MonitorSmartphone, User, LogOut
} from 'lucide-react';

const services = [
  {
    title: "Education",
    desc: "Courses, live classes & certificates.",
    route: "education",
    features: ["Live Classes", "Tests", "Certs"],
    icon: GraduationCap,
    accent: "#7c3aed",
    light: "#f3f0ff",
    tag: "Learning"
  },
  {
    title: "Finance",
    desc: "Wallet, transfers & micro-loans.",
    route: "finance",
    features: ["Wallet", "Transfer", "Loans"],
    icon: Wallet,
    accent: "#0369a1",
    light: "#e0f2fe",
    tag: "Banking"
  },
  {
    title: "Healthcare",
    desc: "Doctors, records & medicines online.",
    route: "healthcare",
    features: ["Consult", "Records", "Meds"],
    icon: HeartPulse,
    accent: "#be123c",
    light: "#fff1f2",
    tag: "Wellness"
  },
  {
    title: "News",
    desc: "Live local news & community stories.",
    route: "news",
    features: ["Live Feed", "Videos", "Local"],
    icon: Newspaper,
    accent: "#b45309",
    light: "#fffbeb",
    tag: "Media"
  },
  {
    title: "Agriculture",
    desc: "AI crop tips & smart market prices.",
    route: "agriculture",
    features: ["Crop Tips", "Market", "AI Help"],
    icon: Sprout,
    accent: "#15803d",
    light: "#f0fdf4",
    tag: "Farming"
  },
  {
    title: "IT Services",
    desc: "Billing, projects & CRM tools.",
    route: "it",
    features: ["Billing", "Projects", "CRM"],
    icon: MonitorSmartphone,
    accent: "#0f766e",
    light: "#f0fdfa",
    tag: "Tech"
  },
];

export default function Services() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (loading) return;
    const token = localStorage.getItem("token");
    if (!token || !user) {
      router.replace("/login");
    }
  }, [isClient, loading, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!isClient || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF9933] mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading services...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      {/* Tricolor Header */}
      <div className="flex">
        <div className="h-1 w-1/3 bg-[#FF9933]"></div>
        <div className="h-1 w-1/3 bg-white"></div>
        <div className="h-1 w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Bar with Emblem and User Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200">
              <div className="w-10 h-10 rounded-full border-2 border-[#FF9933] flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#138808]"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Samraddh Bharat Services</h1>
              <p className="text-xs text-gray-500">Digital India – Unified Service Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/80 rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
              <User size={14} className="text-[#FF9933]" />
              <span className="text-sm font-medium text-gray-700">{user.fullName || user.email}</span>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 bg-[#FF9933]/10 hover:bg-[#FF9933]/20 text-[#FF9933] px-3 py-1.5 rounded-full transition text-sm font-medium border border-[#FF9933]/30"
            >
              <User size={14} /> My Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-full transition text-sm font-medium"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center">
              <User size={18} className="text-[#FF9933]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Welcome back, {user.fullName?.split(' ')[0] || 'User'}!</h2>
              <p className="text-sm text-gray-500">Choose a service below to continue</p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-md border transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-lg hover:-translate-y-1 ${
                  isHovered ? 'border-[#FF9933]/50' : 'border-gray-100'
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => router.push(`/${service.route}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/${service.route}`)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200"
                      style={{ background: service.light }}
                    >
                      <Icon size={24} style={{ color: service.accent, strokeWidth: 1.8 }} />
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: `${service.accent}0c`, color: service.accent }}
                    >
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{service.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{service.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature, fIdx) => (
                      <span key={fIdx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Click to explore</span>
                    <ArrowRight size={16} className="text-[#FF9933] group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
          <p>© Samraddh Bharat Foundation | Digital India Initiative | Secure & Encrypted</p>
        </div>
      </div>
    </div>
  );
}