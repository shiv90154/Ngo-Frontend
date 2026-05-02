"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
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
    FileText,
    Upload,
    X
} from "lucide-react";

const API_BASE: string = process.env.NEXT_PUBLIC_API_URL || "";

type FormDataType = {
    name: string;
    category: string;
    price: string | number;
    unit: string;
    quantity: string | number;
    location: string;
    description: string;
    imageFile: File | null;
    existingImageUrl: string;
    isOrganic: boolean;
};

const categoryOptions = [
    { value: "seeds", label: "Seeds" },
    { value: "fertilizers", label: "Fertilizers" },
    { value: "equipment", label: "Equipment" },
    { value: "livestock", label: "Livestock" },
    { value: "produce", label: "Produce" },
    { value: "pesticides", label: "Pesticides" },
    { value: "tools", label: "Tools" },
];

export default function EditSellerProductView(): JSX.Element {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth();

    const productId = params?.id;

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [error, setError] = useState<string>("");

    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        category: "",
        price: "",
        unit: "",
        quantity: "",
        location: "",
        description: "",
        imageFile: null,
        existingImageUrl: "",
        isOrganic: false
    });

    const unitOptions: string[] = [
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
                        imageFile: null,
                        existingImageUrl: item.imageUrl || "",
                        isOrganic: item.isOrganic || false
                    });

                    // Set image preview from existing image
                    const imageUrl = getFullImageUrl(item.imageUrl || "");
                    setImagePreview(imageUrl);
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [authLoading, productId, router, user]);

    const getFullImageUrl = (imageUrl: string): string => {
        if (!imageUrl) return "";
        if (imageUrl.startsWith("http")) return imageUrl;
        if (imageUrl.startsWith("/uploads")) {
            const baseUrl = API_BASE.replace('/api', '');
            return `${baseUrl}${imageUrl}`;
        }
        return imageUrl;
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        const nextValue =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError("Please upload a valid image file (JPEG, PNG, or WEBP)");
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setError("Image size should be less than 5MB");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                imageFile: file,
            }));

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setError("");
        }
    };

    const removeImage = (): void => {
        setFormData((prev) => ({
            ...prev,
            imageFile: null,
            existingImageUrl: "",
        }));
        
        if (imagePreview && !imagePreview.includes('/uploads/')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) return;

        setSaving(true);
        setError("");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("price", String(Number(formData.price)));
            formDataToSend.append("quantity", String(Number(formData.quantity)));
            formDataToSend.append("unit", formData.unit);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("isOrganic", String(formData.isOrganic));
            
            // Only append image file if a new one is selected
            if (formData.imageFile) {
                formDataToSend.append("productImage", formData.imageFile);
            }

            const { data } = await axios.put(
                `${API_BASE}/agriculture/seller/products/${productId}`,
                formDataToSend,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            if (data.success) {
                // Clean up preview URL if it was a blob
                if (imagePreview && imagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(imagePreview);
                }
                router.push("/agriculture/seller/products");
            } else {
                setError(data.message || "Failed to update product");
            }
        } catch (err) {
            console.error("Failed to update product:", err);
            setError("Failed to update product. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Clean up preview URL on component unmount
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

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
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                >
                                    <option value="">Select Category</option>
                                    {categoryOptions.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Unit
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                >
                                    <option value="">Select Unit</option>
                                    {unitOptions.map((item) => (
                                        <option key={item} value={item}>
                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Price (₹)
                                </label>
                                <div className="relative">
                                    <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
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
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter city or region"
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
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
                                    <Leaf size={16} className="text-green-700" />
                                    Mark this product as Organic
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Package size={18} className="text-[#2f6b45]" />
                            <h2 className="text-lg font-bold text-slate-900">
                                Product Image
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Change Image (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="productImage"
                                    />
                                    <label
                                        htmlFor="productImage"
                                        className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <Upload size={16} className="text-[#2f6b45]" />
                                        {formData.imageFile ? formData.imageFile.name : "Choose a new image"}
                                    </label>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    Supported formats: JPEG, PNG, WEBP (Max 5MB). Leave empty to keep current image.
                                </p>
                            </div>

                            {imagePreview && (
                                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-green-50 to-slate-100">
                                    <div className="flex h-64 items-center justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Product preview"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute right-2 top-2 rounded-lg bg-red-500 p-1.5 text-white transition hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

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
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Update Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </SellerShell>
    );
}