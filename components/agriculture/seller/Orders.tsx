// components/agriculture/seller/Orders.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerShell from "@/components/agriculture/seller/SellerShell";
import api from "@/lib/api";
import {
  Loader2,
  ShoppingCart,
  User,
  Package,
  MapPin,
  Phone,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Download,
  RefreshCw,
  CreditCard,
  Box,
  X,
  TrendingUp,
  CalendarDays,
  PackageCheck,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { FiPackage } from "react-icons/fi";
import { toast } from "react-toastify";

// ===================== Type Definitions =====================

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  unit?: string;
  sku?: string;
}

interface Address {
  fullName?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  landmark?: string;
}

interface Order {
  _id: string;
  orderId: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  deliveryAddress: Address;
  billingAddress?: Address;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  paymentId?: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  sellerNotes?: string;
  trackingNumber?: string;
  trackingCompany?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface DashboardResponse {
  success: boolean;
  data: {
    orders: Order[];
    stats: Stats;
  };
}

interface StatusUpdateResponse {
  success: boolean;
  message: string;
  data: Order;
}

type StatusAction = "confirm" | "process" | "ship" | "deliver" | "cancel" | "refund";

// ===================== Helper Functions =====================

const getStepIndex = (status: string) => {
  const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const idx = steps.indexOf(status);
  return idx === -1 ? 0 : idx;
};

const formatShortDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ===================== Constants =====================

const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: any;
  actions: StatusAction[];
  nextStatus?: string;
  canCancel: boolean;
}> = {
  pending: {
    label: "Pending Confirmation",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: Clock,
    actions: ["confirm", "cancel"],
    nextStatus: "confirmed",
    canCancel: true,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: CheckCircle,
    actions: ["process", "cancel"],
    nextStatus: "processing",
    canCancel: true,
  },
  processing: {
    label: "Processing",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: Package,
    actions: ["ship"],
    nextStatus: "shipped",
    canCancel: true,
  },
  shipped: {
    label: "Shipped",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: Truck,
    actions: ["deliver"],
    nextStatus: "delivered",
    canCancel: false,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle,
    actions: [],
    canCancel: false,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
    actions: [],
    canCancel: false,
  },
  refunded: {
    label: "Refunded",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: RefreshCw,
    actions: [],
    canCancel: false,
  },
};

const ACTION_LABELS: Record<StatusAction, { label: string; color: string; icon: any; requiresNote?: boolean }> = {
  confirm: { label: "Confirm Order", color: "bg-blue-600 hover:bg-blue-700", icon: CheckCircle },
  process: { label: "Start Processing", color: "bg-yellow-600 hover:bg-yellow-700", icon: Package },
  ship: { label: "Mark as Shipped", color: "bg-indigo-600 hover:bg-indigo-700", icon: Truck, requiresNote: true },
  deliver: { label: "Mark as Delivered", color: "bg-green-600 hover:bg-green-700", icon: CheckCircle },
  cancel: { label: "Cancel Order", color: "bg-red-600 hover:bg-red-700", icon: XCircle, requiresNote: true },
  refund: { label: "Process Refund", color: "bg-purple-600 hover:bg-purple-700", icon: CreditCard, requiresNote: true },
};

// ===================== Component =====================

export default function SellerOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [actionData, setActionData] = useState<{
    orderId: string;
    action: StatusAction;
    newStatus: string;
    note: string;
    trackingNumber?: string;
    trackingCompany?: string;
  }>({
    orderId: "",
    action: "confirm",
    newStatus: "",
    note: "",
  });

  const isContractFarmer = user?.farmerProfile?.isContractFarmer;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!authLoading && user && !isContractFarmer) {
      router.push("/agriculture");
      return;
    }
    if (user && isContractFarmer) {
      fetchOrders();
    }
  }, [user, authLoading, isContractFarmer, router]);

  useEffect(() => {
    let filtered = [...orders];
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const orderId = (order.orderId || order._id || "").toLowerCase();
        const buyerName = (order.buyer?.name || "").toLowerCase();
        const hasProductMatch = order.items?.some(item =>
          (item.productName || "").toLowerCase().includes(term)
        ) || false;
        const phoneMatch = order.deliveryAddress?.phone?.includes(searchTerm) || false;
        return orderId.includes(term) || buyerName.includes(term) || hasProductMatch || phoneMatch;
      });
    }
    setFilteredOrders(filtered);
  }, [statusFilter, searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<DashboardResponse>("agriculture/seller/orders");
      if (res.data.success) {
        setOrders(res.data.data.orders || []);
        setFilteredOrders(res.data.data.orders || []);
        setStats(res.data.data.stats);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      toast.error(error.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (order: Order, action: StatusAction) => {
    const config = STATUS_CONFIG[order.status];
    let newStatus = "";
    if (action === "cancel") {
      newStatus = "cancelled";
    } else if (action === "refund") {
      newStatus = "refunded";
    } else if (config.nextStatus) {
      newStatus = config.nextStatus;
    }
    setActionData({
      orderId: order._id,
      action,
      newStatus,
      note: "",
      trackingNumber: "",
      trackingCompany: "",
    });
    setShowActionModal(true);
  };

  const performStatusUpdate = async () => {
    try {
      setUpdatingOrderId(actionData.orderId);
      const payload: any = {
        status: actionData.newStatus,
        note: actionData.note,
      };
      if (actionData.action === "ship") {
        if (!actionData.trackingNumber) {
          toast.error("Please enter tracking number");
          return;
        }
        payload.trackingNumber = actionData.trackingNumber;
        payload.trackingCompany = actionData.trackingCompany || "Other";
      }
      if (actionData.action === "cancel") {
        payload.cancellationReason = actionData.note;
      }
      const res = await api.put<StatusUpdateResponse>(
        `agriculture/seller/orders/${actionData.orderId}/status`,
        payload
      );
      if (res.data.success) {
        toast.success(res.data.message || "Order updated successfully");
        fetchOrders();
        setShowActionModal(false);
      } else {
        toast.error(res.data.message || "Failed to update order");
      }
    } catch (error: any) {
      console.error("Failed to update order:", error);
      toast.error(error.response?.data?.message || "Unable to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const downloadInvoice = async (orderId: string) => {
    try {
      const res = await api.get(`agriculture/seller/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Invoice downloaded");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf7]">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-8 py-10 shadow-sm">
          <Loader2 className="h-7 w-7 animate-spin text-[#138808]" />
          <p className="text-sm font-medium text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!user || !isContractFarmer) return null;

  return (
    <SellerShell title="Order Management" subtitle="Manage and process customer orders">
      <div className="min-h-screen bg-gradient-to-br from-[#f4fbf4] via-[#f7faf7] to-[#eef8ee]">
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">
          
          {/* Stats Dashboard */}
          {stats && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <h3 className="mt-1 text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
                    <p className="text-xs text-gray-500 mt-1">+{stats.monthlyOrders} this month</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <ShoppingCart size={20} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                    <h3 className="mt-1 text-2xl font-bold text-yellow-600">{stats.pendingOrders}</h3>
                    <p className="text-xs text-gray-500">Need confirmation</p>
                  </div>
                  <div className="rounded-full bg-yellow-100 p-3">
                    <Clock size={20} className="text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Orders</p>
                    <h3 className="mt-1 text-2xl font-bold text-blue-600">
                      {stats.processingOrders + stats.shippedOrders}
                    </h3>
                    <p className="text-xs text-gray-500">Processing/Shipped</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <Package size={20} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenue (Monthly)</p>
                    <h3 className="mt-1 text-2xl font-bold text-emerald-600">
                      ₹{stats.monthlyRevenue.toLocaleString("en-IN")}
                    </h3>
                    <p className="text-xs text-gray-500">Avg order: ₹{stats.averageOrderValue.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-3">
                    <TrendingUp size={20} className="text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search + View Toggle */}
          <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID, buyer, product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-xl border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-green-400 focus:outline-none"
                  />
                </div>
                
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:border-green-400 focus:outline-none"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View Toggle Buttons */}
                <div className="flex rounded-xl border border-gray-200 bg-white p-0.5">
                  <button
                    onClick={() => setViewMode("card")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      viewMode === "card"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutGrid size={14} />
                    Card
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      viewMode === "table"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutList size={14} />
                    Table
                  </button>
                </div>
                <button
                  onClick={fetchOrders}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Orders List - Conditional Rendering */}
          {filteredOrders.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
              <Package size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">No orders found</p>
              <p className="text-sm text-gray-400">
                {searchTerm || statusFilter !== "all" ? "Try different filters" : "Orders will appear here"}
              </p>
            </div>
          ) : viewMode === "card" ? (
            /* ==================== CARD VIEW (existing) ==================== */
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
                        <PackageCheck size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Order #{order.orderId || order._id.slice(-8)}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <CalendarDays size={12} />
                          {formatShortDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Body: two columns */}
                  <div className="p-5">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                      {/* LEFT: Items + Progress + Quick links */}
                      <div className="lg:col-span-2 space-y-5">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2 mb-3">
                            <Box size={14} /> Items
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-2 transition hover:bg-gray-100">
                                {item.image ? (
                                  <img src={item.image} alt={item.productName} className="h-12 w-12 rounded-lg object-cover" />
                                ) : (
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                                    <Package size={18} className="text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                                  <p className="text-xs text-gray-500">
                                    {item.quantity} {item.unit || "units"} × ₹{item.price.toLocaleString("en-IN")}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-gray-900">
                                    ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order progress */}
                        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Progress</h4>
                          <div className="flex items-center gap-1">
                            {["pending", "confirmed", "processing", "shipped", "delivered"].map((step, idx) => {
                              const stepIndex = getStepIndex(order.status);
                              const isActive = idx <= stepIndex;
                              return (
                                <div key={step} className={`h-1.5 flex-1 rounded-full transition-all ${isActive ? "bg-emerald-500" : "bg-gray-200"}`} />
                              );
                            })}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">{STATUS_CONFIG[order.status]?.label}</p>
                        </div>

                        {/* Quick links */}
                        <div className="flex justify-between text-xs pt-1">
                          <button onClick={() => downloadInvoice(order._id)} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                            <Download size={12} /> Invoice
                          </button>
                          <button onClick={() => router.push(`/agriculture/seller/orders/${order._id}`)} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                            <Eye size={12} /> Full details
                          </button>
                        </div>
                      </div>

                      {/* RIGHT: Delivery, Payment, Actions */}
                      <div className="space-y-4">
                        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1"><MapPin size={12} /> Delivery</h4>
                            {order.deliveryAddress.phone && (
                              <a href={`tel:${order.deliveryAddress.phone}`} className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"><Phone size={12} /> Call</a>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-800 mt-1">{order.deliveryAddress.fullName || order.buyer?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-600">{order.deliveryAddress.street}</p>
                          <p className="text-xs text-gray-600">{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                          <div className="flex justify-between text-xs"><span className="text-gray-500">Payment</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
                          <div className="flex justify-between text-xs mt-1"><span className="text-gray-500">Status</span>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                              order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                            }`}>{order.paymentStatus}</span>
                          </div>
                          <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-sm">
                            <span className="font-semibold text-gray-700">Total</span>
                            <span className="font-bold text-emerald-600">₹{order.total.toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        {STATUS_CONFIG[order.status]?.actions.length > 0 && (
                          <div className="space-y-2">
                            {STATUS_CONFIG[order.status].actions.map((action) => {
                              const actionInfo = ACTION_LABELS[action];
                              return (
                                <button key={action} onClick={() => handleActionClick(order, action)} disabled={updatingOrderId === order._id}
                                  className={`w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md active:scale-[0.98] ${actionInfo.color}`}>
                                  {updatingOrderId === order._id ? <Loader2 size={14} className="animate-spin" /> : <actionInfo.icon size={14} />}
                                  {actionInfo.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ==================== TABLE VIEW (compact, spreadsheet-like) ==================== */
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Payment</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">#{order.orderId || order._id.slice(-8)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{formatShortDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.buyer?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">₹{order.total.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                          order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        }`}>{order.paymentStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="View Details"><Eye size={16} /></button>
                          <button onClick={() => downloadInvoice(order._id)} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="Download Invoice"><Download size={16} /></button>
                          {STATUS_CONFIG[order.status]?.actions.length > 0 && (
                            <button onClick={() => handleActionClick(order, STATUS_CONFIG[order.status].actions[0])} disabled={updatingOrderId === order._id}
                              className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-50" title={ACTION_LABELS[STATUS_CONFIG[order.status].actions[0]]?.label}>
                              {updatingOrderId === order._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                  Total {filteredOrders.length} orders | Total value: ₹{filteredOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString("en-IN")}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Order Details Modal (unchanged) */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4">
              <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
              <button onClick={() => setShowOrderModal(false)} className="rounded-lg p-1 hover:bg-gray-100"><XCircle size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Order ID</p><p className="font-medium">{selectedOrder.orderId || selectedOrder._id}</p></div>
                <div><p className="text-sm text-gray-500">Order Date</p><p className="font-medium">{formatDate(selectedOrder.createdAt)}</p></div>
                <div><p className="text-sm text-gray-500">Payment Method</p><p className="font-medium capitalize">{selectedOrder.paymentMethod}</p></div>
                <div><p className="text-sm text-gray-500">Payment Status</p><span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                  selectedOrder.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                }`}>{selectedOrder.paymentStatus}</span></div>
              </div>
              <div><h4 className="mb-2 font-semibold flex items-center gap-2"><User size={16} /> Buyer Information</h4>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p><strong>Name:</strong> {selectedOrder.buyer?.name || "Unknown"}</p>
                  <p><strong>Email:</strong> {selectedOrder.buyer?.email || "N/A"}</p>
                  {selectedOrder.buyer?.phone && <p><strong>Phone:</strong> {selectedOrder.buyer.phone}</p>}
                </div>
              </div>
              <div><h4 className="mb-2 font-semibold flex items-center gap-2"><MapPin size={16} /> Shipping Address</h4>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p>{selectedOrder.deliveryAddress.fullName || selectedOrder.buyer?.name || "Unknown"}</p>
                  <p>{selectedOrder.deliveryAddress.street}</p>
                  <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}</p>
                  <p>Pincode: {selectedOrder.deliveryAddress.pincode}</p>
                  {selectedOrder.deliveryAddress.phone && <p>Phone: {selectedOrder.deliveryAddress.phone}</p>}
                </div>
              </div>
              <div><h4 className="mb-2 font-semibold">Items Ordered</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-2">
                      <div><p className="font-medium">{item.productName}</p><p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p></div>
                      <p className="font-semibold">₹{(item.quantity * item.price).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedOrder.trackingNumber && (
                <div><h4 className="mb-2 font-semibold">Tracking Information</h4>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                    {selectedOrder.trackingCompany && <p><strong>Courier:</strong> {selectedOrder.trackingCompany}</p>}
                  </div>
                </div>
              )}
              {selectedOrder.notes && (
                <div><h4 className="mb-2 font-semibold">Customer Notes</h4><div className="rounded-lg bg-yellow-50 p-3 text-sm">{selectedOrder.notes}</div></div>
              )}
            </div>
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-white p-4">
              <button onClick={() => downloadInvoice(selectedOrder._id)} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"><Download size={16} /> Download Invoice</button>
              <button onClick={() => setShowOrderModal(false)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (unchanged) */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" /></div>
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />
            <div className="relative flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 ring-1 ring-white/40"><FiPackage className="h-5 w-5 text-white" /></div>
                <div><h3 className="text-lg font-semibold tracking-tight text-slate-900">{ACTION_LABELS[actionData.action]?.label}</h3><p className="text-xs font-medium text-slate-500">Review the details below before confirming</p></div>
              </div>
              <button onClick={() => setShowActionModal(false)} className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
            </div>
            <div className="space-y-5 px-6 py-6">
              {ACTION_LABELS[actionData.action]?.requiresNote && (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {actionData.action === "cancel" ? "Cancellation Reason" : "Note"}
                    {actionData.action !== "cancel" && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium normal-case tracking-normal text-slate-500">optional</span>}
                  </label>
                  <textarea value={actionData.note} onChange={(e) => setActionData({ ...actionData, note: e.target.value })} rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    placeholder={actionData.action === "cancel" ? "Why is this order being cancelled?" : "Add any notes about this update..."} />
                </div>
              )}
              {actionData.action === "ship" && (
                <>
                  <div className="space-y-1.5"><label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">Tracking Number <span className="text-emerald-600">*</span></label>
                    <input type="text" value={actionData.trackingNumber} onChange={(e) => setActionData({ ...actionData, trackingNumber: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                      placeholder="e.g. SR123456789IN" />
                  </div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Courier Company</label>
                    <div className="relative">
                      <select value={actionData.trackingCompany} onChange={(e) => setActionData({ ...actionData, trackingCompany: e.target.value })}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 pr-10 text-sm text-slate-800 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10">
                        <option value="">Select courier</option><option value="India Post">India Post</option><option value="DTDC">DTDC</option><option value="Blue Dart">Blue Dart</option><option value="Delhivery">Delhivery</option><option value="Amazon Shipping">Amazon Shipping</option><option value="Other">Other</option>
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button onClick={() => setShowActionModal(false)} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]">Cancel</button>
              <button onClick={performStatusUpdate} disabled={updatingOrderId === actionData.orderId}
                className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 ring-1 ring-white/20 transition hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${ACTION_LABELS[actionData.action]?.color}`}>
                {updatingOrderId === actionData.orderId ? (<><Loader2 size={16} className="animate-spin" /><span>Processing...</span></>) : (<><span>Confirm</span><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </SellerShell>
  );
}