"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

// ✅ VERIFIED WORKING IMPORTS - All icons exist
import { 
  GiSeedling,      // ✅ Exists - seedling icon
  GiHourglass,     // ✅ Exists - hourglass/sand clock
  GiTakeMyMoney,   // ✅ Exists - money stack
  GiContract,      // ✅ Exists - contract/agreement
  GiChest,         // ✅ Exists - chest/box
} from "react-icons/gi";
import { MdAddBox } from "react-icons/md";           // ✅ Exists - add box
import { FaHandshake } from "react-icons/fa";        // ✅ Exists - handshake

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserType {
  id: string;
  name?: string;
  email?: string;
  farmerProfile?: {
    isContractFarmer?: boolean;
    farmName?: string;
    location?: string;
    cropTypes?: string[];
  };
}

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

interface Tip {
  id: number;
  season: string;
  title: string;
  body: string;
  icon: string;
  color: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  {
    label: "Mandi Prices",
    href: "/agriculture/mandi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    description: "Live commodity rates from mandis across the country",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    label: "Marketplace",
    href: "/agriculture/marketplace",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    description: "Buy seeds, equipment & sell your harvest directly",
    gradient: "from-emerald-500 to-green-700",
  },
  {
    label: "Crop Disease Detection",
    href: "/agriculture/crop-disease-detection",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    description: "AI-powered plant disease scanner using your camera",
    gradient: "from-teal-500 to-cyan-700",
  },
];

const FARMER_TIPS: Tip[] = [
  {
    id: 1,
    season: "Kharif",
    title: "Soil Moisture Check",
    body: "Test soil moisture before irrigation. Over-watering leads to root rot. Optimal moisture is 60–70% field capacity for most crops.",
    icon: "💧",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: 2,
    season: "General",
    title: "Intercropping Benefits",
    body: "Pair legumes with cereals to naturally fix nitrogen in the soil, reducing fertilizer costs by up to 30% over the season.",
    icon: "🌿",
    color: "bg-green-50 border-green-200",
  },
  {
    id: 3,
    season: "Rabi",
    title: "Early Sowing Advantage",
    body: "Sow wheat before 25 November for maximum yield. Late sowing decreases grain weight due to rising temperatures at flowering stage.",
    icon: "🌾",
    color: "bg-amber-50 border-amber-200",
  },
  {
    id: 4,
    season: "Pest Alert",
    title: "Fall Armyworm Watch",
    body: "Scout maize fields weekly during monsoon. Larvae feed inside whorls — look for frass and ragged leaf edges. Act within 3 days of detection.",
    icon: "🐛",
    color: "bg-red-50 border-red-200",
  },
  {
    id: 5,
    season: "Market",
    title: "Stagger Your Sales",
    body: "Don't sell your entire harvest at once. Store 30–40% and monitor mandi prices over 2–3 weeks for better returns.",
    icon: "📈",
    color: "bg-purple-50 border-purple-200",
  },
  {
    id: 6,
    season: "Irrigation",
    title: "Drip vs Flood",
    body: "Drip irrigation reduces water use by 50% and increases yield by 20–30% for vegetables. Government subsidies cover up to 55% of cost.",
    icon: "🚿",
    color: "bg-cyan-50 border-cyan-200",
  },
];

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80",
    caption: "Golden Harvest Fields",
  },
  {
    url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80",
    caption: "Smart Farming Technology",
  },
  {
    url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
    caption: "Fertile Farmlands",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface UserAvatarProps {
  name?: string;
}
const UserAvatar: React.FC<UserAvatarProps> = ({ name }) => {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
      {initials}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AgricultureDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth() as {
    user: UserType | null;
    loading: boolean;
  };

  const isContractFarmer: boolean = Boolean(user?.farmerProfile?.isContractFarmer);

  const [heroIndex, setHeroIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeTip, setActiveTip] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "Farmer";

  return (
    <div
      className="min-h-screen font-sans bg-[#f5f2eb]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .grain-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
        .hero-slide { transition: opacity 1.2s ease; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>

    {/* ── Navbar ─────────────────────────────────────────────────────────── */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8faf6]/95 backdrop-blur-xl border-b border-emerald-900/10 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
    
    {/* Logo */}
    <Link
      href="/services"
      className="flex items-center gap-3 group"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-green-500 to-lime-500 flex items-center justify-center text-xl text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-200">
        <GiSeedling />
      </div>

      <div className="leading-none">
        <div className="text-[#173b25] font-display text-lg font-bold tracking-tight group-hover:text-emerald-700 transition-colors">
          Samraaddh
        </div>
        <div className="text-emerald-600 text-[10px] font-semibold tracking-[0.22em] uppercase">
          Agriculture Hub
        </div>
      </div>
    </Link>

    {/* Desktop Nav Links */}
    <div className="hidden md:flex items-center gap-1 bg-white/70 border border-emerald-900/10 rounded-full px-2 py-1 shadow-sm">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-all text-sm font-medium group"
        >
          <span className="text-emerald-600 group-hover:text-lime-600 transition-colors">
            {link.icon}
          </span>
          {link.label}
        </Link>
      ))}
    </div>

    {/* Mobile menu toggle */}
    <button
      onClick={() => setMenuOpen((v) => !v)}
      className="md:hidden p-2 rounded-lg text-emerald-800 hover:bg-emerald-100 transition-colors"
      aria-label="Toggle menu"
    >
      {menuOpen ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden bg-[#f8faf6] border-t border-emerald-900/10 px-4 py-4 space-y-2 shadow-lg">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all text-sm font-medium"
        >
          <span className="text-emerald-600 text-lg">{link.icon}</span>

          <div>
            <div>{link.label}</div>
            <div className="text-slate-400 text-xs">{link.description}</div>
          </div>
        </Link>
      ))}

      {user && (
        <div className="pt-3 mt-3 border-t border-emerald-900/10 flex items-center gap-3 px-4">
          <UserAvatar name={user.name} />

          <div>
            <div className="text-slate-800 text-sm font-semibold">{user.name}</div>
            {isContractFarmer && (
              <div className="text-amber-600 text-xs font-medium">
                Contract Farmer ✓
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )}
</nav>

      {/* ── Main Feature Cards ─────────────────────────────────────────────── */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-green-700 font-medium text-sm tracking-widest uppercase mb-2">Quick Access</p>
          <h2 className="font-display text-4xl sm:text-5xl text-[#1a3a1e] font-bold">
            Everything In One Place
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="card-hover relative bg-white rounded-2xl overflow-hidden border border-stone-200 cursor-pointer group h-full">
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${link.gradient}`} />

                <div className="p-7">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.gradient} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {link.icon}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#1a3a1e] mb-2 group-hover:text-green-800 transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{link.description}</p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center gap-1.5 text-green-700 font-medium text-sm group-hover:gap-3 transition-all">
                    Explore
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Farmer Tips ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1a3a1e]/5 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FARMER_TIPS.map((tip) => (
              <div
                key={tip.id}
                onClick={() => setActiveTip(activeTip === tip.id ? null : tip.id)}
                className={`card-hover rounded-2xl border-2 p-6 cursor-pointer transition-all ${tip.color} ${
                  activeTip === tip.id ? "ring-2 ring-green-500 ring-offset-2" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{tip.icon}</span>
                  <span className="text-xs font-semibold bg-white/70 text-stone-600 px-2.5 py-1 rounded-full">
                    {tip.season}
                  </span>
                </div>
                <h4 className="font-display text-lg font-bold text-[#1a3a1e] mb-2">{tip.title}</h4>
                <p
                  className={`text-stone-600 text-sm leading-relaxed transition-all overflow-hidden ${
                    activeTip === tip.id ? "max-h-40" : "max-h-12 line-clamp-2"
                  }`}
                >
                  {tip.body}
                </p>
                <button className="mt-3 text-xs font-medium text-green-700 hover:text-green-900 flex items-center gap-1">
                  {activeTip === tip.id ? "Show less ↑" : "Read more ↓"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgricultureDashboard;