"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import {
  Loader2,
  MapPin,
  IndianRupee,
  RefreshCw,
  ChevronRight,
  Search,
  Filter,
  X,
  AlertCircle,
  Wheat,
  ArrowLeft,
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

interface ApiResponse {
  records?: MandiRecord[];
}

// Predefined lists for dropdowns
const STATES: string[] = [
  "Chhattisgarh",
  "Madhya Pradesh",
  "Maharashtra",
  "Uttar Pradesh",
  "Punjab",
  "Haryana",
  "Rajasthan",
  "Gujarat",
  "Karnataka",
  "Telangana",
  "Andhra Pradesh",
  "Tamil Nadu",
  "West Bengal",
  "Bihar",
  "Odisha",
];

const DISTRICTS: Record<string, string[]> = {
  Chhattisgarh: ["Raipur", "Durg", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
};

const COMMODITIES: string[] = [
  "Wheat",
  "Rice",
  "Maize",
  "Tomato",
  "Onion",
  "Potato",
  "Cotton",
  "Soybean",
  "Arhar",
  "Gram",
  "Mustard",
  "Groundnut",
];

// ─────────────────────────────────────────────────────────────────
export default function MandiPricesPage(): JSX.Element {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Filters
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [market, setMarket] = useState<string>("");
  const [commodity, setCommodity] = useState<string>("Wheat");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data
  const [prices, setPrices] = useState<MandiRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // UI state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>(
    DISTRICTS["Chhattisgarh"] || []
  );

  // ── Auth guard ──────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Update district list when state changes
  useEffect(() => {
    if (state && DISTRICTS[state]) {
      setAvailableDistricts(DISTRICTS[state]);
      // Auto‑select first district if current not in list
      if (!DISTRICTS[state].includes(district)) {
        setDistrict(DISTRICTS[state][0] ?? "");
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [state, district]);

  // ── Fetch Mandi Data ────────────────────────────────────────────
  const fetchMandiData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(false);
    try {
      const params: Record<string, string> = {};
      if (state) params.state = state;
      if (district) params.district = district;
      if (market) params.market = market;
      if (commodity) params.commodity = commodity;

      const response = await api.get<ApiResponse>("/agriculture/mandi", { params });

      if (response.data?.records) {
        setPrices(response.data.records);
      } else {
        setPrices([]);
      }
    } catch (err) {
      console.error("Mandi fetch error:", err);
      setError(true);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, [state, district, market, commodity]);

  // Fetch on mount and when filters change
  useEffect(() => {
    if (user) fetchMandiData();
  }, [fetchMandiData, user]);

  // ── Client‑side filtering by market name ────────────────────────
  const filteredPrices: MandiRecord[] = prices.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.market.toLowerCase().includes(query) ||
      item.district.toLowerCase().includes(query) ||
      item.state.toLowerCase().includes(query)
    );
  });

  // ── Loading / Not Auth ──────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
      </div>
    );
  }
  if (!user) return <></>;

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {/* ── Header (blue theme) ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/agriculture")}
                className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Mandi Price Dashboard
                </h1>
                <p className="text-xs text-blue-200">
                  AGMARKNET · Live APMC Rates
                </p>
              </div>
            </div>
            <button
              onClick={fetchMandiData}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title="Refresh"
              aria-label="Refresh data"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* ── Search & Filter Bar ─────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search market, district or state..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition sm:w-auto"
            >
              <Filter size={16} />
              Filters
              {showFilters ? <X size={16} className="ml-1" /> : null}
            </button>
            <button
              onClick={fetchMandiData}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm font-medium transition shadow-sm sm:w-auto"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Expandable filters panel */}
          {showFilters && (
            <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* State */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setState(e.target.value)
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    <option value="">All States</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setDistrict(e.target.value)
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                    disabled={!state}
                  >
                    <option value="">All Districts</option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Market (optional free text) */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Market (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Raipur"
                    value={market}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMarket(e.target.value)
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                  />
                </div>

                {/* Commodity */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Commodity
                  </label>
                  <select
                    value={commodity}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setCommodity(e.target.value)
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    {COMMODITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setShowFilters(false);
                    fetchMandiData();
                  }}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-900"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Active Filters Summary ───────────────────────────────── */}
        {(state || district || market || commodity !== "Wheat") && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            {state && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                State: {state}
                <button
                  onClick={() => setState("")}
                  className="hover:text-blue-600"
                  aria-label="Remove state filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {district && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                District: {district}
                <button
                  onClick={() => setDistrict("")}
                  className="hover:text-blue-600"
                  aria-label="Remove district filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {market && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Market: {market}
                <button
                  onClick={() => setMarket("")}
                  className="hover:text-blue-600"
                  aria-label="Remove market filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {commodity !== "Wheat" && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {commodity}
                <button
                  onClick={() => setCommodity("Wheat")}
                  className="hover:text-blue-600"
                  aria-label="Reset commodity"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setState("");
                setDistrict("");
                setMarket("");
                setCommodity("Wheat");
                setSearchQuery("");
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Results Table (Desktop) ────────────────────────────────── */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/30">
            <div className="flex items-center gap-2">
              <IndianRupee size={18} className="text-blue-800" />
              <h2 className="text-base font-bold text-gray-800">Price List</h2>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {filteredPrices.length} records
              </span>
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={12} />
              Prices in ₹ per quintal
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <Loader2 size={22} className="animate-spin text-blue-800" />
              <span className="text-sm">Fetching latest mandi rates...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
              <AlertCircle size={24} className="text-red-500" />
              <p className="text-sm">Failed to load data. Please try again.</p>
              <button
                onClick={fetchMandiData}
                className="text-xs text-blue-800 font-medium underline mt-2"
              >
                Retry
              </button>
            </div>
          ) : filteredPrices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
              <Wheat size={24} />
              <p className="text-sm">No price records found for the selected filters.</p>
              <button
                onClick={() => {
                  setState("Chhattisgarh");
                  setDistrict("Raipur");
                  setMarket("");
                  setCommodity("Wheat");
                  setSearchQuery("");
                }}
                className="text-xs text-blue-800 font-medium underline mt-2"
              >
                Reset to default
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      Market
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      District
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      State
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      Commodity
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      Variety
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">
                      Min (₹/q)
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">
                      Modal (₹/q)
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">
                      Max (₹/q)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrices.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-blue-50/30 transition"
                    >
                      <td className="px-5 py-3 font-medium text-gray-800">{item.market}</td>
                      <td className="px-5 py-3 text-gray-600">{item.district}</td>
                      <td className="px-5 py-3 text-gray-600">{item.state}</td>
                      <td className="px-5 py-3 text-gray-600">{item.commodity}</td>
                      <td className="px-5 py-3 text-gray-600">{item.variety || "—"}</td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {Number(item.min_price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-blue-800">
                        {Number(item.modal_price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {Number(item.max_price).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <MapPin size={12} /> Source: data.gov.in · AGMARKNET
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs text-blue-800 hover:underline flex items-center gap-1"
            >
              Back to top <ChevronRight size={12} className="rotate-90" />
            </button>
          </div>
        </div>

        {/* ── Results Cards (Mobile) ─────────────────────────────────── */}
        <div className="md:hidden space-y-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-blue-50/30">
              <div className="flex items-center gap-2">
                <IndianRupee size={16} className="text-blue-800" />
                <h2 className="text-sm font-bold text-gray-800">Price List</h2>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {filteredPrices.length}
                </span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin size={10} />
                ₹/quintal
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 size={18} className="animate-spin text-blue-800" />
                <span className="text-sm text-gray-400">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <AlertCircle size={20} className="text-red-500" />
                <p className="text-sm text-gray-400">Failed to load</p>
                <button onClick={fetchMandiData} className="text-xs text-blue-800 underline">
                  Retry
                </button>
              </div>
            ) : filteredPrices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Wheat size={20} />
                <p className="text-sm text-gray-400">No records found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredPrices.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-blue-50/20 transition">
                    {/* Header: Market & Location */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{item.market}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          {item.district}, {item.state}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {item.commodity}
                      </span>
                    </div>

                    {/* Variety if exists */}
                    {item.variety && (
                      <p className="text-xs text-gray-500 mb-2">Variety: {item.variety}</p>
                    )}

                    {/* Price Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Min</p>
                        <p className="text-sm font-semibold text-gray-700">
                          ₹{Number(item.min_price).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
                        <p className="text-xs text-blue-700">Modal</p>
                        <p className="text-sm font-bold text-blue-800">
                          ₹{Number(item.modal_price).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Max</p>
                        <p className="text-sm font-semibold text-gray-700">
                          ₹{Number(item.max_price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] text-gray-400">data.gov.in · AGMARKNET</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-[10px] text-blue-800"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 