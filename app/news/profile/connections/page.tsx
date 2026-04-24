"use client";

import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/components/news/FollowButton";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from "@/utils/mediaUrl";

type ConnectionType = "followers" | "following";

interface UserConnection {
  _id: string;
  fullName?: string;
  profileImage?: string;
  socialProfile?: {
    username?: string;
  };
  mediaCreatorProfile?: {
    totalFollowers?: number;
    totalFollowing?: number;
  };
}

// The main component that uses useSearchParams()
function ConnectionsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = params.userId as string;

  const initialTab = (searchParams.get("type") as ConnectionType) || "followers";

  const [activeTab, setActiveTab] = useState<ConnectionType>(initialTab);
  const [users, setUsers] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConnections = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await (activeTab === "followers"
        ? mediaAPI.getFollowers(userId)
        : mediaAPI.getFollowing(userId));

      const fetchedData = res.data?.users || res.data;
      setUsers(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Failed to fetch connections:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [userId, activeTab]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const filteredUsers = users.filter((u) =>
    u?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mt-6 mb-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100/70 backdrop-blur-sm transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </motion.button>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">
          {activeTab}
        </h1>
      </div>

      {/* Segmented Tabs with Animated Pill */}
      <div className="bg-white/70 backdrop-blur-md p-1 rounded-2xl ring-1 ring-slate-900/5 shadow-sm flex">
        {(["followers", "following"] as ConnectionType[]).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide rounded-xl transition-colors duration-200 ${
              activeTab === tab
                ? "text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
            aria-pressed={activeTab === tab}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="connectionTab"
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </motion.button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <label htmlFor="connections-search" className="sr-only">
          Search {activeTab}
        </label>
        <input
          id="connections-search"
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/70 backdrop-blur-md rounded-2xl text-sm ring-1 ring-slate-200
                     focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Results Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Loading {activeTab}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ delay: idx * 0.02 }}
                    className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <Link
                      href={`/news/profile/${user._id}`}
                      className="flex items-center gap-4 flex-1 min-w-0 group"
                      aria-label={`View profile of ${user.fullName}`}
                    >
                      {/* Avatar with image or fallback */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 ring-1 ring-indigo-300/60 overflow-hidden">
                        {user.profileImage ? (
                          <Image
                            src={getMediaUrl(user.profileImage)}
                            alt={user.fullName || "User avatar"}
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
                        <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-indigo-700 transition-colors">
                          {user.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          @{user.socialProfile?.username || "user"}
                        </p>
                      </div>
                    </Link>

                    <div className="ml-4">
                      <FollowButton userId={user._id} size="sm" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-200/60">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {searchQuery
                      ? `No ${activeTab} found`
                      : `No ${activeTab} yet`}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {searchQuery
                      ? "Try a different search term"
                      : "When people follow this user, they'll appear here."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Default export with Suspense boundary
export default function ConnectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <ConnectionsContent />
    </Suspense>
  );
}