"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";
import {
    Loader2,
    Save,
    MapPin,
    Image as ImageIcon,
    Leaf,
    FileText,
    IndianRupee,
    Boxes,
} from "lucide-react";
import SellerShell from "@/components/agriculture/seller/SellerShell";

const API_BASE: string =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ProductForm = {
    name: string;
    description: string;
    category: string;
    price: string;
    quantity: string;
    unit: string;
    location: string;
    imageUrl: string;
    isOrganic: boolean;
};

type ApiResponse = {
    success: boolean;
    message?: string;
};

const categoryOptions: { value: string; label: string }[] = [
    { value: "seeds", label: "Seeds" },
    { value: "fertilizers", label: "Fertilizers" },
    { value: "equipment", label: "Equipment" },
    { value: "livestock", label: "Livestock" },
    { value: "produce", label: "Produce" },
    { value: "pesticides", label: "Pesticides" },
    { value: "tools", label: "Tools" },
];

const unitOptions: string[] = [
    "kg",
    "litre",
    "piece",
    "bundle",
    "dozen",
    "tonne",
    "bag",
];

const initialForm: ProductForm = {
    name: "",
    description: "",
    category: "seeds",
    price: "",
    quantity: "",
    unit: "kg",
    location: "",
    imageUrl: "",
    isOrganic: false,
};

export default function NewProduct(): JSX.Element {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [pageLoading, setPageLoading] = useState < boolean > (true);
    const [submitting, setSubmitting] = useState < boolean > (false);
    const [form, setForm] = useState < ProductForm > (initialForm);
    const [error, setError] = useState < string > ("");

    useEffect(() => {
        if (authLoading) return;

        const token = localStorage.getItem("token");
        const isContractFarmer = user?.farmerProfile?.isContractFarmer === true;

        if (!token || !user) {
            router.replace("/login");
            return;
        }

        if (!isContractFarmer) {
            router.replace("/agriculture/marketplace");
            return;
        }

        setPageLoading(false);
    }, [authLoading, router, user]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
        const { name, value, type } = e.target;

        const nextValue =
            type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

        setForm((prev) => ({
            ...prev,
            [name]: nextValue,
        }));
    };

    const validateForm = (): string => {
        if (!form.name.trim()) return "Product name is required.";
        if (!form.category) return "Category is required.";
        if (form.price === "" || Number(form.price) < 0)
            return "Enter a valid price.";
        if (form.quantity === "" || Number(form.quantity) < 0)
            return "Enter a valid quantity.";
        if (!form.unit) return "Unit is required.";

        return "";
    };

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                category: form.category,
                price: Number(form.price),
                quantity: Number(form.quantity),
                unit: form.unit,
                location: form.location.trim(),
                imageUrl: form.imageUrl.trim(),
                isOrganic: Boolean(form.isOrganic),
            };

            const { data } = await axios.post < ApiResponse > (
                `${API_BASE}/agriculture/seller/products`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                router.push("/agriculture/seller/products");
            } else {
                setError(data.message || "Failed to create product.");
            }
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;

            setError(
                error.response?.data?.message || "Failed to create product."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || pageLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <Loader2 className="h-10 w-10 animate-spin text-[#2f6b45]" />
            </div>
        );
    }

    return (
        <SellerShell
            title="Add Product"
            subtitle="Manage listings, update stock, and review product approval status."
        >
            <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-800">
                <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-[#2f6b45]" />
                            <h2 className="text-lg font-bold text-slate-900">
                                Basic Information
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Category
                                </label>
                                <div className="relative">
                                    <Boxes
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                    >
                                        {categoryOptions.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Unit
                                </label>
                                <select
                                    name="unit"
                                    value={form.unit}
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
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Price
                                </label>
                                <div className="relative">
                                    <IndianRupee
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="Enter price"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Write a short description of the product"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-[#2f6b45]" />
                            <h2 className="text-lg font-bold text-slate-900">
                                Location & Media
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Enter city or region"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Image URL
                                </label>
                                <div className="relative">
                                    <ImageIcon
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    />
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                        placeholder="Paste image URL"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                                    <input
                                        type="checkbox"
                                        name="isOrganic"
                                        checked={form.isOrganic}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-slate-300 text-[#2f6b45] focus:ring-[#2f6b45]"
                                    />
                                    <Leaf size={16} className="text-green-700" />
                                    Mark this product as Organic
                                </label>
                            </div>
                        </div>
                    </div>

                    {form.imageUrl && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-lg font-bold text-slate-900">
                                Preview
                            </h2>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-green-50 to-slate-100">
                                <div className="flex h-64 items-center justify-center">
                                    <img
                                        src={form.imageUrl}
                                        alt="Product preview"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => router.push("/agriculture/seller/products")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </SellerShell>
    );
}