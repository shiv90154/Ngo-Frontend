"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import SellerShell from "./SellerShell";
import {
    Loader2,
    Save,
    ArrowLeft,
    Package,
    MapPin,
    IndianRupee,
    Leaf,
    FileText
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function EditSellerProductView() {
    const router = useRouter();
    const params = useParams();
    const { user, loading: authLoading } = useAuth();

    const productId = params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        unit: "",
        quantity: "",
        location: "",
        description: "",
        imageUrl: "",
        isOrganic: false
    });
    const unitOptions = [
        "kg",
        "litre",
        "piece",
        "bundle",
        "dozen",
        "tonne",
        "bag"
    ];

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

        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(
                    `${API_BASE}/agriculture/seller/products/${productId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (data.success) {
                    const item = data.data;

                    setFormData({
                        name: item.name || "",
                        category: item.category || "",
                        price: item.price ?? "",
                        unit: item.unit || "",
                        quantity: item.quantity ?? "",
                        location: item.location || "",
                        description: item.description || "",
                        imageUrl: item.imageUrl || "",
                        isOrganic: item.isOrganic || false
                    });

                    setImagePreview(item.imageUrl || "");
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [authLoading, productId, router, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const nextValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue
        }));

        if (name === "imageUrl") {
            setImagePreview(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) return;

        setSaving(true);

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity)
            };

            const { data } = await axios.put(
                `${API_BASE}/agriculture/seller/products/${productId}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (data.success) {
                router.push("/agriculture/seller/products");
            }
        } catch (err) {
            console.error("Failed to update product:", err);
        } finally {
            setSaving(false);
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
            title="Edit Product"
            subtitle="Update your product listing details for the marketplace."
        >
            <div className="mb-5">
                <button
                    onClick={() => router.push("/agriculture/seller/products")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    <ArrowLeft size={16} />
                    Back to Products
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Product Details</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Product Name
                            </label>
                            <div className="relative">
                                <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Category"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Unit
                            </label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                            >
                                {unitOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Price
                            </label>
                            <div className="relative">
                                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Available quantity"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter location"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Description
                            </label>
                            <div className="relative">
                                <FileText size={16} className="absolute left-4 top-4 text-slate-400" />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Write product description"
                                    rows={5}
                                    className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 pt-3 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="Paste product image URL"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                                <input
                                    type="checkbox"
                                    name="isOrganic"
                                    checked={formData.isOrganic}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-slate-300 text-[#2f6b45] focus:ring-[#2f6b45]"
                                />
                                <span className="inline-flex items-center gap-2">
                                    <Leaf size={15} className="text-green-700" />
                                    Mark as Organic
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Preview</h2>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50">
                            <div className="flex h-56 items-center justify-center bg-gradient-to-b from-green-50 to-slate-100">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt={formData.name || "Preview"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Package size={44} className="text-slate-400" />
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {formData.name || "Product name"}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {formData.category || "Category"} • ₹{formData.price || 0}/{formData.unit || "unit"}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin size={12} />
                                        {formData.location || "Local"}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Package size={12} />
                                        {formData.quantity || 0} {formData.unit || "unit"}
                                    </span>
                                    {formData.isOrganic && (
                                        <span className="inline-flex items-center gap-1.5 text-green-700">
                                            <Leaf size={12} />
                                            Organic
                                        </span>
                                    )}
                                </div>

                                {formData.description && (
                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {formData.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </SellerShell>
    );
}