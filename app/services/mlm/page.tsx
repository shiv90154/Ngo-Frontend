"use client";

import { useEffect, useState } from "react";
import { mlmAPI } from "@/lib/api";
import {
  Loader2,
  TrendingUp,
  Wallet,
  Gift,
  Share2,
  ArrowRight,
  Users,
  Zap,
  BadgePercent,
} from "lucide-react";
import Link from "next/link";

export default function MLMDashboard() {
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mlmAPI
      .getMyEarnings()
      .then((res) => setEarnings(res.data.earnings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#f9fafb]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-amber-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-8 sm:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Your MLM Earnings
              </h1>
              <p className="mt-3 text-amber-100 text-lg sm:text-xl max-w-xl">
                Earn passive income by referring people and watching them succeed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-white text-amber-700 px-6 py-3 rounded-full font-bold shadow-md hover:bg-amber-50 transition"
                >
                  <Share2 size={18} />
                  Share Referral
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 bg-amber-800 bg-opacity-40 text-white backdrop-blur-sm px-6 py-3 rounded-full font-bold hover:bg-amber-800 transition"
                >
                  Explore Services
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                <TrendingUp className="w-12 h-12 sm:w-14 sm:h-14 text-amber-100" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Earnings Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="text-amber-600" size={22} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Earned
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              ₹{earnings?.totalCommissionEarned?.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="text-orange-600" size={22} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Pending Payout
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              ₹{earnings?.pendingCommission?.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Gift className="text-green-600" size={22} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Withdrawn
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">
              ₹{earnings?.totalWithdrawn?.toLocaleString() ?? 0}
            </p>
          </div>
        </div>

        {/* ── How to Earn Section ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Zap className="text-amber-500" size={22} />
              How You Earn Money
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Users className="text-amber-600" size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Refer Friends</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Share your unique referral link. When someone joins using your link, they
                become part of your network forever.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BadgePercent className="text-blue-600" size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Earn Commissions</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Every time someone in your downline enrolls in a paid course, tops up their
                wallet, or buys a product, you earn a commission.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Multiple Levels</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                You earn up to 5 levels deep: 10% from direct referrals, 5% from their
                referrals, and so on. Your income grows exponentially.
              </p>
            </div>
          </div>
        </div>

        {/* ── Recent Commissions ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              📜 Recent Commissions
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {earnings?.recentCommissions?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="font-medium">No commissions earned yet.</p>
                <p className="text-sm mt-1">Start referring to earn!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {earnings?.recentCommissions?.map((c: any) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-amber-50/50 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">
                        {c.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Level {c.level} · {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-green-600">+₹{c.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer Spacing ── */}
        <div className="pb-6" />
      </div>
    </div>
  );
}