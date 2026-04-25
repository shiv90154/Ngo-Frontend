// components/news/StoryRow.tsx
"use client";

import { useEffect, useState } from "react";
import { mediaAPI } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; 
import { motion } from "framer-motion";
import { getMediaUrl } from "@/utils/mediaUrl";

export default function StoryRow() {
  const { user } = useAuth();
  const [creators, setCreators] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await mediaAPI.searchCreators("", { limit: 8 });
        setCreators(res.data.users || []);
      } catch (error) {
        console.error("Failed to load stories:", error);
      }
    };
    fetchStories();
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-4 overflow-x-auto">
        <div className="flex gap-5 min-w-max">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse" />
              <div className="w-12 h-3 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-5 min-w-max">
        {/* My Story */}
        <Link
          href="/news/create"
          className="flex flex-col items-center gap-2 shrink-0 group"
          aria-label="Create your story"
        >
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-xl ring-2 ring-offset-2 ring-transparent group-hover:ring-indigo-400/30 transition-all overflow-hidden"
            >
              {user?.profileImage ? (
                <Image
                  src={getMediaUrl(user.profileImage)}
                  alt="Your story"
                  width={64}
                  height={64}
                  className="object-cover"
                  unoptimized
                />
              ) : (
                user?.fullName?.charAt(0) || "U"
              )}
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full ring-2 ring-white shadow-sm"
            >
              <Plus className="w-3 h-3" />
            </motion.div>
          </div>
          <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-700 transition-colors">
            Your Story
          </span>
        </Link>

        {/* Other Stories */}
        {creators.map((creator: any) => (
          <Link
            key={creator._id}
            href={`/news/profile/${creator._id}`}
            className="flex flex-col items-center gap-2 shrink-0 group"
            aria-label={`${creator.fullName}'s story`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 p-0.5"
            >
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 text-sm font-medium ring-2 ring-offset-2 ring-transparent group-hover:ring-indigo-400/30 transition-all overflow-hidden">
                  {creator.profileImage ? (
                    <Image
                      src={getMediaUrl(creator.profileImage)}
                      alt={`${creator.fullName}'s story`}
                      width={60}
                      height={60}
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    creator.fullName?.charAt(0)
                  )}
                </div>
              </div>
            </motion.div>
            <span className="text-xs text-slate-600 group-hover:text-indigo-700 transition-colors truncate max-w-[64px]">
              {creator.fullName?.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}