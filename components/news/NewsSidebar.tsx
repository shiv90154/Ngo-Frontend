"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { mediaAPI } from "@/lib/api";

export default function NewsSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [suggestedCreators, setSuggestedCreators] = useState([]);

  useEffect(() => {
    // Fetch popular creators for suggestions
    const fetchSuggestions = async () => {
      try {
        const res = await mediaAPI.searchCreators("", { limit: 3 });
        setSuggestedCreators(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };
    fetchSuggestions();
  }, []);

  const navLinks = [
    { name: "Feed", href: "/news/feed", icon: Home },
    { name: "Search Creators", href: "/news/search", icon: Search },
    { name: "My Profile", href: `/news/profile/${user?._id}`, icon: User },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-97px)] sticky top-[97px] p-4">
      <nav className="space-y-0.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#1a237e]/10 text-[#1a237e] border-l-3 border-[#1a237e]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#1a237e]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Suggested Creators */}
      <div className="mt-8">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Suggested Creators
        </h4>
        <div className="space-y-3">
          {suggestedCreators.map((creator: any) => (
            <Link
              key={creator._id}
              href={`/news/profile/${creator._id}`}
              className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-[#1a237e] rounded-full flex items-center justify-center text-white text-xs">
                {creator.fullName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{creator.fullName}</p>
                <p className="text-xs text-gray-500">
                  {creator.mediaCreatorProfile?.totalFollowers || 0} followers
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}