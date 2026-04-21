"use client";

import { useEffect, useState } from "react";
import { notificationAPI } from "@/lib/api"; // Updated to use your new API constant
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Bell, 
  Loader2, 
  ArrowLeft,
  Circle,
  CheckCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
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
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All caught up!");
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  const getNotificationDetails = (type: string) => {
    switch (type) {
      case "like": 
        return {
          icon: <Heart className="w-3.5 h-3.5 text-white fill-white" />,
          bgColor: "bg-rose-500",
          label: "liked your post"
        };
      case "comment": 
        return {
          icon: <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />,
          bgColor: "bg-blue-500",
          label: "commented on your post"
        };
      case "follow": 
        return {
          icon: <UserPlus className="w-3.5 h-3.5 text-white" />,
          bgColor: "bg-emerald-500",
          label: "started following you"
        };
      default: 
        return {
          icon: <Bell className="w-3.5 h-3.5 text-white" />,
          bgColor: "bg-slate-400",
          label: "sent a notification"
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a237e] opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Activity</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 py-6 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Activity</h1>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#1a237e] rounded-2xl transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Mark read</span>
          </button>
        )}
      </header>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const details = getNotificationDetails(n.type);
            return (
              <div 
                key={n._id} 
                className={`group relative p-4 rounded-[2rem] transition-all border border-transparent hover:border-slate-100 hover:bg-slate-50/50 flex items-center gap-4 ${
                  !n.isRead ? "bg-indigo-50/40" : "bg-white"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Link href={`/news/profile/${n.sender?._id}`}>
                    <div className="w-14 h-14 rounded-[1.25rem] bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
                      {n.sender?.profileImage ? (
                        <img src={n.sender.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-xl">
                          {n.sender?.fullName?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-xl shadow-lg ${details.bgColor} ring-2 ring-white`}>
                    {details.icon}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-600 leading-tight">
                      <span className="font-bold text-slate-900 mr-1 hover:underline cursor-pointer">
                        {n.sender?.fullName || "A user"}
                      </span>
                      {details.label}
                    </p>
                    {!n.isRead && (
                      <Circle className="w-2.5 h-2.5 fill-indigo-500 text-indigo-500 shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-1.5">
                    {n.createdAt ? formatDistanceToNow(new Date(n.createdAt)) : "recently"} ago
                  </p>
                </div>

                {/* Post Preview Image */}
                {n.post && n.post.media && n.post.media[0] && (
                  <Link href={`/news/post/${n.post._id}`} className="shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={n.post.media[0].url} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        alt="preview"
                      />
                    </div>
                  </Link>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-white rounded-[2.2rem] shadow-sm flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-slate-200" />
            </div>
            <p className="font-bold text-slate-900">No activity yet</p>
            <p className="text-slate-400 text-xs mt-1 px-10">
              When people like your posts or follow you, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}