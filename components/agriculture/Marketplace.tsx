"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ShoppingCart,
  Search,
  Filter,
  IndianRupee,
  Package,
  Plus,
  Minus,
  X,
  Leaf,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  id?: string;
  _id?: string;
  name: string;
  category?: string;
  price?: number | string;
  quantity?: number | string;
  unit?: string;
  imageUrl?: string;
  location?: string;
  sellerName?: string;
  isOrganic?: boolean;
};

type CartItem = {
  _id?: string;
  product?: Product | null;
  productId: string;
  quantity: number;
  price: number;
  name: string;
};

type Address = {
  _id: string;
  fullName?: string;
  phone?: string;
  addressLine?: string;
  street?: string;
  city: string;
  state?: string;
  block?: string;
  landmark?: string;
  pincode?: string;
};

type ManualAddress = {
  addressLine: string;
  city: string;
  state: string;
  landmark: string;
  pincode: string;
};

type MarketplaceProps = {
  productsEndpoint?: string;
  cartEndpoint?: string;
  checkoutEndpoint?: string;
  userAddressesEndpoint?: string;
  token?: string | null;
};

type StatCardProps = {
  label: string;
  value: number;
  chip: string;
  chipClass: string;
};

const toNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    return null;
  }

  return token;
};

const normalizeCartItem = (
  item: Partial<CartItem> & {
    product?: Product | null;
    productId?: string;
  },
  fallbackProduct: Product | null = null
): CartItem => {
  const product = item.product || fallbackProduct || null;

  return {
    _id: item._id,
    product,
    productId: item.productId || product?.id || product?._id || "",
    quantity: toNumber(item.quantity, 1),
    price: toNumber(item.price, product?.price ?? 0),
    name: item.name || product?.name || "Product",
  };
};

const StatCard = ({
  label,
  value,
  chip,
  chipClass,
}: StatCardProps): React.JSX.Element => (
  <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-lg font-bold leading-tight text-slate-800 sm:text-xl">
        {value}
      </p>
    </div>

    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${chipClass}`}
    >
      {chip}
    </span>
  </div>
);

export default function Marketplace({
  productsEndpoint = `${API_BASE}/agriculture/products`,
  cartEndpoint = `${API_BASE}/agriculture/cart`,
  checkoutEndpoint = `${API_BASE}/agriculture/checkout`,
  userAddressesEndpoint = `${API_BASE}/agriculture/addresses`,
  token = null,
}: MarketplaceProps): React.JSX.Element {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [manualAddress, setManualAddress] = useState<ManualAddress>({
    addressLine: "",
    city: "",
    state: "",
    landmark: "",
    pincode: "",
  });

  const [showQuantityModal, setShowQuantityModal] = useState<boolean>(false);
  const [quantityProduct, setQuantityProduct] = useState<Product | null>(null);
  const [quantityInput, setQuantityInput] = useState<number | string>(1);

  const getAuthHeaders = (): { Authorization: string } | undefined => {
    const authToken = token || getStoredToken();

    if (!authToken) return undefined;

    return {
      Authorization: `Bearer ${authToken}`,
    };
  };

  const requireAuth = (): { Authorization: string } | null => {
    const headers = getAuthHeaders();

    if (!headers) {
      toast.warning("Please login first");
      router.push("/login");
      return null;
    }

    return headers;
  };

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log("here");
      setError(null);
      const { data } = await axios.get(productsEndpoint);
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch products");
      }
      const safeProducts: Product[] = Array.isArray(data.data) ? data.data : [];
      setProducts(safeProducts);
      setCategories([
        ...new Set(
          safeProducts.map((product) => product.category).filter(Boolean) as string[]
        ),
      ]);
    } catch (err) {
      console.error("Product fetch failed:", err);
      setError("Unable to load products. Please try again later.");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (): Promise<void> => {
    const headers = getAuthHeaders();

    if (!headers) return;

    try {
      const { data } = await axios.get(cartEndpoint, { headers });

      if (data.success) {
        const safeCart: CartItem[] = Array.isArray(data.data)
          ? data.data.map((item: Partial<CartItem>) => normalizeCartItem(item))
          : [];

        setCart(safeCart);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setCart([]);
        return;
      }

      console.error("Cart fetch failed:", err);
    }
  };

  const fetchUserAddresses = async (): Promise<void> => {
    const headers = getAuthHeaders();

    if (!headers) return;

    try {
      const { data } = await axios.get(userAddressesEndpoint, { headers });

      if (data.success && Array.isArray(data.data)) {
        setSavedAddresses(data.data);

        if (data.data.length > 0) {
          setSelectedAddressId(data.data[0]._id);
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setSavedAddresses([]);
        setSelectedAddressId("");
        return;
      }

      console.error("Failed to fetch addresses:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchUserAddresses();
  }, []);

 const addToCart = async (
  product: Product,
  quantity: number | string = 1
): Promise<void> => {
  const headers = requireAuth();
  if (!headers) return;

  const productId = product.id ?? product._id;

  if (!productId) {
    toast.error("Invalid product");
    return;
  }

  const safeQuantity = Math.max(1, Math.floor(toNumber(quantity, 1)));
  const availableStock = toNumber(product.quantity, 0);
  const productPrice = toNumber(product.price, 0);

  if (safeQuantity > availableStock) {
    toast.error(
      `Only ${availableStock} ${product.unit || "items"} available. Cannot add ${safeQuantity}.`
    );
    return;
  }

  const existingCartItem = cart.find(
    (item) => String(item.productId) === String(productId)
  );

  const existingQuantity = existingCartItem
    ? toNumber(existingCartItem.quantity, 0)
    : 0;

  const totalQuantity = existingQuantity + safeQuantity;

  if (totalQuantity > availableStock) {
    toast.error(
      `You already have ${existingQuantity} in cart. Only ${
        availableStock - existingQuantity
      } more available.`
    );
    return;
  }

  if (existingCartItem) {
    await updateCartItem(String(productId), totalQuantity);
    toast.success(`Added ${safeQuantity} more ${product.name} to cart`);
    return;
  }

  try {
    const payload = {
      productId: String(productId),
      quantity: safeQuantity,
      price: productPrice,
    };

    const { data } = await axios.post(cartEndpoint, payload, { headers });

    if (!data?.success) {
      toast.error(data?.message || "Failed to add to cart");
      return;
    }

    const normalizedCartItem = normalizeCartItem(
      {
        ...data.data,
        product,
        productId: String(productId),
        quantity: safeQuantity,
        price: productPrice,
        name: product.name,
      },
      product
    );

    setCart((prev) => [...prev, normalizedCartItem]);

    toast.success(`${safeQuantity} × ${product.name} added to cart`);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.warning("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    toast.error(error.response?.data?.message || "Failed to add to cart");
  }
};
  const updateCartItem = async (
    productId: string,
    quantity: number
  ): Promise<void> => {
    const headers = requireAuth();

    if (!headers) return;

    const safeQuantity = toNumber(quantity, 0);

    if (safeQuantity <= 0) {
      await removeCartItem(productId);
      return;
    }

    try {
      await axios.put(
        `${cartEndpoint}/${productId}`,
        { quantity: safeQuantity },
        { headers }
      );

      setCart((prev) =>
        prev.map((item) =>
          String(item.productId) === String(productId)
            ? normalizeCartItem({ ...item, quantity: safeQuantity }, item.product || null)
            : item
        )
      );
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.warning("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  const removeCartItem = async (productId: string): Promise<void> => {
    const headers = requireAuth();

    if (!headers) return;

    try {
      await axios.delete(`${cartEndpoint}/${productId}`, { headers });

      setCart((prev) =>
        prev.filter((item) => String(item.productId) !== String(productId))
      );

      toast.success("Item removed");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.warning("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleCheckout = (): void => {
    if (!cart.length) {
      toast.warning("Your cart is empty");
      return;
    }

    const headers = requireAuth();

    if (!headers) return;

    setShowCart(false);
    setShowAddressModal(true);
  };

  const placeOrder = async (
    deliveryAddress: Address | ManualAddress
  ): Promise<void> => {
    const headers = requireAuth();

    if (!headers) return;

    setCheckoutLoading(true);

    try {
      const { data } = await axios.post(
        checkoutEndpoint,
        { deliveryAddress },
        { headers }
      );

      if (!data.success) {
        throw new Error(data.message || "Checkout failed");
      }

      toast.success("Order placed successfully");
      setCart([]);
      setShowCart(false);
      setShowAddressModal(false);
      router.push("/agriculture/marketplace/orders");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.warning("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleUseSavedAddress = (): void => {
    const addr = savedAddresses.find((address) => address._id === selectedAddressId);

    if (!addr) {
      toast.error("Please select a valid address");
      return;
    }

    placeOrder(addr);
  };

  const handleManualAddressSubmit = (): void => {
    if (!manualAddress.addressLine || !manualAddress.city || !manualAddress.state) {
      toast.error("Address line, city, and state are required");
      return;
    }

    placeOrder(manualAddress);
  };

  const openQuantityModal = (product: Product): void => {
    setQuantityProduct(product);
    setQuantityInput(1);
    setShowQuantityModal(true);
  };

  const closeQuantityModal = (): void => {
    setShowQuantityModal(false);
    setQuantityProduct(null);
    setQuantityInput(1);
  };

  const handleQuantityConfirm = (): void => {
    if (!quantityProduct) return;

    const qty = Math.max(1, Math.floor(toNumber(quantityInput, 1)));

    addToCart(quantityProduct, qty);
    closeQuantityModal();
  };

  const getMaxAvailableForProduct = (product: Product): number => {
    const availableStock = toNumber(product.quantity, 0);
    const productId = product.id || product._id;

    const existingCartItem = cart.find(
      (item) => String(item.productId) === String(productId)
    );

    const alreadyInCart = existingCartItem
      ? toNumber(existingCartItem.quantity, 0)
      : 0;

    return Math.max(0, availableStock - alreadyInCart);
  };

  const filteredProducts = useMemo<Product[]>(() => {
    const search = searchTerm.toLowerCase();

    return products.filter((product) => {
      const matchSearch =
        product.name?.toLowerCase().includes(search) ||
        product.sellerName?.toLowerCase().includes(search);

      const matchCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return Boolean(matchSearch && matchCategory);
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
              {[...Array(10)].map((_, index) => (
                <div key={index} className="space-y-2">
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
                  type="button"
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#2f6b45] focus:ring-4 focus:ring-[#2f6b45]/10"
                  >
                    <option value="all">All Categories</option>

                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
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
                  type="button"
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
                {filteredProducts.map((product) => {
                  const productId = product.id || product._id || "";
                  const inCart = cart.some(
                    (item) => String(item.productId) === String(productId)
                  );

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
                        <h3 className="line-clamp-2 min-h-[10px] text-sm font-bold leading-snug text-slate-900 sm:text-[15px]">
                          {product.name}
                        </h3>

                        <p className="truncate text-[11px] font-semibold text-slate-500">
                          by {product.sellerName || "Certified Dealer"}
                        </p>

                        <div className="flex items-end gap-1">
                          <IndianRupee size={13} className="text-slate-600" />
                          <span className="text-lg font-bold leading-none text-slate-900 sm:text-xl">
                            {toNumber(product.price, 0)}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            /{product.unit || "kg"}
                          </span>
                        </div>

                        <div className="space-y-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-2.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <MapPin size={11} />
                            <span className="truncate">
                              {product.location || "Local"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Package size={11} />
                            {availableStock} {product.unit || "items"} left
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => !isOutOfStock && openQuantityModal(product)}
                          disabled={isOutOfStock}
                          className={`flex min-h-[38px] w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 sm:text-sm ${
                            isOutOfStock
                              ? "cursor-not-allowed bg-slate-400"
                              : "bg-gradient-to-b from-[#2f6b45] to-[#234d36]"
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

        {showQuantityModal && quantityProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
            onClick={closeQuantityModal}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Select Quantity
                </h3>

                <button
                  type="button"
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
                  Quantity ({quantityProduct.unit || "items"})
                </label>

                <input
                  type="number"
                  min="1"
                  max={getMaxAvailableForProduct(quantityProduct)}
                  step="1"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-center text-lg font-bold text-slate-900 outline-none focus:border-[#2f6b45] focus:ring-2 focus:ring-[#2f6b45]/20"
                />

                <div className="mt-2 flex justify-between text-[11px]">
                  <span className="text-slate-400">
                    Available: {getMaxAvailableForProduct(quantityProduct)}{" "}
                    {quantityProduct.unit || "items"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeQuantityModal}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    !quantityInput ||
                    toNumber(quantityInput, 0) <= 0 ||
                    toNumber(quantityInput, 0) >
                    getMaxAvailableForProduct(quantityProduct)
                  }
                  onClick={handleQuantityConfirm}
                  className="flex-1 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddressModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !checkoutLoading && setShowAddressModal(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Delivery Address
                </h3>

                {!checkoutLoading && (
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {savedAddresses.length > 0 && (
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select a saved address
                  </label>

                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-[#2f6b45] focus:ring-2 focus:ring-[#2f6b45]/20"
                    disabled={checkoutLoading}
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr._id} value={addr._id}>
                        {addr.addressLine || addr.street}, {addr.city}{" "}
                        {addr.pincode ? `- ${addr.pincode}` : ""}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleUseSavedAddress}
                    disabled={checkoutLoading}
                    className="mt-3 w-full rounded-xl bg-[#2f6b45] py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {checkoutLoading
                      ? "Placing order..."
                      : "Deliver to this address"}
                  </button>

                  <hr className="my-4" />
                  <p className="text-center text-xs text-slate-400">OR</p>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">
                  Enter new address
                </h4>

                <input
                  type="text"
                  placeholder="Address Line *"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-[#2f6b45] focus:ring-2 focus:ring-[#2f6b45]/20"
                  value={manualAddress.addressLine}
                  onChange={(e) =>
                    setManualAddress({
                      ...manualAddress,
                      addressLine: e.target.value,
                    })
                  }
                  disabled={checkoutLoading}
                />

                <input
                  type="text"
                  placeholder="City *"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-[#2f6b45] focus:ring-2 focus:ring-[#2f6b45]/20"
                  value={manualAddress.city}
                  onChange={(e) =>
                    setManualAddress({
                      ...manualAddress,
                      city: e.target.value,
                    })
                  }
                  disabled={checkoutLoading}
                />

                <input
                  type="text"
                  placeholder="State *"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-[#2f6b45] focus:ring-2 focus:ring-[#2f6b45]/20"
                  value={manualAddress.state}
                  onChange={(e) =>
                    setManualAddress({
                      ...manualAddress,
                      state: e.target.value,
                    })
                  }
                  disabled={checkoutLoading}
                />

                <input
                  type="text"
                  placeholder="Landmark"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-[#2f6b45] focus:ring-2 focus:ring-[#2f6b45]/20"
                  value={manualAddress.landmark}
                  onChange={(e) =>
                    setManualAddress({
                      ...manualAddress,
                      landmark: e.target.value,
                    })
                  }
                  disabled={checkoutLoading}
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-[#2f6b45] focus:ring-2 focus:ring-[#2f6b45]/20"
                  value={manualAddress.pincode}
                  onChange={(e) =>
                    setManualAddress({
                      ...manualAddress,
                      pincode: e.target.value,
                    })
                  }
                  disabled={checkoutLoading}
                />

                <button
                  type="button"
                  onClick={handleManualAddressSubmit}
                  disabled={checkoutLoading}
                  className="w-full rounded-xl bg-[#2f6b45] py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {checkoutLoading ? "Placing order..." : "Use this address"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showCart && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm"
            onClick={(e) => {
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
                      {cartCount} item{cartCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <button
                  type="button"
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

                    <p className="mb-1 text-base font-bold text-slate-900">
                      Cart is empty
                    </p>

                    <p className="text-sm text-slate-500">
                      Add products from the portal listings.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowCart(false)}
                      className="mt-5 rounded-xl bg-gradient-to-b from-[#2f6b45] to-[#234d36] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const productStock =
                      item.product?.quantity !== undefined
                        ? toNumber(item.product.quantity, 0)
                        : Infinity;

                    return (
                      <div
                        key={item._id || item.productId}
                        className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-green-50 to-slate-100">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.name}
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
                              ₹
                              {(
                                toNumber(item.price, 0) *
                                toNumber(item.quantity, 0)
                              ).toLocaleString()}
                            </span>
                          </div>

                          <p className="mb-2 mt-1 text-[11px] font-semibold text-slate-500">
                            ₹{toNumber(item.price, 0)} /{" "}
                            {item.product?.unit || "kg"}
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white"
                              onClick={() =>
                                updateCartItem(item.productId, item.quantity - 1)
                              }
                            >
                              <Minus size={11} />
                            </button>

                            <span className="min-w-[18px] text-center text-sm font-bold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white"
                              onClick={() => {
                                const newQty = item.quantity + 1;

                                if (newQty <= productStock) {
                                  updateCartItem(item.productId, newQty);
                                } else {
                                  toast.error(`Only ${productStock} available.`);
                                }
                              }}
                            >
                              <Plus size={11} />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeCartItem(item.productId)}
                              className="ml-auto rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600"
                            >
                              Remove
                            </button>
                          </div>
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
                    type="button"
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
}