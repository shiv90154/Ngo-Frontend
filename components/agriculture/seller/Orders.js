// components/agriculture/Orders.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import {
  Loader2,
  ShoppingCart,
  CalendarDays,
  Store,
  IndianRupee,
  Package,
  Truck,
} from "lucide-react";

interface Order {
  id: string;
  sellerName?: string;
  createdAt: string;
  status: string;
  total: number;
  items?: any[];
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Adjust this endpoint to your actual API route for fetching user orders
      const res = await api.get("/orders/my-orders");
      setOrders(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <Package size={16} />;
      case "shipped":
        return <Truck size={16} />;
      default:
        return <ShoppingCart size={16} />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-green-700" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="mt-1 text-gray-600">Track and manage your marketplace purchases</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-800">No orders yet</h2>
            <p className="mt-2 text-gray-500">When you place an order, it will appear here.</p>
            <button
              onClick={() => router.push("/agriculture/marketplace")}
              className="mt-6 rounded-lg bg-green-700 px-6 py-2 text-white hover:bg-green-800 transition"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Left side - Order info */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono text-lg font-semibold text-gray-800">
                        #{String(order.id).slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Store size={16} className="text-gray-400" />
                        <span>{order.sellerName || "FarmFresh Vendor"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <CalendarDays size={16} className="text-gray-400" />
                        <span>{new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Status & Total */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyles(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status || "Processing"}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="flex items-center text-xl font-bold text-gray-900">
                        <IndianRupee size={18} />
                        {Number(order.total || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional: View Details Button */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => router.push(`/agriculture/marketplace/orders/${order.id}`)}
                    className="text-sm font-medium text-green-700 hover:text-green-800"
                  >
                    View Order Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}