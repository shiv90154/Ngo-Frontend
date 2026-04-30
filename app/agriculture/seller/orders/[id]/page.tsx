// app/agriculture/seller/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerShell from "@/components/agriculture/seller/SellerShell";
import api from "@/lib/api";
import {
  Loader2,
  Package,
  MapPin,
  Phone,
  CalendarDays,
  IndianRupee,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  CreditCard,
  Download,
  ArrowLeft,
  PackageCheck,
  Box,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

// Types (same as in Orders page)
interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  unit?: string;
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

// Status config (reuse from Orders page)
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: "Pending Confirmation", color: "text-orange-700", bg: "bg-orange-50", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-50", icon: CheckCircle },
  processing: { label: "Processing", color: "text-yellow-700", bg: "bg-yellow-50", icon: Package },
  shipped: { label: "Shipped", color: "text-indigo-700", bg: "bg-indigo-50", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50", icon: XCircle },
  refunded: { label: "Refunded", color: "text-purple-700", bg: "bg-purple-50", icon: RefreshCw },
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user && id) {
      fetchOrderDetails();
    }
  }, [user, authLoading, id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`agriculture/seller/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.data);
      } else {
        setError(res.data.message || "Failed to load order");
        toast.error("Failed to load order details");
      }
    } catch (error: any) {
      console.error("Fetch order error:", error);
      setError(error.response?.data?.message || "Unable to load order");
      toast.error("Unable to load order details");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    if (!order) return;
    try {
      const res = await api.get(`agriculture/seller/orders/${order._id}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${order.orderId || order._id}.pdf`);
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
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${config.bg} ${config.color}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf7]">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-8 py-10 shadow-sm">
          <Loader2 className="h-7 w-7 animate-spin text-[#138808]" />
          <p className="text-sm font-medium text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <SellerShell title="Order Details" subtitle="View order information">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <p className="mt-3 text-gray-600">{error || "Order not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
          >
            Go Back
          </button>
        </div>
      </SellerShell>
    );
  }

  return (
    <SellerShell title="Order Details" subtitle={`Order #${order.orderId || order._id.slice(-8)}`}>
      <div className="min-h-screen bg-gradient-to-br from-[#f4fbf4] via-[#f7faf7] to-[#eef8ee] pb-10">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={16} /> Back to Orders
          </button>

          {/* Header Card */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                    <PackageCheck size={22} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Order #{order.orderId || order._id.slice(-8)}
                    </h1>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <CalendarDays size={14} /> Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <button
                    onClick={downloadInvoice}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Download size={16} />
                    Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left column: Items */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
                      <Box size={18} /> Items Ordered
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                          {item.image ? (
                            <img src={item.image} alt={item.productName} className="h-16 w-16 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.productName}</h4>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} {item.unit || "units"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">₹{item.price.toLocaleString("en-IN")} each</p>
                            <p className="text-base font-bold text-gray-900">₹{(item.quantity * item.price).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline / progress (optional) */}
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <Clock size={16} /> Order Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle size={14} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Order Placed</p>
                          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      {order.status === "confirmed" && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <CheckCircle size={14} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                            <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                          </div>
                        </div>
                      )}
                      {order.status === "processing" && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                            <Package size={14} className="text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Processing</p>
                            <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                          </div>
                        </div>
                      )}
                      {order.status === "shipped" && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                            <Truck size={14} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Shipped</p>
                            <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                          </div>
                        </div>
                      )}
                      {order.status === "delivered" && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle size={14} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Delivered</p>
                            <p className="text-xs text-gray-500">{formatDate(order.deliveredAt || order.updatedAt)}</p>
                          </div>
                        </div>
                      )}
                      {order.status === "cancelled" && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                            <XCircle size={14} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Cancelled</p>
                            <p className="text-xs text-gray-500">{formatDate(order.cancelledAt || order.updatedAt)}</p>
                            {order.cancellationReason && <p className="text-xs text-gray-500 mt-1">Reason: {order.cancellationReason}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right column: Details */}
                <div className="space-y-5">
                  {/* Buyer Info */}
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <User size={16} /> Buyer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {order.buyer?.name || "Unknown"}</p>
                      <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {order.buyer?.email || "N/A"}</p>
                      {order.buyer?.phone && <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {order.buyer.phone}</p>}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <MapPin size={16} /> Delivery Address
                    </h3>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">{order.deliveryAddress.fullName || order.buyer?.name}</p>
                      <p>{order.deliveryAddress.street}</p>
                      <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                      <p>Pincode: {order.deliveryAddress.pincode}</p>
                      {order.deliveryAddress.phone && <p className="mt-1">Phone: {order.deliveryAddress.phone}</p>}
                      {order.deliveryAddress.landmark && <p>Landmark: {order.deliveryAddress.landmark}</p>}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <CreditCard size={16} /> Payment
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Method:</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Status:</span>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          order.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                          order.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        }`}>{order.paymentStatus}</span>
                      </div>
                      {order.paymentId && <div className="flex justify-between"><span className="text-gray-600">Transaction ID:</span><span className="font-mono text-xs">{order.paymentId}</span></div>}
                    </div>
                  </div>

                  {/* Order Totals */}
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span>₹{order.subtotal.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Shipping:</span><span>₹{order.shippingCost.toLocaleString("en-IN")}</span></div>
                      {order.tax > 0 && <div className="flex justify-between"><span className="text-gray-600">Tax:</span><span>₹{order.tax.toLocaleString("en-IN")}</span></div>}
                      {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-600">Discount:</span><span>-₹{order.discount.toLocaleString("en-IN")}</span></div>}
                      <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold"><span>Total</span><span className="text-emerald-600">₹{order.total.toLocaleString("en-IN")}</span></div>
                    </div>
                  </div>

                  {/* Tracking info if shipped */}
                  {order.trackingNumber && (
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"><Truck size={16} /> Tracking Information</h3>
                      <p className="text-sm">Tracking number: <span className="font-mono font-medium">{order.trackingNumber}</span></p>
                      {order.trackingCompany && <p className="text-sm">Courier: {order.trackingCompany}</p>}
                      {order.estimatedDelivery && <p className="text-sm text-gray-600">Est. delivery: {formatDate(order.estimatedDelivery)}</p>}
                    </div>
                  )}

                  {/* Notes */}
                  {order.notes && (
                    <div className="rounded-xl border border-gray-100 bg-yellow-50 p-4">
                      <h3 className="mb-1 text-sm font-semibold text-yellow-800">Customer Notes</h3>
                      <p className="text-sm text-yellow-700">{order.notes}</p>
                    </div>
                  )}
                  {order.sellerNotes && (
                    <div className="rounded-xl border border-gray-100 bg-blue-50 p-4">
                      <h3 className="mb-1 text-sm font-semibold text-blue-800">Seller Notes</h3>
                      <p className="text-sm text-blue-700">{order.sellerNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerShell>
  );
}