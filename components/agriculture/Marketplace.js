'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    ShoppingCart,
    Search,
    Filter,
    IndianRupee,
    Star,
    Package,
    Plus,
    Minus,
    X,
    Leaf,
    Heart,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    MapPin,
    ShieldCheck
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const StatCard = ({ label, value, chip, chipClass }) => (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
            <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${chipClass}`}>
            {chip}
        </span>
    </div>
);

const Marketplace = ({
    productsEndpoint = `${API_BASE}/agriculture/products`,
    cartEndpoint = `${API_BASE}/agriculture/cart`,
    checkoutEndpoint = `${API_BASE}/agriculture/checkout`,
    token = null
}) => {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState([]);

    const authToken =
        token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    const authHeaders = authToken
        ? { Authorization: `Bearer ${authToken}` }
        : {};

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axios.get(productsEndpoint, {
                headers: authHeaders
            });

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch products');
            }

            setProducts(data.data);
            setCategories([...new Set(data.data.map(p => p.category).filter(Boolean))]);
        } catch (err) {
            console.error(err);
            setError('Unable to load products. Please try again later.');
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCart = async () => {
        if (!authToken) return;

        try {
            const { data } = await axios.get(cartEndpoint, {
                headers: authHeaders
            });

            if (data.success) setCart(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const addToCart = async (product, quantity = 1) => {
        if (!authToken) {
            toast.warning('Please login to add items to cart');
            router.push('/login');
            return;
        }

        const existing = cart.find(item => item.productId === product.id);
        if (existing) {
            updateCartItem(product.id, existing.quantity + quantity);
            return;
        }

        try {
            const { data } = await axios.post(
                cartEndpoint,
                { productId: product.id, quantity, price: product.price },
                { headers: authHeaders }
            );

            if (data.success) {
                setCart([...cart, { ...data.data, product }]);
                toast.success(`${product.name} added to cart`);
            }
        } catch {
            toast.error('Failed to add to cart');
        }
    };

    const updateCartItem = async (productId, quantity) => {
        if (quantity <= 0) {
            removeCartItem(productId);
            return;
        }

        try {
            await axios.put(
                `${cartEndpoint}/${productId}`,
                { quantity },
                { headers: authHeaders }
            );

            setCart(cart.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            ));
        } catch {
            toast.error('Failed to update cart');
        }
    };

    const removeCartItem = async (productId) => {
        try {
            await axios.delete(`${cartEndpoint}/${productId}`, {
                headers: authHeaders
            });

            setCart(cart.filter(item => item.productId !== productId));
            toast.success('Item removed');
        } catch {
            toast.error('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        if (!cart.length) {
            toast.warning('Your cart is empty');
            return;
        }

        setCheckoutLoading(true);

        try {
            const { data } = await axios.post(
                checkoutEndpoint,
                {},
                { headers: authHeaders }
            );

            if (!data.success) {
                throw new Error(data.message);
            }

            toast.success('Order placed successfully');
            setCart([]);
            setShowCart(false);
            router.push('/agriculture/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const toggleWishlist = (id) => {
        setWishlist(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const filteredProducts = useMemo(() => {
        const s = searchTerm.toLowerCase();

        return products.filter(p => {
            const matchSearch =
                p.name.toLowerCase().includes(s) ||
                p.sellerName?.toLowerCase().includes(s);

            const matchCat =
                categoryFilter === 'all' || p.category === categoryFilter;

            return matchSearch && matchCat;
        });
    }, [products, searchTerm, categoryFilter]);

    const cartTotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );

    const cartCount = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    if (loading && !products.length) {
        return (
            <>
                <ToastContainer position="top-right" />
                <div className="min-h-screen bg-slate-100">
                    <div className="mx-auto max-w-7xl space-y-4 px-4 py-5">
                        <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />
                        <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                                    <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                toastStyle={{ borderRadius: 14, fontSize: 14 }}
            />

            <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-800">
                <div className="mx-auto max-w-7xl space-y-4 px-4 py-5">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] text-white shadow-sm">
                                    <ShieldCheck size={22} />
                                </div>

                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                        Marketplace
                                    </h1>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                                    <CheckCircle size={14} />
                                    Verified Listings
                                </span>

                                <button
                                    onClick={() => setShowCart(true)}
                                    className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
                                >
                                    <ShoppingCart size={17} />
                                    My Cart
                                    {cartCount > 0 && (
                                        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-amber-600 px-1 text-[11px] font-bold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_.55fr]">
                            <div className="relative">
                                <Search
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Search products, dealers, or inputs"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                />
                            </div>

                            <div className="relative">
                                <Filter
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <select
                                    value={categoryFilter}
                                    onChange={e => setCategoryFilter(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                            <StatCard
                                label="Total Products"
                                value={products.length}
                                chip="Registry"
                                chipClass="border-green-200 bg-green-50 text-green-700"
                            />
                            <StatCard
                                label="Visible Results"
                                value={filteredProducts.length}
                                chip="Filtered"
                                chipClass="border-amber-200 bg-amber-50 text-amber-700"
                            />
                            <StatCard
                                label="Categories"
                                value={categories.length}
                                chip="Active"
                                chipClass="border-emerald-200 bg-emerald-50 text-emerald-700"
                            />
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                            <AlertCircle size={40} className="mx-auto mb-3 text-red-600" />
                            <p className="mb-4 text-sm text-red-700">{error}</p>
                            <button
                                onClick={fetchProducts}
                                className="rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
                            <Leaf size={46} className="mx-auto mb-3 text-slate-400" />
                            <p className="text-sm text-slate-500">
                                No products found matching your criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map(product => {
                                const inCart = cart.some(i => i.productId === product.id);
                                const inWish = wishlist.includes(product.id);

                                return (
                                    <div
                                        key={product.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="relative flex h-48 items-center justify-center bg-gradient-to-b from-green-50 to-slate-100">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Package size={48} className="text-slate-400" />
                                            )}

                                            <button
                                                onClick={() => toggleWishlist(product.id)}
                                                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 shadow-sm"
                                            >
                                                <Heart
                                                    size={16}
                                                    color={inWish ? '#d14f45' : '#6b7280'}
                                                    fill={inWish ? '#d14f45' : 'none'}
                                                />
                                            </button>

                                            {product.isOrganic && (
                                                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                                                    <Leaf size={10} />
                                                    Organic
                                                </span>
                                            )}

                                            {inCart && (
                                                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                                                    <CheckCircle size={10} />
                                                    In cart
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="line-clamp-2 min-h-[44px] text-[17px] font-bold leading-snug text-slate-900">
                                                    {product.name}
                                                </h3>

                                                <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                                                    <Star size={12} fill="#b45309" />
                                                    {product.rating || '4.5'}
                                                </div>
                                            </div>

                                            <p className="text-xs font-semibold text-slate-500">
                                                by {product.sellerName || 'Certified Dealer'}
                                            </p>

                                            <div className="flex items-end gap-1">
                                                <IndianRupee size={15} className="text-slate-600" />
                                                <span className="text-2xl font-bold leading-none text-slate-900">
                                                    {product.price}
                                                </span>
                                                <span className="text-xs text-slate-500">/{product.unit}</span>
                                            </div>

                                            <div className="space-y-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <MapPin size={12} />
                                                    {product.location || 'Local'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Package size={12} />
                                                    {product.quantity} {product.unit} left
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => addToCart(product, 1)}
                                                className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 ${inCart
                                                    ? 'bg-gradient-to-b from-[#2f6b45] to-[#234d36]'
                                                    : 'bg-gradient-to-b from-[#2f6b45] to-[#234d36]'
                                                    }`}
                                            >
                                                {inCart ? (
                                                    <>
                                                        <Plus size={15} />
                                                        Add More
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart size={15} />
                                                        Add to Cart
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {showCart && (
                    <div
                        className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm"
                        onClick={e => {
                            if (e.target === e.currentTarget) setShowCart(false);
                        }}
                    >
                        <div className="flex h-full w-full max-w-[430px] flex-col border-l border-slate-200 bg-slate-50 shadow-2xl">
                            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-5 py-4 text-white">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart size={18} />
                                    <span className="text-lg font-bold">Your Cart</span>
                                    {cart.length > 0 && (
                                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold">
                                            {cartCount} item{cartCount !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowCart(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                                {cart.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center pt-10 text-center">
                                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                                            <ShoppingCart size={34} className="text-[#2f6b45]" />
                                        </div>
                                        <p className="mb-1 text-lg font-bold text-slate-900">Cart is empty</p>
                                        <p className="text-sm text-slate-500">
                                            Add products from the portal listings.
                                        </p>
                                        <button
                                            onClick={() => setShowCart(false)}
                                            className="mt-5 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                                        >
                                            Browse Products
                                        </button>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div
                                            key={item.productId}
                                            className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                        >
                                            <div className="flex h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-green-50 to-slate-100">
                                                {item.product?.imageUrl ? (
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package size={22} className="text-slate-400" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                                                        {item.product?.name || item.name}
                                                    </h4>
                                                    <span className="shrink-0 text-sm font-bold text-slate-900">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>

                                                <p className="mb-3 mt-1 text-[11px] font-semibold text-slate-500">
                                                    ₹{item.price} / {item.product?.unit || 'kg'}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white"
                                                        onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                                                    >
                                                        <Minus size={12} />
                                                    </button>

                                                    <span className="min-w-[20px] text-center text-sm font-bold text-slate-900">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white"
                                                        onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                                                    >
                                                        <Plus size={12} />
                                                    </button>

                                                    <button
                                                        onClick={() => removeCartItem(item.productId)}
                                                        className="ml-auto rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
                                    <div className="mb-1 flex justify-between">
                                        <span className="text-sm text-slate-500">
                                            Subtotal ({cartCount} items)
                                        </span>
                                        <span className="text-lg font-bold text-slate-900">
                                            ₹{cartTotal.toLocaleString()}
                                        </span>
                                    </div>

                                    <p className="mb-4 text-[11px] text-slate-500">
                                        Taxes and delivery calculated at checkout
                                    </p>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading}
                                        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {checkoutLoading ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Proceed to Checkout
                                                <ChevronRight size={17} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Marketplace;