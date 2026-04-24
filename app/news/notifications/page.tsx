"use client";

import { useEffect, useState } from "react";
import { notificationAPI } from "@/lib/api";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Bell,
  Loader2,
  ArrowLeft,
  Circle,
  CheckCheck,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from "@/utils/mediaUrl";

// ---------- Types ----------
interface NotificationSender {
  _id: string;
  fullName?: string;
  profileImage?: string;
}

interface NotificationPost {
  _id: string;
  media?: { url: string }[];
}

interface NotificationItem {
  _id: string;
  type: "like" | "comment" | "follow" | string;
  sender?: NotificationSender;
  post?: NotificationPost;
  isRead: boolean;
  createdAt: string;
}

// ---------- icon + label for each notification type ----------
const getNotificationDetails = (type: string) => {
  switch (type) {
    case "like":
      return {
        icon: <Heart className="w-3.5 h-3.5 text-white fill-white" />,
        bgColor: "bg-rose-500",
        label: "liked your post",
      };
    case "comment":
      return {
        icon: <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />,
        bgColor: "bg-blue-500",
        label: "commented on your post",
      };
    case "follow":
      return {
        icon: <UserPlus className="w-3.5 h-3.5 text-white" />,
        bgColor: "bg-emerald-500",
        label: "started following you",
      };
    default:
      return {
        icon: <Bell className="w-3.5 h-3.5 text-white" />,
        bgColor: "bg-slate-400",
        label: "sent a notification",
      };
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications({ limit: 50 });
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All caught up! 🎉");
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  // ---------- Loading Skeleton ----------
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="h-10 w-48 bg-slate-200/70 rounded-full animate-pulse mb-6" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl ring-1 ring-slate-900/5 animate-pulse"
          >
            <div className="w-12 h-12 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-transparent backdrop-blur-sm pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 rounded-xl hover:bg-slate-100/70 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </motion.button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Activity
            </h1>
          </div>

          {hasUnread && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold 
                         hover:bg-indigo-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label="Mark all notifications as read"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </motion.button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <AnimatePresence mode="popLayout">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const details = getNotificationDetails(n.type);
            return (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`group relative p-4 rounded-2xl transition-all ring-1 ${
                  !n.isRead
                    ? "bg-indigo-50/60 ring-indigo-100 shadow-sm"
                    : "bg-white/70 backdrop-blur-md ring-slate-900/5 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar with badge */}
                  <Link
                    href={`/news/profile/${n.sender?._id}`}
                    className="relative shrink-0"
                    aria-label={`View ${n.sender?.fullName || "user"}'s profile`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg ring-1 ring-indigo-300/60 overflow-hidden">
                      {n.sender?.profileImage ? (
                        <Image
                          src={getMediaUrl(n.sender.profileImage)}
                          alt={n.sender?.fullName || "Avatar"}
                          width={48}
                          height={48}
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        n.sender?.fullName?.charAt(0) || "?"
                      )}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 p-1 rounded-lg shadow-md ring-2 ring-white ${details.bgColor}`}
                    >
                      {details.icon}
                    </div>
                  </Link>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-600 leading-tight">
                        <span className="font-semibold text-slate-900 mr-1">
                          {n.sender?.fullName || "A user"}
                        </span>
                        {details.label}
                      </p>
                      {!n.isRead && (
                        <Circle className="w-2.5 h-2.5 fill-indigo-500 text-indigo-500 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">
                      {n.createdAt
                        ? formatDistanceToNowStrict(new Date(n.createdAt), { addSuffix: true })
                        : "just now"}
                    </p>
                  </div>

                  {/* Thumbnail preview */}
                  {n.post && n.post.media?.[0] && (
                    <Link
                      href={`/news/post/${n.post._id}`}
                      className="shrink-0"
                      aria-label="View post"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden ring-1 ring-slate-200 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={getMediaUrl(n.post.media[0].url)}
                          alt=""
                          width={48}
                          height={48}
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          unoptimized
                        />
                      </div>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-slate-900/5 shadow-sm"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-200/60">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              No activity yet
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              When people like your posts or follow you, they'll show up here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}