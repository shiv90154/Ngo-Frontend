"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Search, User, TrendingUp, PlusCircle, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { mediaAPI, notificationAPI } from "@/lib/api";
import { motion } from "framer-motion";
import FollowButton from "./FollowButton";
import { getMediaUrl } from "@/utils/mediaUrl";

interface Creator {
  _id: string;
  fullName?: string;
  profileImage?: string;
  mediaCreatorProfile?: {
    totalFollowers?: number;
    totalFollowing?: number;
  };
}

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function NewsSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [suggestedCreators, setSuggestedCreators] = useState<Creator[]>([]);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;
    const fetchSuggestions = async () => {
      try {
        const res = await mediaAPI.searchCreators("", { limit: 5 });
        const filtered = (res.data.users || []).filter(
          (c: Creator) => c._id !== user._id
        );
        setSuggestedCreators(filtered.slice(0, 4));
      } catch {
        // silent
      }
    };
    fetchSuggestions();
  }, [mounted, user]);

  useEffect(() => {
    if (!mounted || !user) return;
    const fetchUnread = async () => {
      try {
        const res = await notificationAPI.getNotifications({
          filter: "unread",
          limit: 1,
        });
        setUnreadCount(res.data.unreadCount || 0);
      } catch {
        // silent
      }
    };
    fetchUnread();
  }, [mounted, user]);

  const navLinks = useMemo<NavLink[]>(() => {
    const base: NavLink[] = [
      { name: "Home Feed", href: "/news", icon: Home },
      { name: "Explore", href: "/news/search", icon: Search },
      { name: "Create Post", href: "/news/create", icon: PlusCircle },
      { name: "Notifications", href: "/news/notifications", icon: Bell, badge: unreadCount },
    ];
    if (mounted && user?._id) {
      base.push({ name: "My Profile", href: `/news/profile/${user._id}`, icon: User });
    } else {
      base.push({ name: "My Profile", href: "/news/profile", icon: User });
    }
    return base;
  }, [mounted, user, unreadCount]);

  const isActive = (href: string) => {
  if (href === "/news") {
    return pathname === "/news";
  }

  return pathname === href || pathname.startsWith(href + "/");
};

  if (!mounted) {
    return (
      <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-64px)] sticky top-[64px] p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-slate-100 rounded-2xl" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-[calc(100vh-64px)] sticky top-[64px] py-6 pr-6 overflow-y-auto scrollbar-hide">
      {/* Profile Card */}
      <Link
        href={`/news/profile/${user?._id}`}
        className="flex items-center gap-3 p-4 mb-6 bg-white/70 backdrop-blur-sm rounded-2xl ring-1 ring-slate-900/5 shadow-sm hover:shadow-md hover:ring-slate-900/10 transition-all duration-200 group"
        aria-label={`View my profile – ${user?.fullName}`}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg ring-1 ring-indigo-300 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
          {user?.profileImage ? (
            <Image
              src={getMediaUrl(user.profileImage)}
              alt={user?.fullName || "My avatar"}
              width={48}
              height={48}
              className="object-cover"
              unoptimized
            />
          ) : (
            user?.fullName?.charAt(0) || "U"
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 truncate leading-tight">
            {user?.fullName}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            @{user?.socialProfile?.username || user?.email?.split("@")[0]}
          </p>
        
        </div>
      </Link>

      {/* Main Navigation */}
      <nav className="space-y-1.5 mb-8 flex-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`w-5 h-5 ${active ? "text-indigo-100" : "text-slate-400"}`} />
              <span>{link.name}</span>

              {link.badge ? (
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-full ${
                    active ? "bg-white text-indigo-700" : "bg-red-500 text-white"
                  }`}
                >
                  {link.badge > 99 ? "99+" : link.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Suggested Creators */}
      {suggestedCreators.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Who to follow
            </h4>
            <Link
              href="/news/search"
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              See All
            </Link>
          </div>

          <div className="space-y-3">
            {suggestedCreators.map((creator) => (
              <div key={creator._id} className="flex items-center justify-between group">
                <Link
                  href={`/news/profile/${creator._id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                  aria-label={`View ${creator.fullName}'s profile`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0 ring-1 ring-slate-200 group-hover:ring-indigo-200 transition-all overflow-hidden">
                    {creator.profileImage ? (
                      <Image
                        src={getMediaUrl(creator.profileImage)}
                        alt={creator.fullName || "Creator"}
                        width={36}
                        height={36}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      creator.fullName?.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
                      {creator.fullName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {creator.mediaCreatorProfile?.totalFollowers || 0} followers
                    </p>
                  </div>
                </Link>
                <div className="ml-2">
                  <FollowButton userId={creator._id} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200/60 text-[11px] text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} Samraddh Bharat</p>
      </div>
    </aside>
  );
}