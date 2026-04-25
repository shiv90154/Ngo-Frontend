"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import SellerShell from "./SellerShell";
import {
    Loader2,
    Package,
    CheckCircle,
    Clock3,
    AlertTriangle,
    ShoppingCart,
    IndianRupee,
    type LucideIcon,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Tone = "green" | "amber" | "blue" | "red";

type StatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    tone?: Tone;
};

type DashboardStats = {
    totalProducts: number;
    activeProducts: number;
    pendingProducts: number;
    lowStockProducts: number;
    totalOrders: number;
    monthlyRevenue: number;
};

type RecentProduct = {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    approvalStatus: "approved" | "pending" | "rejected" | string;
};

type RecentOrder = {
    id: string;
    buyerName: string;
    createdAt: string;
    total: number;
    status: string;
};

type DashboardData = {
    stats: DashboardStats;
    recentProducts: RecentProduct[];
    recentOrders: RecentOrder[];
};

const StatCard = ({ label, value, icon: Icon, tone = "green" }: StatCardProps) => {
    const tones: Record<Tone, string> = {
        green: "border-green-200 bg-green-50 text-green-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
        blue: "border-sky-200 bg-sky-50 text-sky-700",
        red: "border-red-200 bg-red-50 text-red-700",
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>

                <div className={`rounded-xl border p-3 ${tones[tone]}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
};

export default function SellerDashboardView(): React.JSX.Element {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState < boolean > (true);

    const [dashboard, setDashboard] = useState < DashboardData > ({
        stats: {
            totalProducts: 0,
            activeProducts: 0,
            pendingProducts: 0,
            lowStockProducts: 0,
            totalOrders: 0,
            monthlyRevenue: 0,
        },
        recentProducts: [],
        recentOrders: [],
    });

    useEffect(() => {
        if (authLoading) return;

        const token = localStorage.getItem("token");

        if (!token || !user) {
            router.replace("/login");
            return;
        }

        const isContractFarmer = user?.farmerProfile?.isContractFarmer === true;

        if (!isContractFarmer) {
            router.replace("/agriculture/marketplace");
            return;
        }

        const fetchDashboard = async (): Promise<void> => {
            try {
                const { data } = await axios.get < {
                    success: boolean;
                    data: DashboardData;
                } > (`${API_BASE}/agriculture/seller/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (data.success) {
                    setDashboard(data.data);
                }
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [authLoading, router, user]);

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <Loader2 className="h-10 w-10 animate-spin text-[#2f6b45]" />
            </div>
        );
    }

    const { stats, recentProducts, recentOrders } = dashboard;

    return (
        <SellerShell
            title="Seller Dashboard"
            subtitle="Monitor listings, approval status, stock levels, and recent orders."
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <StatCard label="Total Products" value={stats.totalProducts} icon={Package} tone="green" />
                <StatCard label="Active Products" value={stats.activeProducts} icon={CheckCircle} tone="green" />
                <StatCard label="Pending Approval" value={stats.pendingProducts} icon={Clock3} tone="amber" />
                <StatCard label="Low Stock" value={stats.lowStockProducts} icon={AlertTriangle} tone="red" />
                <StatCard label="Orders Received" value={stats.totalOrders} icon={ShoppingCart} tone="blue" />
                <StatCard
                    label="Monthly Revenue"
                    value={`₹${Number(stats.monthlyRevenue || 0).toLocaleString()}`}
                    icon={IndianRupee}
                    tone="green"
                />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Recent Products</h2>

                        <button
                            onClick={() => router.push("/agriculture/seller/products")}
                            className="text-sm font-semibold text-[#2f6b45]"
                            type="button"
                        >
                            View All
                        </button>
                    </div>

                    {recentProducts.length === 0 ? (
                        <p className="text-sm text-slate-500">No products available.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentProducts.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {item.category} • ₹{item.price}/{item.unit}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${item.approvalStatus === "approved"
                                                    ? "bg-green-50 text-green-700"
                                                    : item.approvalStatus === "pending"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {item.approvalStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>

                        <button
                            onClick={() => router.push("/agriculture/seller/orders")}
                            className="text-sm font-semibold text-[#2f6b45]"
                            type="button"
                        >
                            View All
                        </button>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p className="text-sm text-slate-500">No recent orders available.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-900">{order.id}</p>
                                        <p className="text-xs text-slate-500">
                                            {order.buyerName} • {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">
                                            ₹{Number(order.total).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-slate-500">{order.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SellerShell>
    );
}