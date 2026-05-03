"use client";

import { useEffect, useState } from "react";
import { medicineAPI } from "@/lib/api";
import { Loader2, Package, ChevronRight } from "lucide-react";
import Link from "next/link";

type Order = {
  _id: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await medicineAPI.getMyOrders();
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">My Medicine Orders</h1>
        <p className="text-gray-500 mt-1">Track your medicine deliveries</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No orders yet</p>
          <Link
            href="/healthcare/medicines"
            className="mt-4 inline-block text-[#1a237e] font-medium hover:underline"
          >
            Browse Medicines
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/healthcare/medicines/orders/${order._id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {order.items.length} item(s) · ₹{order.totalAmount}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}