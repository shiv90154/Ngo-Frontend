// app/news/following/[userId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import Link from "next/link";
import { Loader2, UserPlus, ChevronLeft, Compass } from "lucide-react";
import FollowButton from "@/components/news/FollowButton";
import { motion, AnimatePresence } from "framer-motion";

export default function FollowingPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFollowing();
  }, [userId, page]);

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const res = await mediaAPI.getFollowing(userId, { page, limit: 20 });
      if (page === 1) {
        setFollowing(res.data.following);
      } else {
        setFollowing((prev) => [...prev, ...res.data.following]);
      }
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 px-2 sm:px-0">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-none">Following</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Curated Feed Sources</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
        {loading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin h-8 w-8 text-[#1a237e] mb-4" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Syncing List</span>
          </div>
        ) : following.length === 0 ? (
          <div className="py-20 text-center px-8">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
              <Compass className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Not following anyone yet</h3>
            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
              Follow creators to see their latest news and regional updates in your feed.
            </p>
            <Link 
              href="/news/search" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a237e] text-white rounded-2xl font-bold text-sm hover:bg-[#0d1440] transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Find Creators
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {following.map((f: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={f._id} 
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/30 transition-colors group"
                >
                  <Link href={`/news/profile/${f._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-[#1a237e] font-bold text-base shadow-inner ring-1 ring-slate-200/50">
                      {f.avatar ? (
                        <img src={f.avatar} className="w-full h-full object-cover rounded-2xl" alt="" />
                      ) : (
                        f.fullName?.charAt(0)
                      )}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 group-hover:text-[#1a237e] transition-colors truncate">
                        {f.fullName}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                        {f.mediaCreatorProfile?.totalFollowers || 0} Followers
                      </p>
                    </div>
                  </Link>
                  
                  <div className="ml-4 shrink-0">
                    <FollowButton userId={f._id} size="sm" initialIsFollowing={true} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {page < totalPages && !loading && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full py-5 text-sm font-bold text-slate-500 hover:text-[#1a237e] hover:bg-slate-50 transition-all border-t border-slate-50"
          >
            Load More Connections
          </button>
        )}
      </div>

      {/* Stats Footer */}
      {!loading && following.length > 0 && (
        <p className="mt-6 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Showing {following.length} Subscriptions
        </p>
      )}
    </div>
  );
}