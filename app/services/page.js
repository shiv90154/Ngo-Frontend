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
    if (isClient && !loading && !user) {
      router.replace('/login');
    }
  }, [isClient, loading, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-3 sm:pt-4 px-4 sm:px-6 lg:px-8 pb-2 border-b border-black/10 bg-white/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[1.25rem] sm:text-[1.4rem] lg:text-[1.6rem] font-extrabold bg-gradient-to-br from-[#0f172a] to-[#334155] bg-clip-text text-transparent tracking-[-0.02em] leading-tight">
              Samraddh Bharat Services
            </h1>
            <p className="text-[0.6rem] sm:text-[0.7rem] lg:text-xs text-[#5b6e8c] mt-0.5 font-medium">
              Smart digital services • Unified platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 px-3 py-1.5 rounded-full shadow-sm transition"
            >
              <User size={16} className="text-blue-600" />
              <span className="hidden sm:inline text-sm font-medium">My Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-full transition text-sm font-medium"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Animated Grid */}
      <style jsx>{`
        @keyframes cardFadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-card {
          opacity: 0;
          animation: cardFadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .services-grid .animate-card:nth-child(1) { animation-delay: 0.08s; }
        .services-grid .animate-card:nth-child(2) { animation-delay: 0.14s; }
        .services-grid .animate-card:nth-child(3) { animation-delay: 0.20s; }
        .services-grid .animate-card:nth-child(4) { animation-delay: 0.26s; }
        .services-grid .animate-card:nth-child(5) { animation-delay: 0.32s; }
        .services-grid .animate-card:nth-child(6) { animation-delay: 0.38s; }
      `}</style>

      <div className="services-grid flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2.5 lg:gap-4 px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 lg:py-3 items-stretch content-center">
        {services.map((service, idx) => {
          const Icon = service.icon;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={idx}
              className={`animate-card bg-white/90 backdrop-blur-[2px] rounded-xl sm:rounded-2xl lg:rounded-3xl 
                p-2.5 sm:p-3 lg:p-4 cursor-pointer border border-white/60
                transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.9,0.4,1.1)]
                flex flex-col relative overflow-hidden
                hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:bg-white hover:border-black/8 hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.1)]
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
              style={{
                borderColor: isHovered ? `${service.accent}30` : 'rgba(255,255,255,0.6)'
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => router.push(`/${service.route}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && router.push(`/${service.route}`)}
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-1.5 sm:mb-2 lg:mb-3 transition-transform duration-200"
                style={{
                  background: service.light,
                  boxShadow: isHovered ? `0 4px 8px ${service.accent}20` : 'none'
                }}
              >
                <Icon size={18} className="sm:w-5 sm:h-5 lg:w-5 lg:h-5" style={{ color: service.accent, strokeWidth: 1.8 }} />
              </div>
              <h3 className="text-[0.9rem] sm:text-[1rem] lg:text-[1.1rem] font-bold text-[#0f172a] mb-0.5 tracking-[-0.3px]">
                {service.title}
              </h3>
              <p className="text-[0.6rem] sm:text-[0.65rem] lg:text-[0.75rem] text-[#5b6e8c] leading-[1.3] mb-1.5 sm:mb-2">
                {service.desc}
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                {service.features.map((feature, fIdx) => (
                  <span key={fIdx}
                    className="text-[0.55rem] sm:text-[0.6rem] lg:text-[0.65rem] font-semibold 
                      px-1.5 sm:px-2 py-0.5 rounded-[20px] bg-black/4 text-[#334155] transition-all duration-200 group-hover:bg-black/8">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span
                  className="text-[0.5rem] sm:text-[0.55rem] lg:text-[0.6rem] font-bold tracking-[0.3px] uppercase py-0.5 px-1.5 sm:px-2 rounded-[20px] backdrop-blur-[2px]"
                  style={{
                    background: `${service.accent}0c`,
                    color: service.accent,
                    border: `0.5px solid ${service.accent}15`
                  }}
                >
                  {service.tag}
                </span>
                <div
                  className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center transition-all duration-200 ease-[cubic-bezier(0.34,1.2,0.64,1)] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5"
                  style={{
                    background: service.accent,
                    transform: isHovered ? 'scale(1.02)' : 'scale(0.98)'
                  }}
                >
                  <ArrowRight size={10} className="sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3" color="white" strokeWidth={2.5} />
                </div>
              </div>
              <div
                className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl lg:rounded-3xl transition-opacity duration-[250ms]"
                style={{
                  background: `radial-gradient(circle at 20% 0%, ${service.accent}08, transparent 80%)`,
                  opacity: isHovered ? 0.5 : 0
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="text-center py-1 sm:py-1.5 lg:py-2 px-2 flex-shrink-0 text-[0.5rem] sm:text-[0.55rem] lg:text-[0.6rem] font-medium text-[#94a3b8] border-t border-black/3 tracking-[0.2px]">
        <span>⚡ Tap any card to explore • Seamless experience</span>
      </div>
    </div>
  );
}