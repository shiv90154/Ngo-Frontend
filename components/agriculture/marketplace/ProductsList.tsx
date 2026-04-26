// components/agriculture/marketplace/ProductsList.tsx
"use client";

import React, { useState } from "react";
import {
  IndianRupee,
  Package,
  Plus,
  ShoppingCart,
  X,
  Leaf,
  CheckCircle,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { Product, CartItem } from "./types";
import { toNumber } from "./utils";

interface ProductsListProps {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  cart: CartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onRetry: () => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  filteredProducts,
  loading,
  error,
  cart,
  onAddToCart,
  onRetry,
}) => {
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantityProduct, setQuantityProduct] = useState<Product | null>(null);
  const [quantityInput, setQuantityInput] = useState<number | string>(1);

  const getMaxAvailable = (product: Product): number => {
    const stock = toNumber(product.quantity, 0);
    const productId = product.id || product._id;
    const inCart = cart.find((item) => String(item.productId) === String(productId));
    const already = inCart ? toNumber(inCart.quantity, 0) : 0;
    return Math.max(0, stock - already);
  };

  const openQtyModal = (product: Product) => {
    const maxAvailable = getMaxAvailable(product);
    if (maxAvailable === 0) {
      toast.warning(`Sorry, ${product.name} is out of stock`);
      return;
    }
    setQuantityProduct(product);
    setQuantityInput(1);
    setShowQuantityModal(true);
  };

  const closeQtyModal = () => {
    setShowQuantityModal(false);
    setQuantityProduct(null);
    setQuantityInput(1);
  };

  const confirmQuantity = () => {
    if (!quantityProduct) return;
    const qty = Math.max(1, Math.floor(toNumber(quantityInput, 1)));
    const maxAvailable = getMaxAvailable(quantityProduct);
    
    if (qty > maxAvailable) {
      toast.error(`Only ${maxAvailable} ${quantityProduct.unit || "items"} available`);
      return;
    }
    
    if (qty < 1) {
      toast.warning("Please select at least 1 item");
      return;
    }
    
    onAddToCart(quantityProduct, qty);
    closeQtyModal();
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    
    if (value === "") {
      setQuantityInput("");
      return;
    }
    
    if (isNaN(numValue)) {
      toast.warning("Please enter a valid number");
      return;
    }
    
    if (numValue < 1) {
      toast.warning("Quantity cannot be less than 1");
      setQuantityInput(1);
      return;
    }
    
    if (quantityProduct && numValue > getMaxAvailable(quantityProduct)) {
      toast.error(`Only ${getMaxAvailable(quantityProduct)} ${quantityProduct.unit || "items"} available`);
      setQuantityInput(getMaxAvailable(quantityProduct));
      return;
    }
    
    setQuantityInput(numValue);
  };

  if (loading && !filteredProducts.length) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl bg-white p-3 shadow">
            <div className="h-32 animate-pulse rounded-xl bg-blue-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-blue-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-blue-100" />
            <div className="h-10 animate-pulse rounded-lg bg-blue-100" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    toast.error(error);
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <p className="mb-4 text-red-700">{error}</p>
        <button
          onClick={() => {
            onRetry();
            toast.info("Retrying...");
          }}
          className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center">
        <Leaf className="mx-auto mb-3 h-12 w-12 text-blue-300" />
        <p className="text-slate-500">No products match your search.</p>
        <button
          onClick={() => {
            window.location.reload();
            toast.info("Refreshing products...");
          }}
          className="mt-4 text-sm text-emerald-600 hover:text-emerald-700"
        >
          Refresh products
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => {
          const productId = product.id || product._id || "";
          const inCart = cart.some((item) => String(item.productId) === String(productId));
          const stock = toNumber(product.quantity, 0);
          const outOfStock = stock === 0;
          const maxAvailable = getMaxAvailable(product);

          return (
            <div
              key={productId}
              className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-32 bg-gradient-to-br from-blue-50 to-emerald-50 sm:h-40">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image for ${product.name}`);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-10 w-10 text-blue-300" />
                  </div>
                )}
                {product.isOrganic && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    <Leaf size={10} /> Organic
                  </span>
                )}
                {inCart && (
                  <span className="absolute bottom-2 right-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    In cart
                  </span>
                )}
                {outOfStock && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[10px] font-bold text-white backdrop-blur-sm">
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-bold text-slate-800">{product.name}</h3>
                <p className="mt-1 text-xs text-slate-500">by {product.sellerName || "Local Farmer"}</p>
                <div className="mt-2 flex items-baseline gap-0.5">
                  <IndianRupee className="h-3 w-3 text-slate-500" />
                  <span className="text-xl font-bold text-emerald-700">{toNumber(product.price, 0)}</span>
                  <span className="text-xs text-slate-400">/{product.unit || "kg"}</span>
                </div>

                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{product.location || "Local"}</span>
                  <span className="ml-auto">📦 {stock} left</span>
                </div>

                <button
                  onClick={() => {
                    if (!outOfStock) {
                      if (maxAvailable === 0) {
                        toast.warning(`Sorry, ${product.name} is out of stock`);
                      } else {
                        openQtyModal(product);
                      }
                    } else {
                      toast.error(`${product.name} is currently out of stock`);
                    }
                  }}
                  disabled={outOfStock}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-2 text-xs font-bold text-white transition hover:from-emerald-700 hover:to-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:opacity-50"
                  title={outOfStock ? "Out of stock" : inCart ? "Add more items" : "Add to cart"}
                >
                  {inCart ? <Plus size={14} /> : <ShoppingCart size={14} />}
                  {inCart ? "Add More" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quantity Modal */}
      {showQuantityModal && quantityProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" 
          onClick={closeQtyModal}
        >
          <div 
            className="w-96 rounded-2xl bg-white p-6 shadow-xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Select Quantity</h3>
              <button 
                onClick={closeQtyModal} 
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-4 text-sm text-slate-600">
              {quantityProduct.name}
            </p>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Quantity ({quantityProduct.unit || "items"})
              </label>
              <input
                type="number"
                min={1}
                max={getMaxAvailable(quantityProduct)}
                value={quantityInput}
                onChange={handleQuantityInputChange}
                className="w-full rounded-xl border border-blue-200 p-3 text-center text-lg font-bold focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <p className="mt-2 text-xs text-slate-500">
                Available: {getMaxAvailable(quantityProduct)} {quantityProduct.unit || "items"}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={closeQtyModal} 
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmQuantity}
                disabled={
                  toNumber(quantityInput) <= 0 || 
                  toNumber(quantityInput) > getMaxAvailable(quantityProduct)
                }
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};