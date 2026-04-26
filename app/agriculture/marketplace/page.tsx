// app/agriculture/marketplace/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MarketplaceLayout } from "@/components/agriculture/marketplace/MarketplaceLayout";
import { ProductsList } from "@/components/agriculture/marketplace/ProductsList";
import { CartPage } from "@/components/agriculture/marketplace/CartPage";
import Orders from "@/components/agriculture/marketplace/Orders";
import { Product, CartItem } from "@/components/agriculture/marketplace/types";
import { toNumber, getStoredToken, normalizeCartItem } from "@/components/agriculture/marketplace/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface MarketplaceProps {
  productsEndpoint?: string;
  cartEndpoint?: string;
  userAddressesEndpoint?: string;
  token?: string | null;
}

export default function Marketplace({
  productsEndpoint = `${API_BASE}/agriculture/products`,
  cartEndpoint = `${API_BASE}/agriculture/cart`,
  userAddressesEndpoint = `${API_BASE}/agriculture/addresses`,
  token = null,
}: MarketplaceProps) {
  const router = useRouter();

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Auth helpers
  const getAuthHeaders = (): { Authorization: string } | undefined => {
    const authToken = token || getStoredToken();
    return authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
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

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(productsEndpoint);
      if (!data.success) throw new Error(data.message || "Failed to fetch");
      const safeProducts: Product[] = Array.isArray(data.data) ? data.data : [];
      setProducts(safeProducts);
      setCategories([...new Set(safeProducts.map((p) => p.category).filter(Boolean) as string[])]);
    } catch (err) {
      console.error(err);
      setError("Unable to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const { data } = await axios.get(cartEndpoint, { headers });
      if (data.success) {
        const safeCart = Array.isArray(data.data) ? data.data.map((item: any) => normalizeCartItem(item)) : [];
        setCart(safeCart);
      }
    } catch (err) {
      if ((err as AxiosError).response?.status === 401) {
        localStorage.removeItem("token");
        setCart([]);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // Cart actions (to be passed to ProductsList and CartPage)
  const addToCart = async (product: Product, quantity: number) => {
    const headers = requireAuth();
    if (!headers) return;
    const productId = product.id ?? product._id;
    if (!productId) {
      toast.error("Invalid product");
      return;
    }
    const safeQty = Math.max(1, Math.floor(toNumber(quantity, 1)));
    const stock = toNumber(product.quantity, 0);
    const price = toNumber(product.price, 0);
    if (safeQty > stock) {
      toast.error(`Only ${stock} ${product.unit || "items"} available`);
      return;
    }
    const existing = cart.find((i) => String(i.productId) === String(productId));
    const existingQty = existing ? toNumber(existing.quantity, 0) : 0;
    if (existingQty + safeQty > stock) {
      toast.error(`You already have ${existingQty}. Only ${stock - existingQty} more allowed.`);
      return;
    }
    if (existing) {
      await updateCartItem(String(productId), existingQty + safeQty);
      toast.success(`Added ${safeQty} more ${product.name}`);
      return;
    }
    try {
      const { data } = await axios.post(
        cartEndpoint,
        { productId: String(productId), quantity: safeQty, price },
        { headers }
      );
      if (!data?.success) throw new Error(data?.message);
      const newItem = normalizeCartItem(
        { ...data.data, product, productId: String(productId), quantity: safeQty, price, name: product.name },
        product
      );
      setCart((prev) => [...prev, newItem]);
      toast.success(`${safeQty} × ${product.name} added`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else toast.error(error.response?.data?.message || "Failed to add");
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    const headers = requireAuth();
    if (!headers) return;
    const safeQty = toNumber(quantity, 0);
    if (safeQty <= 0) {
      // handled by remove
      return;
    }
    try {
      await axios.put(`${cartEndpoint}/${productId}`, { quantity: safeQty }, { headers });
      setCart((prev) =>
        prev.map((item) =>
          String(item.productId) === String(productId)
            ? normalizeCartItem({ ...item, quantity: safeQty }, item.product || null)
            : item
        )
      );
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      } else toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // Derived data
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const matchSearch = p.name?.toLowerCase().includes(term) || p.sellerName?.toLowerCase().includes(term);
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, categoryFilter]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + toNumber(item.price, 0) * toNumber(item.quantity, 0), 0),
    [cart]
  );
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + toNumber(item.quantity, 0), 0), [cart]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      <MarketplaceLayout
        productsContent={
          <ProductsList
            products={products}
            filteredProducts={filteredProducts}
            loading={loading}
            error={error}
            cart={cart}
            onAddToCart={addToCart}
            onRetry={fetchProducts}
          />
        }
        cartContent={<CartPage cart={cart} setCart={setCart} cartTotal={cartTotal} cartCount={cartCount} />}
        ordersContent={<Orders />}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        productsCount={products.length}
        filteredCount={filteredProducts.length}
        categoriesCount={categories.length}
        cartCount={cartCount}
        onLogout={handleLogout}
      />
    </>
  );
}