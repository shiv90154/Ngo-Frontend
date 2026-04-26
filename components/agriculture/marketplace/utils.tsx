// components/marketplace/utils.ts
import { Product, CartItem } from "./types";

export const toNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
};

export const normalizeCartItem = (
  item: Partial<CartItem> & { product?: Product | null; productId?: string },
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