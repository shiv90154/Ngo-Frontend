"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Loader2, Check, Heart, MessageCircle, UserPlus, Megaphone } from "lucide-react";
import { notificationAPI } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "react-toastify";

interface Notification {
  _id: string;
  type: string;
  read: boolean;
  createdAt: string;
  sender?: { _id: string; fullName: string; profileImage?: string };
  post?: { _id: string; content?: string };
  comment?: { text: string };
  metadata?: { title: string; message: string };
}

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
    const interval = setInterval(fetchUnreadCount, 30000);
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

  const getIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-4 h-4 text-red-500" />;
      case "comment": return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "follow": return <UserPlus className="w-4 h-4 text-green-500" />;
      case "global": return <Megaphone className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLink = (n: Notification) => {
    if (n.type === "follow") return `/news/profile/${n.sender?._id}`;
    if (n.post) return `/news/post/${n.post._id}`;
    return "#";
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={handleBellClick}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {panelOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex flex-col max-h-[70vh]"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="text-xs text-[#1a237e] font-medium">
                Mark all as read
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin h-6 w-6 text-[#1a237e]" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={getLink(n)}
                  onClick={() => {
                    if (!n.read) handleMarkAsRead(n._id);
                    setPanelOpen(false);
                  }}
                  className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 ${
                    !n.read ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    {n.type === "global" ? (
                      <>
                        <p className="text-sm font-medium text-gray-800">{n.metadata?.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{n.metadata?.message}</p>
                      </>
                    ) : n.type === "follow" ? (
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{n.sender?.fullName}</span> started following you
                      </p>
                    ) : n.type === "like" ? (
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{n.sender?.fullName}</span> liked your post
                      </p>
                    ) : n.type === "comment" ? (
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{n.sender?.fullName}</span> commented: {n.comment?.text}
                      </p>
                    ) : null}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                  )}
                </Link>
              ))
            )}
          </div>
          <div className="border-t border-gray-100 p-2">
            <Link
              href="/news/notifications"
              className="block text-center text-sm text-[#1a237e] font-medium py-2 hover:bg-gray-50 rounded-lg"
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