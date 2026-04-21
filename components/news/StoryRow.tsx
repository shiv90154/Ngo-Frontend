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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await mediaAPI.searchCreators("", { limit: 10 });
        setCreators(res.data.users);
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-4 mb-6 overflow-hidden">
      <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-1">
        {/* Create Story Button */}
        <Link href="/news/create" className="flex flex-col items-center gap-2 shrink-0 group">
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-[#1a237e] text-xl font-bold border-2 border-dashed border-slate-300 group-hover:border-[#1a237e] group-hover:bg-indigo-50 transition-colors"
            >
              {user?.fullName?.charAt(0) || "U"}
            </motion.div>
            <div className="absolute bottom-0 right-0 bg-[#1a237e] text-white p-1 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
            Your Story
          </span>
        </Link>

        {/* Story List */}
        {loading ? (
          // Skeleton Loading
          [...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-slate-100" />
              <div className="w-10 h-2 bg-slate-100 rounded" />
            </div>
          ))
        ) : (
          creators.map((creator: any) => (
            <Link 
              key={creator._id} 
              href={`/news/profile/${creator._id}`} 
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-indigo-600 p-[2px]"
              >
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-[#1a237e] text-sm font-bold overflow-hidden">
                    {creator.avatar ? (
                      <img src={creator.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{creator.fullName?.charAt(0)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
              <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors truncate w-16 text-center">
                {creator.fullName.split(" ")[0]}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}