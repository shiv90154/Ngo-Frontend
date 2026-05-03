"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { medicineAPI } from "@/lib/api";
import { Loader2, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await medicineAPI.getOrderById(id);
        setOrder(res.data.order || res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "placed": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/healthcare/medicines/orders" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1a237e]">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] text-white p-6">
          <h1 className="text-xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="text-sm text-blue-100">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
            <div className="space-y-2">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-800">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2 border-t">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-bold text-gray-800">₹{order.totalAmount}</span>
          </div>

          {order.shippingAddress && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}