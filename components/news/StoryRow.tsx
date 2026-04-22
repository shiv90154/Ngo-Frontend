// components/news/StoryRow.tsx
"use client";

import { useEffect, useState } from "react";
import { mediaAPI } from "@/lib/api";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function StoryRow() {
  const { user } = useAuth();
  const [creators, setCreators] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await mediaAPI.searchCreators("", { limit: 8 });
        setCreators(res.data.users);
      } catch (error) {
        console.error("Failed to load stories:", error);
      }
    };
    fetchStories();
  }, []);

  // 避免 hydration 错误：在未挂载时返回骨架占位，且不渲染用户特定内容
  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
        <div className="flex gap-5 min-w-max">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-5 min-w-max">
        {/* My Story */}
        <Link href="/news/create" className="flex flex-col items-center gap-2 shrink-0 group">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-[#1a237e] font-semibold text-xl ring-2 ring-offset-2 ring-transparent group-hover:ring-[#1a237e]/20 transition-all"
            >
              {user?.fullName?.charAt(0) || "U"}
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 bg-[#1a237e] text-white p-1 rounded-full ring-2 ring-white"
            >
              <Plus className="w-3 h-3" />
            </motion.div>
          </div>
          <span className="text-xs font-medium text-slate-600 group-hover:text-[#1a237e] transition-colors">
            Your Story
          </span>
        </Link>

        {/* Other Stories */}
        {creators.map((creator: any) => (
          <Link
            key={creator._id}
            href={`/news/profile/${creator._id}`}
            className="flex flex-col items-center gap-2 shrink-0 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a237e] to-[#283593] p-0.5"
            >
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <div className="w-full h-full rounded-full bg-[#1a237e] flex items-center justify-center text-white text-sm font-medium ring-2 ring-offset-2 ring-transparent group-hover:ring-[#1a237e]/20 transition-all">
                  {creator.fullName?.charAt(0)}
                </div>
              </div>
            </motion.div>
            <span className="text-xs text-slate-600 group-hover:text-[#1a237e] transition-colors truncate max-w-[64px]">
              {creator.fullName?.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}