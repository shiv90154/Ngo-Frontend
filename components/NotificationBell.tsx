// components/NotificationBell.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Loader2, Heart, MessageCircle, UserPlus, Megaphone, Stethoscope, GraduationCap, Briefcase, Calendar, FileText, Wallet, AlertCircle, ShoppingCart, Check } from "lucide-react";
import { notificationAPI } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "react-toastify";

interface Notification {
  _id: string;
  type: string;
  read: boolean;
  createdAt: string;
  sender?: {
    _id: string;
    fullName: string;
    profileImage?: string;
    role?: string;
  };
  post?: {
    _id: string;
    content?: string;
    media?: any[];
  };
  comment?: {
    text: string;
  };
  metadata?: {
    title?: string;
    message?: string;
    courseId?: string;
    appointmentId?: string;
    prescriptionId?: string;
    testId?: string;
    loanId?: string;
    amount?: number;
    plan?: string;
    daysLeft?: number;
  };
}

const ICON_MAP: Record<string, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AlertCircle,
  global: Megaphone,
  doctor_message: Stethoscope,
  teacher_message: GraduationCap,
  agent_message: Briefcase,
  appointment_reminder: Calendar,
  prescription_added: FileText,
  course_enrolled: GraduationCap,
  test_result: FileText,
  wallet_credited: Wallet,
  loan_sanctioned: Wallet,
  emi_reminder: AlertCircle,
  bill_paid: Check,
  subscription_expiry: AlertCircle,
  mlm_commission: Wallet,
  store_order: ShoppingCart,
};

const ICON_COLOR: Record<string, string> = {
  like: "text-red-500",
  comment: "text-blue-500",
  follow: "text-green-500",
  mention: "text-purple-500",
  global: "text-orange-500",
  doctor_message: "text-blue-500",
  teacher_message: "text-purple-500",
  agent_message: "text-orange-500",
  appointment_reminder: "text-indigo-500",
  prescription_added: "text-teal-500",
  course_enrolled: "text-purple-500",
  test_result: "text-cyan-500",
  wallet_credited: "text-green-500",
  loan_sanctioned: "text-emerald-500",
  emi_reminder: "text-yellow-500",
  bill_paid: "text-green-500",
  subscription_expiry: "text-red-500",
  mlm_commission: "text-green-500",
  store_order: "text-orange-500",
};

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationAPI.getNotifications({ filter: "unread", limit: 1 });
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationAPI.getNotifications({ limit: 10 });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and periodic polling
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleBellClick = () => {
    setPanelOpen(!panelOpen);
    if (!panelOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  // Generate appropriate link based on notification type
  const getNotificationLink = (n: Notification): string => {
    switch (n.type) {
      case "follow":
        return `/news/profile/${n.sender?._id}`;
      case "like":
      case "comment":
      case "mention":
        return n.post ? `/news/post/${n.post._id}` : "#";
      case "doctor_message":
      case "appointment_reminder":
      case "prescription_added":
        return n.metadata?.appointmentId
          ? `/healthcare/appointments`
          : "/healthcare/appointments";
      case "teacher_message":
      case "course_enrolled":
        return n.metadata?.courseId
          ? `/education/courses/${n.metadata.courseId}`
          : "/education/my-courses";
      case "test_result":
        return n.metadata?.testId
          ? `/education/tests/${n.metadata.testId}/result`
          : "/education/courses/my";
      case "wallet_credited":
      case "loan_sanctioned":
      case "emi_reminder":
      case "bill_paid":
      case "mlm_commission":
        return "/finance/wallet";
      case "subscription_expiry":
        return "/profile";
      case "store_order":
        return "/ecommerce/orders";
      case "global":
      default:
        return "#";
    }
  };

  // Generate rich text for notification content
  const getNotificationContent = (n: Notification) => {
    const senderName = n.sender?.fullName || "System";

    switch (n.type) {
      case "like":
        return (
          <p className="text-sm text-gray-800">
            <span className="font-medium">{senderName}</span> liked your post
          </p>
        );
      case "comment":
        return (
          <div className="text-sm text-gray-800">
            <p><span className="font-medium">{senderName}</span> commented on your post</p>
            {n.comment?.text && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">"{n.comment.text}"</p>
            )}
          </div>
        );
      case "follow":
        return (
          <p className="text-sm text-gray-800">
            <span className="font-medium">{senderName}</span> started following you
          </p>
        );
      case "mention":
        return (
          <p className="text-sm text-gray-800">
            <span className="font-medium">{senderName}</span> mentioned you in a post
          </p>
        );
      case "global":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "System Announcement"}</p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.metadata?.message}</p>
          </div>
        );
      case "doctor_message":
        return (
          <div className="text-sm text-gray-800">
            <p><span className="font-medium">{senderName}</span> sent you a message</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{n.metadata?.title}</p>
            {n.metadata?.message && (
              <p className="text-xs text-gray-500 line-clamp-2">{n.metadata.message}</p>
            )}
          </div>
        );
      case "teacher_message":
        return (
          <div className="text-sm text-gray-800">
            <p><span className="font-medium">{senderName}</span> sent you a message</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{n.metadata?.title}</p>
            {n.metadata?.message && (
              <p className="text-xs text-gray-500 line-clamp-2">{n.metadata.message}</p>
            )}
          </div>
        );
      case "agent_message":
        return (
          <div className="text-sm text-gray-800">
            <p><span className="font-medium">{senderName}</span> sent you a message</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{n.metadata?.title}</p>
            {n.metadata?.message && (
              <p className="text-xs text-gray-500 line-clamp-2">{n.metadata.message}</p>
            )}
          </div>
        );
      case "appointment_reminder":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "Appointment Reminder"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "prescription_added":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "New Prescription"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "course_enrolled":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "New Enrollment"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "test_result":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "Test Result"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "wallet_credited":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "Wallet Credited"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "loan_sanctioned":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "Loan Sanctioned"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "emi_reminder":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "EMI Reminder"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "bill_paid":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "Bill Paid"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "subscription_expiry":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "Subscription Expiring"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "mlm_commission":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "Commission Credited"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      case "store_order":
        return (
          <div className="text-sm text-gray-800">
            <p className="font-medium">{n.metadata?.title || "New Order"}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.metadata?.message}</p>
          </div>
        );
      default:
        return (
          <p className="text-sm text-gray-800">{n.metadata?.title || "New notification"}</p>
        );
    }
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={handleBellClick}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm px-0.5">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {panelOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex flex-col max-h-[70vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#1a237e] font-medium hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-[#1a237e]" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = ICON_MAP[n.type] || Bell;
                const colorClass = ICON_COLOR[n.type] || "text-gray-500";
                const link = getNotificationLink(n);

                return (
                  <Link
                    key={n._id}
                    href={link}
                    onClick={(e) => {
                      if (link === "#") e.preventDefault();
                      if (!n.read) handleMarkAsRead(n._id);
                      setPanelOpen(false);
                    }}
                    className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 ${
                      !n.read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className={`w-5 h-5 ${colorClass}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {getNotificationContent(n)}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    )}
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100">
            <Link
              href="/news/notifications"
              className="block text-center text-sm text-[#1a237e] font-medium py-3 hover:bg-gray-50 rounded-b-xl transition"
              onClick={() => setPanelOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}