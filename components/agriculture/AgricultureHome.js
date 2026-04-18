"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import {
  Sprout,
  Package,
  ShoppingCart,
  Loader2,
  ArrowRight,
  Activity,
  Bell,
  Leaf,
  Store,
  ShieldCheck,
  ScanSearch,
  Brain,
} from "lucide-react";

export default function AgricultureHome() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchDashboard();
    }
  }, [user, authLoading]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/agriculture/dashboard");
      setDashboardData(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-8 py-10 shadow-sm">
          <Loader2 className="h-7 w-7 animate-spin text-[#138808]" />
          <p className="text-sm font-medium text-gray-600">
            Loading Agriculture Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const recentCrops = dashboardData?.recentCrops || [];
  const recentOrders = dashboardData?.recentOrders || [];

  const isContractFarmer = Boolean(user?.farmerProfile?.isContractFarmer);

  const quickActions = [
    {
      title: "Add New Crop",
      subtitle: "Manage crop records",
      icon: Leaf,
      path: "/agriculture/crops",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      border: "border-green-200",
    },
    {
      title: "Marketplace",
      subtitle: "Manage market activity",
      icon: Store,
      path: "/agriculture/marketplace",
      bg: "bg-lime-50",
      iconBg: "bg-lime-100",
      iconColor: "text-lime-700",
      border: "border-lime-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4fbf4] via-[#f7faf7] to-[#eef8ee]">
      <div className="sticky top-0 z-50">
        <div className="flex h-1 w-full">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>

        <header className="border-b border-green-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#138808] shadow-sm">
                <Sprout className="text-white" size={22} />
              </div>

              <div>
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Agriculture Hub
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back,{" "}
                  <span className="font-semibold text-[#138808]">
                    {user?.name || "Farmer"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isContractFarmer && (
                <button
                  onClick={() => router.push("agriculture/seller/dashboard")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#138808] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  <ShieldCheck size={16} />
                  Seller Panel
                </button>
              )}

              <button className="rounded-xl border border-green-100 bg-white p-2.5 text-gray-600 shadow-sm transition hover:bg-green-50">
                <Bell size={17} />
              </button>
            </div>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-[#dbe7d8] bg-gradient-to-r from-[#eef8ee] to-[#fff8ef] p-4 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#138808] shadow-sm">
                <Activity size={14} />
                Dashboard Overview
              </p>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Manage crops, marketplace, and smart farming tools in one place
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">
                Access day-to-day farming actions and upcoming AI-powered
                features quickly.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Activity className="text-[#138808]" size={18} />
            <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:justify-around">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(action.path)}
                  className={`group flex-1 rounded-2xl border ${action.border} ${action.bg} p-3.5 text-left transition hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div
                        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${action.iconBg}`}
                      >
                        <Icon className={action.iconColor} size={18} />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {action.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-600">
                        {action.subtitle}
                      </p>
                    </div>

                    <div className="mt-1 rounded-full bg-white p-2 shadow-sm transition group-hover:translate-x-1">
                      <ArrowRight size={14} className="text-gray-700" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-[#f3fff4] via-white to-[#eefcf0] p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                <Brain size={14} />
                AI Analysis
              </p>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Detect crop diseases with AI
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Upload crop images and get AI-assisted disease insights,
                detection support, and faster action recommendations. This tool
                can help farmers identify possible crop issues early.
              </p>
            </div>

            <button
              onClick={() => router.push("/agriculture/crop-disease-detection")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#138808] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              <ScanSearch size={18} />
              Open AI Disease Detection
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <Sprout size={18} className="text-green-700" />
                Recent Crops
              </h2>
              <button
                onClick={() => router.push("/agriculture/crops")}
                className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
              >
                View All
              </button>
            </div>

            {recentCrops.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                <Sprout size={22} className="mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">
                  No crops added yet
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentCrops.slice(0, 3).map((crop, idx) => (
                  <div
                    key={crop._id || idx}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#fafdf9] p-3 transition hover:border-green-200 hover:bg-green-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
                        <Sprout size={16} className="text-green-700" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-gray-900">
                          {crop.cropName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {crop.areaCultivated} Acres
                        </p>
                      </div>
                    </div>

                    <span className="ml-2 shrink-0 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600">
                      {crop.sowingDate?.split("T")[0] || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <ShoppingCart size={18} className="text-emerald-700" />
                Recent Orders
              </h2>
              <button
                onClick={() => router.push("/agriculture/marketplace/orders")}
                className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                Manage
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                <Package size={22} className="mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">
                  No orders received
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentOrders.slice(0, 3).map((order, idx) => (
                  <div
                    key={order._id || idx}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#f7fff8] p-3 transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                        <Package size={16} className="text-emerald-700" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-gray-900">
                          Order #{order.orderId?.slice(-6) || "N/A"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {order.status || "Pending"}
                        </p>
                      </div>
                    </div>

                    <span className="ml-2 shrink-0 text-sm font-bold text-gray-900">
                      ₹{Number(order.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}