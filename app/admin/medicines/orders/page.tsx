"use client";

import { useEffect, useState } from "react";
import { medicineAPI } from "@/lib/api"; // We'll need a new API function; add to lib/api.ts
import { Loader2, Package, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

// We need an admin orders API function – add this to medicineAPI in lib/api.ts:
// getAllOrders: () => api.get("/medicines/orders/all"),

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await medicineAPI.getAllOrders(); // assume added
      setOrders(res.data.orders || []);
    } catch (err: any) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await medicineAPI.updateOrderStatus(orderId, newStatus as any);
      toast.success("Order status updated");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const statusColors: any = {
    placed: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Medicine Orders</h1>
        <p className="text-gray-500 mt-1">View and manage all customer orders</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500">No orders yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{order._id.slice(-8)}</td>
                  <td className="px-4 py-3">{order.user?.fullName || "N/A"}</td>
                  <td className="px-4 py-3">{order.items.length} item(s)</td>
                  <td className="px-4 py-3 font-semibold">₹{order.totalAmount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}