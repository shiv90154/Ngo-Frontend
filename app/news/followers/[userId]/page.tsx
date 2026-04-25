"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Users, ChevronLeft, Search } from "lucide-react";
import FollowButton from "@/components/news/FollowButton";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from "@/utils/mediaUrl";

// ---------- Types ----------
interface FollowerUser {
  _id: string;
  fullName?: string;
  profileImage?: string;
  mediaCreatorProfile?: {
    totalFollowers?: number;
    totalFollowing?: number;
  };
  state?: string;
  district?: string;
}

export default function FollowersPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [followers, setFollowers] = useState<FollowerUser[]>([]);
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
      const fetchedUsers: FollowerUser[] = res.data.followers ?? [];
      if (page === 1) {
        setFollowers(fetchedUsers);
      } else {
        setFollowers((prev) => [...prev, ...fetchedUsers]);
      }
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch followers:", error);
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
        <div className="h-10 w-32 bg-slate-200/70 rounded-full animate-pulse mb-6" />
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-11 h-11 rounded-full bg-slate-200" />
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
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </motion.button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Followers</h1>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Community network
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm overflow-hidden">
        {followers.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 px-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-200/60">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No followers yet
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              When people follow this creator, they'll appear here.
            </p>
          </motion.div>
        ) : (
          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {followers.map((user, idx) => (
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
                    aria-label={`View profile of ${user.fullName}`}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm ring-1 ring-indigo-300/60 overflow-hidden shrink-0">
                      {user.profileImage ? (
                        <Image
                          src={getMediaUrl(user.profileImage)}
                          alt={user.fullName || "User"}
                          width={44}
                          height={44}
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        user.fullName?.charAt(0) || "?"
                      )}
                    </div>

                    <div className="truncate">
                      <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                        {user.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-slate-500">
                          {user.mediaCreatorProfile?.totalFollowers ?? 0}{" "}
                          followers
                        </span>
                        {user.state && (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[11px] font-medium text-slate-500 truncate">
                              {user.state}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="ml-4 shrink-0">
                    <FollowButton userId={user._id} size="sm" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {page < totalPages && !loading && (
              <button
                onClick={handleLoadMore}
                className="w-full py-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-50/50 transition-all border-t border-slate-100"
              >
                Show more connections
              </button>
            )}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-50/80 backdrop-blur-sm rounded-2xl p-5 ring-1 ring-indigo-100/60 flex items-center justify-between"
      >
        <div>
          <h4 className="text-sm font-semibold text-indigo-900">
            Looking for someone specific?
          </h4>
          <p className="text-xs text-indigo-700/70 mt-0.5">
            Search through the global directory of creators.
          </p>
        </div>
        <Link
          href="/news/search"
          className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
          aria-label="Search creators"
        >
          <Search className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
}