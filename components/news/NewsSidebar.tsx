"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, TrendingUp, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { mediaAPI } from "@/lib/api";

export default function NewsSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [suggestedCreators, setSuggestedCreators] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await mediaAPI.searchCreators("", { limit: 5 });
        setSuggestedCreators(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };
    fetchSuggestions();
  }, []);

  const navLinks = [
    { name: "Feed", href: "/news", icon: Home },
    { name: "Search", href: "/news/search", icon: Search },
    { name: "Create Post", href: "/news/create", icon: PlusCircle },
    { name: "My Profile", href: mounted ? `/news/profile/${user?._id}` : "/news/profile", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/news" && pathname === "/news") return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-[calc(100vh-97px)] sticky top-[97px] p-4">
      {/* User Summary */}
      {mounted ? (
        <Link href={`/news/profile/${user?._id}`} className="flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-[#1a237e]/5 to-transparent rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1a237e] to-[#283593] rounded-full flex items-center justify-center text-white font-medium text-lg">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">@{user?.email?.split("@")[0]}</p>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-[#1a237e]/5 to-transparent rounded-xl">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-0.5 mb-6">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#1a237e]/10 text-[#1a237e]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Suggested Creators */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Suggested for you
          </h4>
          <Link href="/news/search" className="text-xs text-[#1a237e]">See All</Link>
        </div>
        <div className="space-y-3">
          {suggestedCreators.map((creator: any) => (
            <Link
              key={creator._id}
              href={`/news/profile/${creator._id}`}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="w-10 h-10 bg-[#1a237e] rounded-full flex items-center justify-center text-white text-sm font-medium">
                {creator.fullName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{creator.fullName}</p>
                <p className="text-xs text-gray-500">
                  {creator.mediaCreatorProfile?.totalFollowers || 0} followers
                </p>
              </div>
              <button className="text-xs text-[#1a237e] font-medium">Follow</button>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-400">
        <div className="flex flex-wrap gap-2 mb-2">
          <Link href="/about">About</Link> · <Link href="/help">Help</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
        </div>
        <p>© Samraddh Bharat Foundation</p>
      </div>
    </aside>
  );
}