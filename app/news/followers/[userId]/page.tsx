// app/news/followers/[userId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import Link from "next/link";
import { Loader2, Users, ChevronLeft, Search } from "lucide-react";
import FollowButton from "@/components/news/FollowButton";
import { motion, AnimatePresence } from "framer-motion";

export default function FollowersPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFollowers();
  }, [userId, page]);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const res = await mediaAPI.getFollowers(userId, { page, limit: 20 });
      if (page === 1) {
        setFollowers(res.data.followers);
      } else {
        setFollowers((prev) => [...prev, ...res.data.followers]);
      }
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-none">Followers</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Community Network</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
        {loading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading list...</p>
          </div>
        ) : followers.length === 0 ? (
          <div className="py-20 text-center px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No followers yet</h3>
            <p className="text-slate-500 text-sm">When people follow this creator, they'll appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {followers.map((f: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={f._id} 
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                >
                  <Link href={`/news/profile/${f._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[#1a237e] font-bold text-sm shadow-sm ring-1 ring-slate-200">
                        {f.avatar ? (
                          <img src={f.avatar} className="w-full h-full object-cover rounded-2xl" alt="" />
                        ) : (
                          f.fullName?.charAt(0)
                        )}
                      </div>
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 group-hover:text-[#1a237e] transition-colors truncate">
                        {f.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                          {f.mediaCreatorProfile?.totalFollowers || 0} Followers
                        </span>
                        {f.state && (
                          <>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[11px] font-medium text-slate-500 truncate">{f.state}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  <div className="ml-4 shrink-0">
                    <FollowButton userId={f._id} size="sm" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {page < totalPages && !loading && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full py-4 text-sm font-bold text-[#1a237e] hover:bg-slate-50 transition-colors border-t border-slate-50"
          >
            Show more connections
          </button>
        )}
      </div>

      {/* Suggestion Footer */}
      <div className="mt-8 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-indigo-900">Looking for someone specific?</h4>
          <p className="text-xs text-indigo-700/70 mt-1">Search through the global directory of creators.</p>
        </div>
        <Link 
          href="/news/search" 
          className="p-2 bg-white rounded-xl shadow-sm text-[#1a237e] hover:bg-indigo-600 hover:text-white transition-all"
        >
          <Search className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}