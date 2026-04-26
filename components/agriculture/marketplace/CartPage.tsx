// components/agriculture/marketplace/CartPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Minus, Plus, Package, Trash2, MapPin, IndianRupee, X, PlusCircle } from "lucide-react";
import { CartItem, Address, ManualAddress } from "./types";
import { toNumber, getStoredToken } from "./utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface CartPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartTotal: number;
  cartCount: number;
}

export const CartPage: React.FC<CartPageProps> = ({ cart, setCart, cartTotal, cartCount }) => {
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [manualAddress, setManualAddress] = useState<ManualAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phoneNumber: "",
    isDefault: false,
  });

  const getAuthHeaders = () => {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  const requireAuth = () => {
    const headers = getAuthHeaders();
    if (!headers) {
      toast.warning("Please login first");
      return null;
    }
    return headers;
  };

  const fetchAddresses = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const { data } = await axios.get(`${API_BASE}/agriculture/addresses`, { headers });
      if (data.success && Array.isArray(data.data)) {
        setSavedAddresses(data.data);
        if (data.data.length) setSelectedAddressId(data.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const updateCartItem = async (productId: string, quantity: number) => {
    const headers = requireAuth();
    if (!headers) return;
    if (quantity <= 0) {
      await removeCartItem(productId);
      return;
    }
    try {
      await axios.put(`${API_BASE}/agriculture/cart/${productId}`, { quantity }, { headers });
      setCart((prev) =>
        prev.map((item) =>
          String(item.productId) === String(productId) ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const removeCartItem = async (productId: string) => {
    const headers = requireAuth();
    if (!headers) return;
    try {
      await axios.delete(`${API_BASE}/agriculture/cart/${productId}`, { headers });
      setCart((prev) => prev.filter((item) => String(item.productId) !== String(productId)));
      toast.success("Item removed");
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  const resetManualAddress = () => {
    setManualAddress({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      phoneNumber: "",
      isDefault: false,
    });
  };

  const saveNewAddress = async (): Promise<Address | null> => {
    const headers = requireAuth();
    if (!headers) return null;
    try {
      const payload = {
        street: manualAddress.street,
        city: manualAddress.city,
        state: manualAddress.state,
        zipCode: manualAddress.zipCode,
        country: manualAddress.country,
        phoneNumber: manualAddress.phoneNumber,
        isDefault: manualAddress.isDefault,
      };
      
      const { data } = await axios.post(`${API_BASE}/agriculture/addresses`, payload, { headers });
      if (!data.success) throw new Error(data.message);
      const newAddr: Address = data.data;
      setSavedAddresses((prev) => [newAddr, ...prev]);
      setSelectedAddressId(newAddr._id);
      toast.success("Address saved successfully");
      setShowAddressModal(false);
      resetManualAddress();
      return newAddr;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to save address");
      return null;
    }
  };

  const placeOrder = async (address: Address | ManualAddress) => {
    const headers = requireAuth();
    if (!headers) return;
    setCheckoutLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/agriculture/checkout`, { deliveryAddress: address }, { headers });
      if (!data.success) throw new Error(data.message);
      toast.success("Order placed successfully!");
      setCart([]);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      toast.warning("Cart is empty");
      return;
    }
    
    let address: Address | ManualAddress | null = null;
    
    if (selectedAddressId && savedAddresses.length) {
      address = savedAddresses.find((a) => a._id === selectedAddressId);
    }
    
    if (!address) {
      toast.error("Please select or add a delivery address");
      return;
    }
    
    await placeOrder(address);
  };

  const handleAddNewAddress = () => {
    resetManualAddress();
    setShowAddressModal(true);
  };

  const handleSaveNewAddress = async () => {
    if (
      !manualAddress.street.trim() ||
      !manualAddress.phoneNumber.trim() ||
      !manualAddress.city.trim() ||
      !manualAddress.state.trim() ||
      !manualAddress.zipCode.trim() ||
      !manualAddress.country.trim()
    ) {
      toast.error("Please fill in all address fields");
      return;
    }
    
    await saveNewAddress();
  };

  const formatAddressDisplay = (addr: Address): string => {
    return `${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}`;
  };

  if (loading) {
    return <div className="py-12 text-center">Loading addresses...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-blue-300" />
        <p className="mt-2 text-slate-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-emerald-800">Your Cart ({cartCount} items)</h2>
            <div className="space-y-4">
              {cart.map((item) => {
                const stock = item.product?.quantity ? toNumber(item.product.quantity, 0) : Infinity;
                return (
                  <div key={item._id || item.productId} className="flex flex-wrap gap-4 border-b border-blue-100 pb-4 last:border-0">
                    <div className="h-20 w-20 overflow-hidden rounded-lg bg-blue-50">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="m-5 h-10 w-10 text-blue-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <p className="text-xs text-slate-500">
                        ₹{toNumber(item.price, 0)} / {item.product?.unit || "kg"}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                          className="rounded-full border p-1"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (item.quantity + 1 <= stock)
                              updateCartItem(item.productId, item.quantity + 1);
                            else toast.error(`Only ${stock} available`);
                          }}
                          className="rounded-full border p-1"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeCartItem(item.productId)}
                          className="ml-auto text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">
                        ₹{(toNumber(item.price, 0) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary & Address */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-bold text-slate-800">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Subtotal ({cartCount} items)</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-slate-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
              <MapPin size={18} /> Delivery Address
            </h3>

            {savedAddresses.length > 0 && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Select saved address</label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="mb-2 w-full rounded-xl border border-blue-200 p-2 text-sm"
                >
                  {savedAddresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {formatAddressDisplay(addr)} {addr.isDefault ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddNewAddress}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              <PlusCircle size={18} />
              Add New Address
            </button>

            {!selectedAddressId && savedAddresses.length === 0 && (
              <p className="mt-3 text-center text-xs text-amber-600">
                Please add a delivery address to place your order
              </p>
            )}
            
            <button
              onClick={handlePlaceOrder}
              disabled={checkoutLoading || cart.length === 0 || (!selectedAddressId && savedAddresses.length === 0)}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-2.5 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {checkoutLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !checkoutLoading && setShowAddressModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h3 className="mb-4 text-xl font-bold text-emerald-800">Add New Address</h3>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Street Address *"
                className="w-full rounded-xl border border-blue-200 p-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                value={manualAddress.street}
                onChange={(e) => setManualAddress({ ...manualAddress, street: e.target.value })}
              />
            <input
  type="text"
  placeholder="Phone Number *"
  maxLength={10}
  pattern="[0-9]{10}"
  inputMode="numeric"
  className="w-full rounded-xl border border-blue-200 p-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
  value={manualAddress.phoneNumber}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setManualAddress({ ...manualAddress, phoneNumber: value });
  }}
/>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City *"
                  className="rounded-xl border border-blue-200 p-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={manualAddress.city}
                  onChange={(e) => setManualAddress({ ...manualAddress, city: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="State *"
                  className="rounded-xl border border-blue-200 p-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={manualAddress.state}
                  onChange={(e) => setManualAddress({ ...manualAddress, state: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
  type="text"
  placeholder="Zip Code *"
  maxLength={6}
  inputMode="numeric"
  className="rounded-xl border border-blue-200 p-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
  value={manualAddress.zipCode}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setManualAddress({ ...manualAddress, zipCode: value });
  }}
/>
                <input
                  type="text"
                  placeholder="Country *"
                  className="rounded-xl border border-blue-200 p-2.5 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={manualAddress.country}
                  onChange={(e) => setManualAddress({ ...manualAddress, country: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={manualAddress.isDefault}
                  onChange={(e) => setManualAddress({ ...manualAddress, isDefault: e.target.checked })}
                  className="rounded border-blue-300 text-emerald-600 focus:ring-emerald-500"
                />
                Set as default address
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewAddress}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};