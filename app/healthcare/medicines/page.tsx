"use client";

import { useEffect, useState } from "react";
import { medicineAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Search,
  ShoppingBag,
  Loader2,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  X,
  CheckCircle,
  Filter,
} from "lucide-react";

type Medicine = {
  _id: string;
  name: string;
  genericName?: string;
  price: number;
  mrp?: number;
  stock: number;
  prescriptionRequired: boolean;
  category?: string;
  dosageForm?: string;
  imageUrl?: string;
};

type CartItem = Medicine & { quantity: number };

const categories = [
  "All",
  "Antibiotic",
  "Pain Relief",
  "Cardiac",
  "Diabetes",
  "Respiratory",
  "Skin Care",
];

export default function MedicineStorePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlacing, setOrderPlacing] = useState(false);
  const router = useRouter();

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      const res = await medicineAPI.getMedicines(params);
      setMedicines(res.data.medicines || []);
    } catch (error) {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [search, category]);

  const addToCart = (medicine: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === medicine._id);
      if (existing) {
        return prev.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
    toast.success(`${medicine.name} added to cart`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setOrderPlacing(true);
    try {
      await medicineAPI.createOrder({
        items: cart.map((item) => ({
          medicine: item._id,
          quantity: item.quantity,
        })),
        paymentMethod: "wallet",
      });
      toast.success("Order placed successfully!");
      setCart([]);
      setShowCart(false);
      router.push("/healthcare/medicines/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setOrderPlacing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Medicine Store</h1>
            <p className="text-gray-500 mt-1">
              Browse and order prescription & OTC medicines
            </p>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-[#11195c]"
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  category === cat
                    ? "bg-[#1a237e] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Medicine Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : medicines.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No medicines found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {medicines.map((med) => (
            <div
              key={med._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{med.name}</h3>
                  {med.genericName && (
                    <p className="text-xs text-gray-500">{med.genericName}</p>
                  )}
                  {med.category && (
                    <p className="text-xs mt-2 inline-block bg-gray-100 rounded-full px-2 py-0.5">
                      {med.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{med.price}
                  </p>
                  {med.mrp && med.mrp > med.price && (
                    <p className="text-xs text-gray-400 line-through">
                      ₹{med.mrp}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => addToCart(med)}
                  disabled={med.stock === 0}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    med.stock === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#1a237e] text-white hover:bg-[#11195c]"
                  }`}
                >
                  {med.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>

              {med.prescriptionRequired && (
                <div className="mt-2 text-xs text-orange-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Requires Prescription
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cart Sidebar/Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 border-b pb-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} x {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex justify-between pt-2">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="font-bold text-gray-800">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={orderPlacing}
                  className="w-full py-3 bg-[#1a237e] text-white rounded-lg font-medium hover:bg-[#11195c] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {orderPlacing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                  {orderPlacing ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}