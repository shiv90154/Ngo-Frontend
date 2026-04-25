// components/agriculture/seller/Orders.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerShell from "@/components/agriculture/seller/SellerShell";
import api from "@/config/api";
import { Loader2, ShoppingCart, CalendarDays, User, IndianRupee } from "lucide-react";

// ===================== Type Definitions =====================

// Shape of an order as returned by the backend
interface Order {
  id: string | number;
  buyerName?: string;
  createdAt: string;
  status: "delivered" | "shipped" | "processing" | "pending" | "cancelled" | string;
  total: number;
}

// Dashboard statistics
interface Stats {
  totalOrders?: number;
  activeProducts?: number;
  monthlyRevenue?: number;
}

// Response from GET /agriculture/seller/dashboard
interface DashboardResponse {
  data?: {
    recentOrders?: Order[];
    stats?: Stats;
  };
}

// Minimal User type based on what the component uses
interface User {
  farmerProfile?: {
    isContractFarmer?: boolean;
  };
}

// Extend useAuth hook's return type (adjust to match your actual AuthContext)
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// ===================== Component =====================

export default function SellerOrdersPage() {
  const { user, loading: authLoading } = useAuth() as AuthContextType;
  const router = useRouter();

  const [orders, setOrders] = useState < Order[] > ([]);
  const [stats, setStats] = useState < Stats | null > (null);
  const [loading, setLoading] = useState < boolean > (true);

  const isContractFarmer = Boolean(user?.farmerProfile?.isContractFarmer);

  // Redirect unauthenticated or non‑contract farmers
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!authLoading && user && !isContractFarmer) {
      router.push("/agriculture");
      return;
    }
    if (user && isContractFarmer) {
      fetchSellerOrders();
    }
  }, [user, authLoading, isContractFarmer, router]);

  const fetchSellerOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get < DashboardResponse > ("agriculture/seller/dashboard");
      const dashboard = res?.data?.data || {};
      setOrders(dashboard.recentOrders || []);
      setStats(dashboard.stats || {});
    } catch (error) {
      console.error("Failed to fetch seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status: string): string => {
    const value = String(status || "").toLowerCase();
    switch (value) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (date?: string): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf7]">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-8 py-10 shadow-sm">
          <Loader2 className="h-7 w-7 animate-spin text-[#138808]" />
          <p className="text-sm font-medium text-gray-600">
            Loading seller orders...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isContractFarmer) return null;

  return (
    <SellerShell title="Orders" subtitle="Manage orders from customers here">
      <div className="min-h-screen bg-gradient-to-br from-[#f4fbf4] via-[#f7faf7] to-[#eef8ee]">
        <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {stats?.totalOrders || 0}
              </h3>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Active Products</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {stats?.activeProducts || 0}
              </h3>
            </div>
            <div className="rounded-2xl border border-lime-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                ₹{Number(stats?.monthlyRevenue || 0).toLocaleString("en-IN")}
              </h3>
            </div>
          </section>

          {/* Orders Table */}
          <section className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
                <p className="text-sm text-gray-500">
                  Showing latest {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                <ShoppingCart size={28} className="mb-3 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">No seller orders found</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-[#f7fbf7]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Order</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Buyer</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {orders.map((order, index) => (
                        <tr key={order.id ?? index} className="transition hover:bg-green-50/40">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                <ShoppingCart size={18} className="text-green-700" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  #{String(order.id ?? "").slice(-6) || "N/A"}
                                </p>
                                <p className="text-xs text-gray-500">Seller Order</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <User size={15} className="text-gray-400" />
                              <span>{order.buyerName ?? "Buyer"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <CalendarDays size={15} className="text-gray-400" />
                              <span>{formatDate(order.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyles(order.status)}`}>
                              {order.status || "processing"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex items-center gap-1 text-sm font-bold text-gray-900">
                              <IndianRupee size={15} />
                              <span>{(order.total ?? 0).toLocaleString("en-IN")}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </SellerShell>
  );
}