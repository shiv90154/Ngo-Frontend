// app/(news)/notifications/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { notificationAPI } from "@/lib/api"; // 🆕 Correct import
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

interface Notification {
  _id: string;
  type: "like" | "comment" | "follow" | "mention";
  read: boolean;
  createdAt: string;
  sender: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  post?: {
    _id: string;
    content?: string;
    media?: any[];
  };
  comment?: {
    text: string;
  };
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(async (pageNum: number = 1, filter: "all" | "unread" = activeFilter) => {
    setLoading(true);
    try {
      const res = await notificationAPI.getNotifications({ // 🆕 Use notificationAPI
        page: pageNum,
        limit: 20,
        filter: filter === "unread" ? "unread" : undefined,
      });
      if (pageNum === 1) {
        setNotifications(res.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...res.data.notifications]);
      }
      setUnreadCount(res.data.unreadCount);
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    setPage(1);
    fetchNotifications(1, activeFilter);
  }, [activeFilter, fetchNotifications]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage, activeFilter);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId); // 🆕 Use notificationAPI
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(); // 🆕 Use notificationAPI
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like": return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "comment": return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "follow": return <UserPlus className="w-5 h-5 text-green-500" />;
      case "mention": return <AtSign className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const actorName = notification.sender.fullName;
    switch (notification.type) {
      case "like":
        return <><span className="font-medium">{actorName}</span> liked your post</>;
      case "comment":
        return <><span className="font-medium">{actorName}</span> commented: "{notification.comment?.text}"</>;
      case "follow":
        return <><span className="font-medium">{actorName}</span> started following you</>;
      case "mention":
        return <><span className="font-medium">{actorName}</span> mentioned you in a post</>;
      default:
        return null;
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-[#1a237e] font-medium">
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex">
        <button
          onClick={() => setActiveFilter("all")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
            activeFilter === "all" ? "bg-[#1a237e] text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter("unread")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
            activeFilter === "unread" ? "bg-[#1a237e] text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Unread
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <Link
                key={notification._id}
                href={notification.post ? `/news/post/${notification.post._id}` : `/news/profile/${notification.sender._id}`}
                onClick={() => !notification.read && markAsRead(notification._id)}
                className={`block p-4 hover:bg-gray-50 transition ${!notification.read ? "bg-blue-50/30" : ""}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-medium">
                      {notification.sender.fullName.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{getNotificationText(notification)}</p>
                        {notification.post?.content && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {notification.post.content}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          {!notification.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                        </p>
                      </div>
                      <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                className="w-full py-3 text-sm text-[#1a237e] hover:bg-gray-50"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : "Load more"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}