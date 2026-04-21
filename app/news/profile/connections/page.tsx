"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import { ArrowLeft, Users, Loader2, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import FollowButton from "@/components/news/FollowButton";
import { motion, AnimatePresence } from "framer-motion";

type ConnectionType = "followers" | "following";

export default function ConnectionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const initialTab = (searchParams.get("type") as ConnectionType) || "followers";
  
  const [activeTab, setActiveTab] = useState<ConnectionType>(initialTab);
  const [users, setUsers] = useState<any[]>([]); // Initialized as empty array
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConnections = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await (activeTab === "followers" 
        ? mediaAPI.getFollowers(userId) 
        : mediaAPI.getFollowing(userId));
      
      // Defensive check: ensure we are setting an array
      // Handles both { data: { users: [] } } and { data: [] } formats
      const fetchedData = res.data?.users || res.data;
      setUsers(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Failed to fetch connections:", error);
      setUsers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [userId, activeTab]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // Use optional chaining and fallback to empty array to prevent "undefined" errors
  const filteredUsers = (users || []).filter((u: any) => 
    u?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 my-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
          {activeTab}
        </h1>
      </div>

      {/* Segmented Control Tabs */}
      <div className="bg-slate-100 p-1 rounded-2xl flex mb-6">
        {(["followers", "following"] as ConnectionType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === tab 
                ? "bg-white text-[#1a237e] shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-2xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-[#1a237e]/10 transition-all"
        />
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-[2rem] shadow-sm ring-1 ring-slate-100 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a237e]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing List</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any, idx: number) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                  >
                    <Link href={`/news/profile/${user._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-[#1a237e] font-black shadow-inner shrink-0 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user.fullName?.charAt(0)
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-900 text-sm truncate">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                          @{user.socialProfile?.username || 'user'}
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
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="py-24 text-center"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-900 font-bold">No {activeTab} yet</p>
                  <p className="text-slate-400 text-xs mt-1">When people follow this user, they'll appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}