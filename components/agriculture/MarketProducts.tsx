// app/market/products/[productId]/page.tsx (or wherever this component lives)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    IndianRupee,
    ShoppingCart,
    Truck,
    Package,
    MapPin,
    Minus,
    Plus,
    AlertCircle,
    Star,
    Heart,
    ShieldCheck,
    Leaf,
} from "lucide-react";

// ===================== Type Definitions =====================

// Product data as returned from the API
interface Product {
    id: string | number;
    title: string;
    price: number;
    quantity_available: number;
    description: string;
    images?: string[];
    rating?: number;          // optional, default shown as "4.5" if missing
}

// API response wrapper
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Props for this component
interface MarketProductsProps {
    productId: string | number;
}

// ===================== Component =====================

const MarketProducts = ({ productId }: MarketProductsProps) => {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1);
    const [addingToCart, setAddingToCart] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            const response = await axios.get<ApiResponse<Product>>(
                `${process.env.NEXT_PUBLIC_API_URL}/agriculture/products/${productId}`,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            if (response.data.success) {
                setProduct(response.data.data ?? null);
            } else {
                throw new Error(response.data.message || "Product not found");
            }
        } catch (err: unknown) {
            const errorMessage =
                axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : "Failed to load product details";
            setError(errorMessage);
            toast.error("Could not load product");
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (delta: number): void => {
        const newQty = quantity + delta;
        if (newQty >= 1 && (!product || newQty <= product.quantity_available)) {
            setQuantity(newQty);
        } else if (product && newQty > product.quantity_available) {
            toast.warning(`Only ${product.quantity_available} units available`);
        }
    };

    const handleAddToCart = async (): Promise<void> => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warning("Please login to add items to cart");
            router.push("/login");
            return;
        }

        if (!product) return;

        setAddingToCart(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/agriculture/cart`,
                {
                    productId: product.id,
                    quantity,
                    price: product.price,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success(`Added ${quantity} × ${product.title} to cart`);
        } catch (err: unknown) {
            const errorMsg =
                axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : "Failed to add to cart";
            toast.error(errorMsg);
        } finally {
            setAddingToCart(false);
        }
    };

    const totalPrice: number = product ? product.price * quantity : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
                <div className="flex flex-col items-center gap-4 rounded-3xl border bg-white px-8 py-10 shadow-sm">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="text-sm font-medium text-emerald-700">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
                <div className="max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                    <h2 className="text-2xl font-bold">Product not available</h2>
                    <p className="mt-2 text-sm text-slate-600">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-6 rounded-full bg-emerald-600 px-5 py-3 text-white"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            {/* 🌿 FULL SCREEN GREEN BACKGROUND */}
            <div className="min-h-screen w-full bg-gradient-to-br from-emerald-100 via-green-50 to-lime-100">

                {/* CONTENT */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                    <button
                        onClick={() => router.back()}
                        className="mb-6 rounded-full border border-emerald-300 bg-white/70 backdrop-blur px-5 py-2 text-emerald-700 shadow-sm hover:bg-emerald-50 transition"
                    >
                        ← Back
                    </button>

                    <div className="grid gap-10 lg:grid-cols-2">

                        {/* LEFT - IMAGE */}
                        <div className="rounded-3xl border border-emerald-200 bg-white/80 backdrop-blur p-6 shadow-xl shadow-emerald-100">
                            {product.images?.[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-full rounded-2xl object-cover"
                                />
                            ) : (
                                <div className="text-center py-10">
                                    <Package className="mx-auto h-20 w-20 text-emerald-400" />
                                    <p className="mt-3 text-slate-600">No image available</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT - DETAILS */}
                        <div className="space-y-6 rounded-3xl border border-emerald-200 bg-white/80 backdrop-blur p-8 shadow-xl shadow-emerald-100">

                            <h1 className="text-3xl font-bold text-slate-900">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-2 text-emerald-700">
                                <Star size={16} className="fill-emerald-500" />
                                <span className="font-medium">{product.rating ?? "4.5"}</span>
                            </div>

                            {/* PRICE BOX */}
                            <div className="rounded-2xl bg-gradient-to-r from-emerald-100 to-lime-100 p-5 border border-emerald-200">
                                <p className="text-sm text-emerald-700 font-medium">Price</p>
                                <div className="text-3xl font-bold text-emerald-800">
                                    ₹ {product.price}
                                </div>
                            </div>

                            <p className="text-slate-600 leading-7">
                                {product.description}
                            </p>

                            {/* QUANTITY */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="rounded-lg border border-emerald-300 p-2 hover:bg-emerald-50"
                                >
                                    <Minus />
                                </button>

                                <span className="text-lg font-semibold">{quantity}</span>

                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="rounded-lg border border-emerald-300 p-2 hover:bg-emerald-50"
                                >
                                    <Plus />
                                </button>
                            </div>

                            {/* TOTAL */}
                            <div className="text-xl font-semibold text-slate-800">
                                Total: <span className="text-emerald-700">₹ {totalPrice}</span>
                            </div>

                            {/* BUTTON */}
                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 py-4 text-white font-semibold shadow-lg shadow-emerald-200 hover:from-emerald-700 hover:to-green-800 transition disabled:opacity-50"
                            >
                                {addingToCart ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MarketProducts;