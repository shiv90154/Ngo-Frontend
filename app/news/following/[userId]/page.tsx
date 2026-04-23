"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import Link from "next/link";
import { Loader2, UserPlus, ChevronLeft, Compass } from "lucide-react";
import FollowButton from "@/components/news/FollowButton";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Helpers ----------
const BASE_URL = "http://localhost:5000"; // or process.env.NEXT_PUBLIC_API_URL
const getMediaUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
};

// ---------- Types ----------
interface FollowingUser {
  _id: string;
  fullName?: string;
  profileImage?: string;                 // ✅ renamed from avatar
  mediaCreatorProfile?: {
    totalFollowers?: number;
    totalFollowing?: number;
  };
}

export default function FollowingPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [following, setFollowing] = useState<FollowingUser[]>([]);
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
      const fetchedUsers: FollowingUser[] = res.data.following ?? [];
      if (page === 1) {
        setFollowing(fetchedUsers);
      } else {
        setFollowing((prev) => [...prev, ...fetchedUsers]);
      }
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  // ---------- Loading Skeleton ----------
  if (loading && page === 1) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="h-10 w-28 bg-slate-200/70 rounded-full animate-pulse mb-6" />
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
              <div className="w-20 h-8 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100/70 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </motion.button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Following</h1>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Curated feed sources
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm overflow-hidden">
        {following.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 px-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-200/60">
              <Compass className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Not following anyone yet
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8">
              Follow creators to see their latest news and regional updates in your feed.
            </p>
            <Link
              href="/news/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-500/25
                         hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              Find Creators
            </Link>
          </motion.div>
        ) : (
          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {following.map((user, idx) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/30 transition-colors group"
                >
                  <Link
                    href={`/news/profile/${user._id}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm ring-1 ring-indigo-300/60 overflow-hidden shrink-0">
                      {user.profileImage ? (
                        <img
                          src={getMediaUrl(user.profileImage)}   // ✅ FIXED
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.fullName?.charAt(0) || "?"
                      )}
                    </div>

                    <div className="truncate">
                      <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {user.mediaCreatorProfile?.totalFollowers ?? 0}{" "}
                        followers
                      </p>
                    </div>
                  </Link>

                  <div className="ml-4 shrink-0">
                    <FollowButton
                      userId={user._id}
                      size="sm"
                      initialIsFollowing={true}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {page < totalPages && !loading && (
              <button
                onClick={handleLoadMore}
                className="w-full py-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-50/50 transition-all border-t border-slate-100"
              >
                Load more connections
              </button>
            )}
          </div>
        )}
      </div>

      {!loading && following.length > 0 && (
        <p className="text-center text-[11px] font-medium text-slate-400">
          Showing {following.length} subscription{following.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}