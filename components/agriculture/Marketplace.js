'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
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

const toNumber = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};

const normalizeCartItem = (item, fallbackProduct = null) => {
    const product = item?.product || fallbackProduct || null;

    return {
        ...item,
        product,
        productId: item?.productId || product?.id || product?._id,
        quantity: toNumber(item?.quantity, 1),
        price: toNumber(item?.price, product?.price ?? 0),
        name: item?.name || product?.name || 'Product'
    };
};

const StatCard = ({ label, value, chip, chipClass }) => (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>
            <p className="text-lg font-bold leading-tight text-slate-800 sm:text-xl">
                {value}
            </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${chipClass}`}>
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

    // Quantity modal state
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [quantityProduct, setQuantityProduct] = useState(null);
    const [quantityInput, setQuantityInput] = useState(1);

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

            const safeProducts = Array.isArray(data.data) ? data.data : [];

            setProducts(safeProducts);
            setCategories([...new Set(safeProducts.map(p => p.category).filter(Boolean))]);
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

            if (data.success) {
                const safeCart = Array.isArray(data.data)
                    ? data.data.map(item => normalizeCartItem(item))
                    : [];
                setCart(safeCart);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    // --- STOCK-VALIDATED ADD TO CART ---
    const addToCart = async (product, quantity = 1) => {
        if (!authToken) {
            toast.warning('Please login to add items to cart');
            router.push('/login');
            return;
        }

        const safeQuantity = Math.max(1, Math.floor(toNumber(quantity, 1)));
        const productId = String(product.id || product._id);
        const availableStock = toNumber(product.quantity, 0);

        if (safeQuantity > availableStock) {
            toast.error(`Only ${availableStock} ${product.unit} available. Cannot add ${safeQuantity}.`);
            return;
        }

        const existing = cart.find(
            item => String(item.productId) === productId
        );
        const existingQuantity = existing ? toNumber(existing.quantity, 0) : 0;

        if (existing && existingQuantity + safeQuantity > availableStock) {
            toast.error(`You already have ${existingQuantity} in cart. Only ${availableStock - existingQuantity} more available.`);
            return;
        }

        if (existing) {
            await updateCartItem(productId, existingQuantity + safeQuantity);
            toast.success(`Added ${safeQuantity} more ${product.name} to cart`);
            return;
        }

        try {
            const payload = {
                productId,
                quantity: safeQuantity,
                price: toNumber(product.price, 0)
            };

            const { data } = await axios.post(cartEndpoint, payload, {
                headers: authHeaders
            });

            if (data.success) {
                const normalized = normalizeCartItem(
                    {
                        ...data.data,
                        product,
                        productId,
                        quantity: safeQuantity, // force selected quantity
                        price: toNumber(product.price, 0),
                        name: product.name
                    },
                    product
                );

                setCart(prev => [...prev, normalized]);
                toast.success(`${safeQuantity} × ${product.name} added to cart`);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to add to cart');
        }
    };

    const updateCartItem = async (productId, quantity) => {
        const safeQuantity = toNumber(quantity, 0);

        if (safeQuantity <= 0) {
            removeCartItem(productId);
            return;
        }

        try {
            await axios.put(
                `${cartEndpoint}/${productId}`,
                { quantity: safeQuantity },
                { headers: authHeaders }
            );

            setCart(prev =>
                prev.map(item =>
                    item.productId === productId
                        ? normalizeCartItem({ ...item, quantity: safeQuantity }, item.product)
                        : item
                )
            );
        } catch (err) {
            console.error(err);
            toast.error('Failed to update cart');
        }
    };

    const removeCartItem = async (productId) => {
        try {
            await axios.delete(`${cartEndpoint}/${productId}`, {
                headers: authHeaders
            });

            setCart(prev => prev.filter(item => item.productId !== productId));
            toast.success('Item removed');
        } catch (err) {
            console.error(err);
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

    // Quantity modal handlers
    const openQuantityModal = (product) => {
        setQuantityProduct(product);
        setQuantityInput(1);
        setShowQuantityModal(true);
    };

    const closeQuantityModal = () => {
        setShowQuantityModal(false);
        setQuantityProduct(null);
        setQuantityInput(1);
    };

    const handleQuantityConfirm = () => {
        if (!quantityProduct) return;
        const qty = Math.max(1, Math.floor(toNumber(quantityInput, 1)));
        addToCart(quantityProduct, qty);
        closeQuantityModal();
    };

    // Helper to get max available for modal (respecting current cart)
    const getMaxAvailableForProduct = (product) => {
        const availableStock = toNumber(product?.quantity, 0);
        const productId = product?.id || product?._id;
        const existingCartItem = cart.find(item => item.productId === productId);
        const alreadyInCart = existingCartItem ? toNumber(existingCartItem.quantity, 0) : 0;
        // User can add up to (stock - alreadyInCart)
        return Math.max(0, availableStock - alreadyInCart);
    };

    const filteredProducts = useMemo(() => {
        const s = searchTerm.toLowerCase();

        return products.filter(p => {
            const matchSearch =
                p.name?.toLowerCase().includes(s) ||
                p.sellerName?.toLowerCase().includes(s);

            const matchCat =
                categoryFilter === 'all' || p.category === categoryFilter;

            return matchSearch && matchCat;
        });
    }, [products, searchTerm, categoryFilter]);

    const cartTotal = useMemo(
        () =>
            cart.reduce(
                (sum, item) => sum + toNumber(item.price, 0) * toNumber(item.quantity, 0),
                0
            ),
        [cart]
    );

    const cartCount = useMemo(
        () => cart.reduce((sum, item) => sum + toNumber(item.quantity, 0), 0),
        [cart]
    );

    if (loading && !products.length) {
        return (
            <>
                <ToastContainer position="top-right" />
                <div className="min-h-screen bg-slate-100">
                    <div className="mx-auto max-w-7xl space-y-3 px-3 py-0 sm:px-4">
                        <div className="h-16 animate-pulse rounded-none bg-slate-200 sm:rounded-b-2xl" />
                        <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />
                                    <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                                    <div className="h-9 animate-pulse rounded-xl bg-slate-200" />
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
                toastStyle={{ borderRadius: 12, fontSize: 13 }}
            />

            <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-800">
                <div className="mx-auto max-w-7xl px-0 py-0 sm:px-3">
                    <div className="rounded-none border-y border-slate-200 bg-gradient-to-r from-white to-slate-50 px-3 py-3 shadow-sm sm:rounded-b-2xl sm:border sm:px-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] text-white shadow-sm">
                                    <ShieldCheck size={18} />
                                </div>

                                <div className="min-w-0">
                                    <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                                        Marketplace
                                    </h1>
                                    <p className="text-[11px] text-slate-500 sm:text-xs">
                                        Verified agricultural listings
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                                    <CheckCircle size={12} />
                                    Verified
                                </span>

                                <button
                                    onClick={() => setShowCart(true)}
                                    className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 sm:text-sm"
                                >
                                    <ShoppingCart size={15} />
                                    My Cart
                                    {cartCount > 0 && (
                                        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-amber-600 px-1 text-[10px] font-bold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 px-3 py-0 sm:px-1 sm:py-4">
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-sm">
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.3fr_.55fr]">
                                <div className="relative">
                                    <Search
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search products or sellers"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                    />
                                </div>

                                <div className="relative">
                                    <Filter
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                    />
                                    <select
                                        value={categoryFilter}
                                        onChange={e => setCategoryFilter(e.target.value)}
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-2 grid grid-cols-3 gap-2">
                                <StatCard
                                    label="Products"
                                    value={products.length}
                                    chip="All"
                                    chipClass="border-green-200 bg-green-50 text-green-700"
                                />
                                <StatCard
                                    label="Results"
                                    value={filteredProducts.length}
                                    chip="Live"
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
                                <AlertCircle size={36} className="mx-auto mb-3 text-red-600" />
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
                                <Leaf size={42} className="mx-auto mb-3 text-slate-400" />
                                <p className="text-sm text-slate-500">
                                    No products found matching your criteria.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                                {filteredProducts.map(product => {
                                    const productId = product.id || product._id;
                                    const inCart = cart.some(i => i.productId === productId);
                                    const inWish = wishlist.includes(productId);
                                    const availableStock = toNumber(product.quantity, 0);
                                    const isOutOfStock = availableStock === 0;

                                    return (
                                        <div
                                            key={productId}
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <div className="relative flex h-32 items-center justify-center bg-gradient-to-b from-green-50 to-slate-100 sm:h-36">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package size={38} className="text-slate-400" />
                                                )}

                                                <button
                                                    onClick={() => toggleWishlist(productId)}
                                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 shadow-sm"
                                                >
                                                    <Heart
                                                        size={14}
                                                        color={inWish ? '#d14f45' : '#6b7280'}
                                                        fill={inWish ? '#d14f45' : 'none'}
                                                    />
                                                </button>

                                                {product.isOrganic && (
                                                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                                                        <Leaf size={9} />
                                                        Organic
                                                    </span>
                                                )}

                                                {inCart && (
                                                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                                                        <CheckCircle size={9} />
                                                        In cart
                                                    </span>
                                                )}

                                                {isOutOfStock && (
                                                    <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[10px] font-bold text-white backdrop-blur-sm">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1 p-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="line-clamp-2 min-h-[10px] text-sm font-bold leading-snug text-slate-900 sm:text-[15px]">
                                                        {product.name}
                                                    </h3>

                                                    <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                                        <Star size={10} fill="#b45309" />
                                                        {product.rating || '4.5'}
                                                    </div>
                                                </div>

                                                <p className="truncate text-[11px] font-semibold text-slate-500">
                                                    by {product.sellerName || 'Certified Dealer'}
                                                </p>

                                                <div className="flex items-end gap-1">
                                                    <IndianRupee size={13} className="text-slate-600" />
                                                    <span className="text-lg font-bold leading-none text-slate-900 sm:text-xl">
                                                        {toNumber(product.price, 0)}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500">/{product.unit}</span>
                                                </div>

                                                <div className="space-y-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-2.5">
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                                        <MapPin size={11} />
                                                        <span className="truncate">{product.location || 'Local'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                                        <Package size={11} />
                                                        {availableStock} {product.unit} left
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => !isOutOfStock && openQuantityModal(product)}
                                                    disabled={isOutOfStock}
                                                    className={`flex min-h-[38px] w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 sm:text-sm ${isOutOfStock
                                                        ? 'cursor-not-allowed bg-slate-400'
                                                        : 'bg-gradient-to-b from-[#2f6b45] to-[#234d36]'
                                                        }`}
                                                >
                                                    {inCart ? (
                                                        <>
                                                            <Plus size={14} />
                                                            Add More
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingCart size={14} />
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
                </div>

                {/* Quantity Selection Modal with Stock Limit */}
                {showQuantityModal && quantityProduct && (() => {
                    const maxAvailable = getMaxAvailableForProduct(quantityProduct);
                    const isDisabled = !quantityInput || quantityInput <= 0 || quantityInput > maxAvailable;
                    return (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
                            onClick={closeQuantityModal}
                        >
                            <div
                                className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Select Quantity
                                    </h3>
                                    <button
                                        onClick={closeQuantityModal}
                                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <p className="mb-3 text-sm text-slate-600">
                                    {quantityProduct.name}
                                </p>

                                <div className="mb-4">
                                    <label className="mb-1 block text-xs font-semibold text-slate-500">
                                        Quantity ({quantityProduct.unit})
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={maxAvailable}
                                        step="1"
                                        value={quantityInput}
                                        onChange={e => setQuantityInput(e.target.value)}
                                        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-center text-lg font-bold text-slate-900 outline-none focus:border-[#2f6b45] focus:ring-2 focus:ring-[#2f6b45]/20"
                                    />
                                    <div className="mt-2 flex justify-between text-[11px]">
                                        <span className="text-slate-400">
                                            Available: {maxAvailable} {quantityProduct.unit}
                                        </span>
                                        {quantityInput > maxAvailable && (
                                            <span className="text-red-500">
                                                Exceeds available stock
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={closeQuantityModal}
                                        className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={isDisabled}
                                        onClick={handleQuantityConfirm}
                                        className="flex-1 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {showCart && (
                    <div
                        className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm"
                        onClick={e => {
                            if (e.target === e.currentTarget) setShowCart(false);
                        }}
                    >
                        <div className="flex h-full w-full max-w-[400px] flex-col border-l border-slate-200 bg-slate-50 shadow-2xl sm:max-w-[420px]">
                            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-4 py-3 text-white">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart size={17} />
                                    <span className="text-base font-bold">Your Cart</span>
                                    {cart.length > 0 && (
                                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
                                            {cartCount} item{cartCount !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowCart(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto p-3">
                                {cart.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center pt-10 text-center">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                                            <ShoppingCart size={28} className="text-[#2f6b45]" />
                                        </div>
                                        <p className="mb-1 text-base font-bold text-slate-900">Cart is empty</p>
                                        <p className="text-sm text-slate-500">
                                            Add products from the portal listings.
                                        </p>
                                        <button
                                            onClick={() => setShowCart(false)}
                                            className="mt-5 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
                                        >
                                            Browse Products
                                        </button>
                                    </div>
                                ) : (
                                    cart.map(item => {
                                        const productStock = item.product?.quantity ? toNumber(item.product.quantity, 0) : Infinity;
                                        return (
                                            <div
                                                key={item._id || item.productId}
                                                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                                            >
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-green-50 to-slate-100">
                                                    {item.product?.imageUrl ? (
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package size={20} className="text-slate-400" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                                                            {item.product?.name || item.name}
                                                        </h4>
                                                        <span className="shrink-0 text-sm font-bold text-slate-900">
                                                            ₹{(toNumber(item.price, 0) * toNumber(item.quantity, 0)).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <p className="mb-2 mt-1 text-[11px] font-semibold text-slate-500">
                                                        ₹{toNumber(item.price, 0)} / {item.product?.unit || 'kg'}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <button
                                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white"
                                                            onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                                                        >
                                                            <Minus size={11} />
                                                        </button>

                                                        <span className="min-w-[18px] text-center text-sm font-bold text-slate-900">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white"
                                                            onClick={() => {
                                                                const newQty = item.quantity + 1;
                                                                if (newQty <= productStock) {
                                                                    updateCartItem(item.productId, newQty);
                                                                } else {
                                                                    toast.error(`Only ${productStock} available in stock.`);
                                                                }
                                                            }}
                                                        >
                                                            <Plus size={11} />
                                                        </button>

                                                        <button
                                                            onClick={() => removeCartItem(item.productId)}
                                                            className="ml-auto rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    {item.quantity >= productStock && productStock !== Infinity && (
                                                        <p className="mt-1 text-[10px] text-red-500">
                                                            Max stock reached
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
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
                                        className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {checkoutLoading ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Proceed to Checkout
                                                <ChevronRight size={16} />
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