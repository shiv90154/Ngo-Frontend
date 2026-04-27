"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Package,
  IndianRupee,
  MapPin,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  name?: string;
  images?: string[];        // backend sends images array
  imageUrl?: string[];      // fallback
  price?: number;
};

type Address = {
  block?: string;
  country?: string;
  city?: string;
  pincode?: string;
};

type Order = {
  _id: string;
  createdAt: string;
  orderStatus: string;
  totalPrice?: number;
  quantity?: number;
  product?: Product;
  deliveryAddress?: Address;
};

type StatusConfig = {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  label: string;
};

const getStatusConfig = (status: string): StatusConfig => {
  const normalized = status?.toLowerCase() || "";
  const statuses: Record<string, StatusConfig> = {
    pending: {
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      label: "Pending",
    },
    processing: {
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      label: "Processing",
    },
    shipped: {
      icon: Truck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      label: "Shipped",
    },
    delivered: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      label: "Delivered",
    },
    cancelled: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      label: "Cancelled",
    },
  };
  return statuses[normalized] || statuses.pending;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    // Get fresh token each time
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      console.warn("No token found, redirecting to login");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/agriculture/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Orders API response:", data);

      // Backend returns { success: true, data: [...] }
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
        setError(null);
      } else {
        throw new Error(data.message || "Unexpected response format");
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Fetch orders error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unable to load orders";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
        <p className="mt-2 text-red-700">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-blue-300" />
        <p className="mt-2 text-slate-500">You haven't placed any orders yet.</p>
        <button
          onClick={() => router.push("/agriculture/marketplace")}
          className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.orderStatus);
          const StatusIcon = statusConfig.icon;
          const isExpanded = expandedOrderId === order._id;
          const product = order.product || { name: "Product unavailable", images: [] };
          const productImage =
            (product.images && product.images[0]) ||
            (product.imageUrl) ||
            null;

          return (
            <div
              key={order._id}
              className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden"
            >
              {/* Order summary row (always visible) */}
              <div
                className="p-4 cursor-pointer hover:bg-slate-50 transition"
                onClick={() => toggleExpand(order._id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 overflow-hidden flex-shrink-0">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 m-3 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Order #{order._id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-emerald-700 font-bold">
                        <IndianRupee size={14} />
                        <span>{order.totalPrice?.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Qty: {order.quantity}</p>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                    >
                      <StatusIcon size={12} />
                      <span>{statusConfig.label}</span>
                    </div>

                    <ChevronRight
                      size={18}
                      className={`text-slate-400 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-blue-100 bg-slate-50/50 p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-700">Order Date</p>
                        <p className="text-slate-600">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-700">Delivery Address</p>
                        <p className="text-slate-600">
                          {order.deliveryAddress?.block
                            ? `${order.deliveryAddress.city }, ${order.deliveryAddress.pincode || ""} - ${order.deliveryAddress.country || ""}`
                            : "Address not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {order.orderStatus?.toLowerCase() === "delivered" && (
                    <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle size={16} />
                      Delivered on {formatDate(order.updatedAt || order.createdAt)}
                    </div>
                  )}

                  <button
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    onClick={() => router.push(`/agriculture/marketplace/order/${order._id}`)}
                  >
                    View full details →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}