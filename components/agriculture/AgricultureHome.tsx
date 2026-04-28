"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sprout,
  Bell,
  ShieldCheck,
  Brain,
  Store,
  TrendingUp,
  Loader2,
  ArrowRight,
} from "lucide-react";

type UserType = {
  name?: string;
  farmerProfile?: {
    isContractFarmer?: boolean;
  };
};

export default function AgricultureHome(): JSX.Element {
  const { user, loading: authLoading } = useAuth() as {
    user: UserType | null;
    loading: boolean;
  };

  const router = useRouter();

  const isContractFarmer: boolean = Boolean(
    user?.farmerProfile?.isContractFarmer
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const navigateTo = (path: string): void => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex justify-between items-center px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-gray-800">Samraddh</span>
          <span className="text-xs text-gray-400 ml-2">
            Welcome, {user?.fullName?.split(" ")[0] || "Farmer"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isContractFarmer && (
            <button
              onClick={() => navigateTo("/agriculture/seller/dashboard")}
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
            >
              <ShieldCheck size={14} /> Seller Panel
            </button>
          )}

          <button className="p-1.5 rounded-full hover:bg-blue-50">
            <Bell size={18} className="text-gray-500" />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* AI Card */}
          <div
            onClick={() => navigateTo("/agriculture/crop-disease-detection")}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  AI Crop Disease Detection
                </h2>

                <p className="text-blue-100 text-sm md:text-base max-w-2xl">
                  Upload a photo of your crop – AI detects diseases and suggests treatment instantly.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Brain size={32} className="text-white" />
                </div>

                <button className="bg-white text-blue-700 hover:bg-blue-50 font-medium px-5 py-2 rounded-xl text-sm flex items-center gap-1">
                  Detect Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Marketplace */}
            <div
              onClick={() => navigateTo("/agriculture/marketplace")}
              className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between mb-4">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <Store size={28} className="text-emerald-700" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Marketplace
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                Buy & sell produce directly with fair pricing.
              </p>

              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                Explore <ArrowRight size={14} />
              </button>
            </div>

            {/* Mandi */}
            <div
              onClick={() => navigateTo("/agriculture/mandi")}
              className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between mb-4">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <TrendingUp size={28} className="text-amber-700" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Mandi Prices
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                Real-time market prices to maximize profit.
              </p>

              <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                Check Rates <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}