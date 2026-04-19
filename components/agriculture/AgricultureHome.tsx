"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import {
  Sprout, Package, ShoppingCart, Loader2, ArrowRight,
  Bell, Leaf, Store, ShieldCheck, ScanSearch, Brain,
  TrendingUp, MapPin, RefreshCw, ChevronRight,
  Wheat, IndianRupee, AlertCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  modal_price: string;
  min_price: string;
  max_price: string;
  arrival_date: string;
}

// ── Mandi API (data.gov.in public dataset) ────────────────────────
// Replace YOUR_API_KEY with your data.gov.in API key
const MANDI_API =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=YOUR_API_KEY&format=json&limit=6";

// ── Quick action cards ────────────────────────────────────────────
const quickActions = [
  {
    title: "My Crops",
    subtitle: "Add & manage crop records",
    icon: Leaf,
    path: "/agriculture/crops",
    features: ["Sowing dates", "Area tracking", "Harvest logs"],
    accent: "#15803d",
    light: "#f0fdf4",
  },
  {
    title: "Marketplace",
    subtitle: "Buy, sell & trade produce",
    icon: Store,
    path: "/agriculture/marketplace",
    features: ["List produce", "Find buyers", "Price negotiation"],
    accent: "#0369a1",
    light: "#e0f2fe",
  },
  {
    title: "Mandi Prices",
    subtitle: "Live APMC market rates",
    icon: TrendingUp,
    path: "/agriculture/mandi",
    features: ["State-wise rates", "Price trends", "Best market finder"],
    accent: "#b45309",
    light: "#fffbeb",
  },
];

// ─────────────────────────────────────────────────────────────────
export default function AgricultureHome() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState < any > (null);
  const [dashLoading, setDashLoading] = useState(true);

  const [mandiPrices, setMandiPrices] = useState < MandiRecord[] > ([]);
  const [mandiLoading, setMandiLoading] = useState(true);
  const [mandiError, setMandiError] = useState(false);
  const [mandiQuery, setMandiQuery] = useState("Wheat");

  // ── Auth guard ──────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    else if (user) fetchDashboard();
  }, [user, authLoading]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/agriculture/dashboard");
      setDashboardData(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setDashLoading(false);
    }
  };

  // ── Mandi price fetch ───────────────────────────────────────────
  const fetchMandi = useCallback(async (commodity: string) => {
    setMandiLoading(true);
    setMandiError(false);
    try {
      const url = `${MANDI_API}&filters[commodity]=${encodeURIComponent(commodity)}`;
      const res = await fetch(url);
      const json = await res.json();
      setMandiPrices(json.records || []);
    } catch {
      setMandiError(true);
    } finally {
      setMandiLoading(false);
    }
  }, []);

  useEffect(() => { fetchMandi(mandiQuery); }, [mandiQuery]);

  // ── Loading screen ──────────────────────────────────────────────
  if (authLoading || dashLoading) return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-10 py-8 flex flex-col items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-[#1a237e]" />
        <p className="text-sm text-gray-500 font-medium">Loading Agriculture Hub...</p>
      </div>
    </div>
  );

  if (!user) return null;

  const recentCrops = dashboardData?.recentCrops || [];
  const recentOrders = dashboardData?.recentOrders || [];
  const isContractFarmer = Boolean(user?.farmerProfile?.isContractFarmer);

  const COMMODITIES = ["Wheat", "Rice", "Maize", "Tomato", "Onion", "Potato", "Cotton", "Soybean"];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">

      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#138808] flex items-center justify-center flex-shrink-0">
                <Sprout className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Agriculture Hub</h1>
                <p className="text-xs text-gray-400">
                  Welcome, <span className="font-semibold text-[#138808]">{user?.name || "Farmer"}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isContractFarmer && (
                <button
                  onClick={() => router.push("/agriculture/seller/dashboard")}
                  className="flex items-center gap-1.5 bg-[#138808] hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  <ShieldCheck size={14} /> Seller Panel
                </button>
              )}
              <button className="border border-gray-200 bg-white hover:bg-gray-50 p-2 rounded-lg text-gray-500 transition">
                <Bell size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* ── Navy welcome banner ─────────────────────────────────── */}
        <div className="bg-[#1a237e] rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-xs mb-1">Samraddh Bharat · Agriculture Module</p>
            <h2 className="text-white text-xl font-bold leading-snug">
              Manage crops, trade produce &amp; get AI-powered insights
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              Access mandi prices, disease detection and marketplace from one dashboard.
            </p>
          </div>
          <button
            onClick={() => router.push("/agriculture/crop-disease-detection")}
            className="flex items-center gap-2 bg-white text-[#1a237e] font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition flex-shrink-0"
          >
            <ScanSearch size={16} /> AI Disease Detection
          </button>
        </div>

        {/* ── Quick Actions ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={() => router.push(action.path)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="h-1 w-full" style={{ background: action.accent }} />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: action.light }}>
                      <Icon size={18} style={{ color: action.accent }} />
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mb-0.5">{action.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{action.subtitle}</p>
                  <div className="space-y-1">
                    {action.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: action.accent }} />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Live Mandi Prices ───────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <IndianRupee size={17} className="text-[#b45309]" />
              <h2 className="text-base font-bold text-gray-800">Live Mandi Prices</h2>
              <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">APMC</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Commodity selector */}
              <div className="flex gap-1.5 flex-wrap">
                {COMMODITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setMandiQuery(c)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition border ${mandiQuery === c
                        ? "bg-[#1a237e] text-white border-[#1a237e]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={() => fetchMandi(mandiQuery)}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition"
                title="Refresh"
              >
                <RefreshCw size={14} className={mandiLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {mandiLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Fetching mandi rates...</span>
            </div>
          ) : mandiError ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
              <AlertCircle size={20} />
              <p className="text-sm">Could not fetch mandi prices. Check your API key.</p>
              <button onClick={() => fetchMandi(mandiQuery)} className="text-xs text-[#1a237e] underline mt-1">Retry</button>
            </div>
          ) : mandiPrices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
              <Wheat size={20} />
              <p className="text-sm">No records found for {mandiQuery}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">Market</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">District</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">State</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">Variety</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-4 py-2.5">Min ₹</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-4 py-2.5">Modal ₹</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-4 py-2.5">Max ₹</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiPrices.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{row.market}</td>
                      <td className="px-4 py-2.5 text-gray-500">{row.district}</td>
                      <td className="px-4 py-2.5 text-gray-500">{row.state}</td>
                      <td className="px-4 py-2.5 text-gray-500">{row.variety || "—"}</td>
                      <td className="px-4 py-2.5 text-right text-gray-600">
                        {Number(row.min_price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-[#138808]">
                        {Number(row.modal_price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-600">
                        {Number(row.max_price).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={11} /> Source: data.gov.in · AGMARKNET · Prices per quintal (₹)
            </p>
            <button
              onClick={() => router.push("/agriculture/mandi")}
              className="text-xs text-[#1a237e] font-medium hover:underline flex items-center gap-1"
            >
              Full mandi view <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* ── AI Disease Detection card ───────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-[#1a237e]" />
          <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Brain size={22} className="text-[#1a237e]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-gray-800">AI Crop Disease Detection</h3>
                <span className="text-xs bg-[#1a237e]/10 text-[#1a237e] font-medium px-2 py-0.5 rounded-full">Beta</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Upload a photo of your crop and our AI model will identify possible diseases, pests, or deficiencies —
                and suggest treatment within seconds. Supports paddy, wheat, tomato, maize and more.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Photo upload", "Disease identification", "Treatment tips", "Multi-crop support"].map((f) => (
                  <span key={f} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => router.push("/agriculture/crop-disease-detection")}
              className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium px-5 py-2.5 rounded-lg text-sm transition shadow-sm flex-shrink-0"
            >
              <ScanSearch size={16} /> Open Detection
            </button>
          </div>
        </div>

        {/* ── Recent Crops + Orders ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Crops */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <Sprout size={16} className="text-[#138808]" /> Recent Crops
              </h2>
              <button
                onClick={() => router.push("/agriculture/crops")}
                className="text-xs text-[#1a237e] font-medium hover:underline flex items-center gap-1"
              >
                View All <ChevronRight size={12} />
              </button>
            </div>
            <div className="p-4">
              {recentCrops.length === 0 ? (
                <div className="flex h-28 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 gap-2">
                  <Sprout size={20} className="text-gray-300" />
                  <p className="text-xs text-gray-400">No crops added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentCrops.slice(0, 3).map((crop: any, idx: number) => (
                    <div key={crop._id || idx} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 hover:border-green-200 hover:bg-green-50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Sprout size={14} className="text-[#138808]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{crop.cropName}</p>
                          <p className="text-xs text-gray-400">{crop.areaCultivated} Acres</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{crop.sowingDate?.split("T")[0] || "N/A"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <ShoppingCart size={16} className="text-[#0369a1]" /> Recent Orders
              </h2>
              <button
                onClick={() => router.push("/agriculture/marketplace/orders")}
                className="text-xs text-[#1a237e] font-medium hover:underline flex items-center gap-1"
              >
                Manage <ChevronRight size={12} />
              </button>
            </div>
            <div className="p-4">
              {recentOrders.length === 0 ? (
                <div className="flex h-28 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 gap-2">
                  <Package size={20} className="text-gray-300" />
                  <p className="text-xs text-gray-400">No orders received</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentOrders.slice(0, 3).map((order: any, idx: number) => (
                    <div key={order._id || idx} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 hover:border-blue-200 hover:bg-blue-50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Package size={14} className="text-[#0369a1]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">Order #{order.orderId?.slice(-6) || "N/A"}</p>
                          <p className="text-xs text-gray-400">{order.status || "Pending"}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-800 ml-2 flex-shrink-0">
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}