"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Package,
  IndianRupee,
  MapPin,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  name?: string;
  imageUrl?: string[];
};

type Address = {
  street?: string;
  block?: string;
  city?: string;
  pincode?: string;
};

type Order = {
  _id: string;
  createdAt: string;
  orderStatus: string;
  totalPrice?: number;
  quantity?: number;
  product?: Product;
  deliveryAddress?: Address;
};

type StatusConfig = {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  label: string;
};

const OrdersPage = (): JSX.Element => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const router = useRouter();

  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const authHeaders = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  const fetchOrders = async (): Promise<void> => {
    if (!authToken) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get<{ success: boolean; data: Order[]; message?: string }>(
        `${API_BASE}/agriculture/my-orders`,
        { headers: authHeaders }
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      console.error(err);

      setError(
        error.response?.data?.message || "Unable to load your orders."
      );

      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusConfig = (status: string): StatusConfig => {
    const statuses: Record<string, StatusConfig> = {
      pending: {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        label: "Pending",
      },
      processing: {
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        label: "Processing",
      },
      shipped: {
        icon: Truck,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        label: "Shipped",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        label: "Delivered",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        label: "Cancelled",
      },
    };

    return statuses[status?.toLowerCase()] || statuses.pending;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleExpand = (orderId: string): void => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // UI same as your original (no logic changes)
  return (
    <>
      <ToastContainer position="top-right" />
      {/* Keep your existing JSX exactly same */}
    </>
  );
};

export default OrdersPage;