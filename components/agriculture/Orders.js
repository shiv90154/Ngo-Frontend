"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";
import {
  Package,
  Truck,
  ArrowLeft,
  Loader2,
  Calendar,
  ShieldCheck,
  MapPin
} from "lucide-react";

export default function Orders() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const fetchOrders = async () => {
      try {
        setError("");

        const token = localStorage.getItem("token");

        if (!token || !user) {
          router.replace("/login");
          return;
        }

        const res = await api.get("/agriculture/my-orders");
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
          return;
        }

        setError(err.response?.data?.message || "Failed to load your orders.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authLoading, user, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#2f6b45]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <button
          onClick={() => router.push("/agriculture/marketplace")}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Marketplace
        </button>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] text-white shadow-sm">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2f6b45]">
                  Order Management
                </p>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  My Orders
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Track your agricultural inputs and procurement orders.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
              <Package size={14} />
              {orders.length} Order{orders.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="mt-6">
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <Package size={32} className="text-slate-400" />
              </div>

              <h2 className="mb-2 text-xl font-bold text-slate-900">
                No orders found
              </h2>
              <p className="mb-6 text-sm text-slate-500">
                You have not placed any orders yet.
              </p>

              <button
                onClick={() => router.push("/agriculture/marketplace")}
                className="rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
              >
                Shop Inputs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-900 break-all">
                          {order._id}
                        </h2>

                        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
                          <Truck size={12} />
                          {order.status || "Placed"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} />
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <span>Qty: {order.quantity ?? 0}</span>
                      </div>

                      {order.deliveryAddress && (
                        <div className="mt-3 inline-flex max-w-full items-start gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                          <MapPin size={15} className="mt-0.5 shrink-0" />
                          <span className="break-words">{order.deliveryAddress}</span>
                        </div>
                      )}

                      {order.product?.name && (
                        <div className="mt-3 text-sm text-slate-600">
                          <span className="font-semibold text-slate-800">Product:</span>{" "}
                          {order.product.name}
                        </div>
                      )}
                    </div>

                    <div className="w-full border-t border-slate-200 pt-4 sm:w-auto sm:border-0 sm:pt-0 sm:text-right">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Order Total
                      </p>
                      <p className="text-2xl font-bold text-[#234d36]">
                        ₹{order.totalPrice?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}