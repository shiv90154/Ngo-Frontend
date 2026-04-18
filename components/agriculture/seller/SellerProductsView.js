"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import SellerShell from "./SellerShell";
import {
    Loader2,
    Search,
    Filter,
    Package,
    Plus,
    Pencil,
    Trash2,
    MapPin,
    Leaf
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function SellerProductsView() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [approvalStatus, setApprovalStatus] = useState("all");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (authLoading) return;

        const token = localStorage.getItem("token");
        if (!token || !user) {
            router.replace("/login");
            return;
        }
        const isContractFarmer = user?.farmerProfile?.isContractFarmer === true;
        console.log(isContractFarmer);

        if (!isContractFarmer) {
            router.replace("/agriculture/marketplace");
            return;
        }

        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_BASE}/agriculture/seller/products`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (data.success) {
                    const items = data.data.items || [];
                    setProducts(items);
                    setCategories([...new Set(items.map((item) => item.category).filter(Boolean))]);
                }
            } catch (err) {
                console.error("Products fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [authLoading, router, user]);

    const filteredProducts = useMemo(() => {
        const s = search.toLowerCase();

        return products.filter((item) => {
            const matchSearch =
                item.name.toLowerCase().includes(s) ||
                item.location?.toLowerCase().includes(s);

            const matchCategory = category === "all" || item.category === category;
            const matchApproval =
                approvalStatus === "all" || item.approvalStatus === approvalStatus;

            return matchSearch && matchCategory && matchApproval;
        });
    }, [products, search, category, approvalStatus]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`${API_BASE}/agriculture/seller/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProducts((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <Loader2 className="h-10 w-10 animate-spin text-[#2f6b45]" />
            </div>
        );
    }

    return (
        <SellerShell
            title="My Products"
            subtitle="Manage listings, update stock, and review product approval status."
        >
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_.7fr_.7fr_auto]">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by product or location"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                        />
                    </div>

                    <div className="relative">
                        <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select
                            value={approvalStatus}
                            onChange={(e) => setApprovalStatus(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                        >
                            <option value="all">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <button
                        onClick={() => router.push("/agriculture/seller/products/new")}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
                    >
                        <Plus size={16} />
                        Add Product
                    </button>
                </div>
            </div>

            <div className="mt-5">
                {filteredProducts.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                        <Package size={40} className="mx-auto mb-3 text-slate-400" />
                        <h2 className="mb-2 text-lg font-bold text-slate-900">No products found</h2>
                        <p className="text-sm text-slate-500">
                            No matching products available for the selected filters.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {filteredProducts.map((item) => (
                            <div
                                key={item.id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                                    <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-green-50 to-slate-100 sm:w-32">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="h-full w-full rounded-xl object-cover"
                                            />
                                        ) : (
                                            <Package size={34} className="text-slate-400" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {item.category} • ₹{item.price}/{item.unit}
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${item.approvalStatus === "approved"
                                                    ? "bg-green-50 text-green-700"
                                                    : item.approvalStatus === "pending"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-red-50 text-red-700"
                                                    }`}
                                            >
                                                {item.approvalStatus}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <MapPin size={12} />
                                                {item.location || "Local"}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Package size={12} />
                                                {item.quantity} {item.unit}
                                            </span>
                                            {item.isOrganic && (
                                                <span className="inline-flex items-center gap-1.5 text-green-700">
                                                    <Leaf size={12} />
                                                    Organic
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-2">
                                            <button
                                                onClick={() => router.push(`/agriculture/seller/products/${item.id}/edit`)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SellerShell>
    );
}