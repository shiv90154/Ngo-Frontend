// app/services/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight, GraduationCap, Wallet, HeartPulse,
  Newspaper, Sprout, MonitorSmartphone, User, LogOut,
  ChevronRight, Shield, Globe, Award, TrendingUp,
  BadgeCheck, Clock, X, Loader2, ExternalLink
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import { subscriptionAPI } from '@/lib/api';   // 🆕 subscription API

const services = [
  {
    title: "Education",
    desc: "Courses, live classes & certificates.",
    route: "education",
    features: ["Live Classes", "Tests", "Certs"],
    icon: GraduationCap,
    accent: "#7c3aed",
    tag: "Learning",
    light: "#ede9fe"
  },
  {
    title: "Finance",
    desc: "Wallet, loans, bill payments & banking.",
    route: "finance",
    features: ["Wallet", "Loans", "Bill Pay"],
    icon: Wallet,
    accent: "#0369a1",
    tag: "Banking",
    light: "#e0f2fe"
  },
  {
    title: "Healthcare",
    desc: "Doctors, records & medicines online.",
    route: "healthcare",
    features: ["Consult", "Records", "Meds"],
    icon: HeartPulse,
    accent: "#be123c",
    tag: "Wellness",
    light: "#ffe4e6"
  },
  {
    title: "News",
    desc: "Live local news & community stories.",
    route: "news",
    features: ["Live Feed", "Videos", "Local"],
    icon: Newspaper,
    accent: "#b45309",
    tag: "Media",
    light: "#ffedd5"
  },
  {
    title: "Agriculture",
    desc: "AI crop tips & smart market prices.",
    route: "agriculture",
    features: ["Crop Tips", "Market", "AI Help"],
    icon: Sprout,
    accent: "#15803d",
    tag: "Farming",
    light: "#dcfce7"
  },
  {
    title: "IT Services",
    desc: "Billing, projects & CRM tools.",
    route: "it",
    features: ["Billing", "Projects", "CRM"],
    icon: MonitorSmartphone,
    accent: "#0f766e",
    tag: "Tech",
    light: "#ccfbf1"
  },
];

export default function Services() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Subscription modal state
  const [showSubModal, setShowSubModal] = useState(false);
  const [subData, setSubData] = useState<any>(null);
  const [subLoading, setSubLoading] = useState(false);

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

  // Fetch subscription data when modal opens
  const openSubscriptionModal = async () => {
    setShowSubModal(true);
    setSubLoading(true);
    try {
      const res = await subscriptionAPI.mySubscription();
      setSubData(res.data);
    } catch (error) {
      setSubData(null);
    } finally {
      setSubLoading(false);
    }
  };

  if (!isClient || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f0f2f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a237e] mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading services...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const activeSub = subData?.activeSubscription;

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-4 px-3 py-4">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#1a237e] font-serif leading-tight">Samraddh Bharat</h1>
              <p className="text-xs text-gray-400 hidden sm:block">डिजिटल इंडिया · Unified Service Portal</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationBell />

              {/* 🆕 Subscription Button */}
              <button
                onClick={openSubscriptionModal}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <BadgeCheck size={16} /> My Plan
              </button>

              {/* MLM Earnings Button */}
              <button
                onClick={() => router.push('/services/mlm')}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <TrendingUp size={16} /> My Earnings
              </button>

              <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
                <Shield size={14} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">{user.fullName || user.email}</span>
                {user.role && (
                  <span className="text-xs bg-[#1a237e] text-white px-2 py-0.5 rounded-full">
                    {user.role.replace('_', ' ')}
                  </span>
                )}
              </div>
              <button
                onClick={() => router.push('/profile/view')}
                className="flex items-center gap-2 bg-[#1a237e]/10 hover:bg-[#1a237e]/20 text-[#1a237e] px-4 py-2 rounded-lg transition text-sm font-medium border border-[#1a237e]/30"
              >
                <User size={14} /> My Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition text-sm font-medium border border-red-200"
              >
                <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  className={`rounded-xl shadow-md border transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-xl hover:-translate-y-1 ${
                    isHovered ? 'border-transparent' : 'border-gray-100'
                  }`}
                  style={{ background: service.light }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => router.push(`/${service.route}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/${service.route}`)}
                >
                  <div className="h-1 w-full" style={{ background: service.accent }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${service.accent}20` }}>
                        <Icon size={24} style={{ color: service.accent, strokeWidth: 1.8 }} />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${service.accent}18`, color: service.accent }}>{service.tag}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: service.accent }}>{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.features.map((feature, fIdx) => (
                        <span key={fIdx} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${service.accent}15`, color: service.accent }}>{feature}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: `${service.accent}20` }}>
                      <span className="text-xs text-gray-400">Click to access</span>
                      <div className="flex items-center gap-1 transition" style={{ color: service.accent }}>
                        <span className="text-xs font-medium">Explore</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========== Subscription Modal ========== */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BadgeCheck className="text-indigo-600 w-6 h-6" /> My Subscription
              </h2>
              <button onClick={() => setShowSubModal(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-800" />
              </button>
            </div>

            {subLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
              </div>
            ) : !activeSub || activeSub.plan === 'NONE' ? (
              <div className="text-center py-6">
                <BadgeCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">You don't have an active subscription.</p>
                <button
                  onClick={() => { setShowSubModal(false); router.push('/services/subscription'); }}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition"
                >
                  View Plans
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-sm text-indigo-800 font-medium">Active Plan</p>
                  <p className="text-2xl font-extrabold text-indigo-900">{activeSub.plan}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-indigo-700">
                    <Clock size={16} />
                    <span>Expires {new Date(activeSub.expiresAt).toLocaleDateString()}</span>
                  </div>
                  {activeSub.autoRenew ? (
                    <p className="text-xs text-green-600 mt-1">Auto‑renew is ON</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Auto‑renew is off</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowSubModal(false); router.push('/services/subscription/my'); }}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => { setShowSubModal(false); router.push('/services/subscription'); }}
                    className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-50 transition flex items-center justify-center gap-1"
                  >
                    Upgrade <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}