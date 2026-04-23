"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import ProfileHeader from "@/components/news/ProfileHeader";
import { Loader2, ImageIcon, FileText, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  _id: string;
  fullName?: string;
  email?: string;
  profileImage?: string;                 // ✅ added
  socialProfile?: { username?: string };
  mediaCreatorProfile?: {
    bio?: string;
    totalPosts?: number;
    totalFollowers?: number;
    totalFollowing?: number;
  };
  state?: string;
  district?: string;
  createdAt?: string;
}

interface Post {
  _id: string;
  author: UserProfile;
  media?: { url: string }[];
  // ...other fields
}

const BASE_URL = "http://localhost:5000"; // or process.env.NEXT_PUBLIC_API_URL
const getMediaUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
};

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts");

  const isOwnProfile = currentUser?._id === userId;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes] = await Promise.allSettled([
        mediaAPI.getUserPosts(userId, { limit: 50 }),
      ]);

      if (postsRes.status === "fulfilled") {
        const fetchedPosts = postsRes.value.data.posts ?? [];
        setPosts(fetchedPosts);

        if (fetchedPosts.length > 0) {
          setProfileUser(fetchedPosts[0].author as UserProfile);
        } else if (isOwnProfile && currentUser) {
          setProfileUser(currentUser as unknown as UserProfile);
        } else {
          setProfileUser({
            _id: userId,
            fullName: "Media Creator",
            mediaCreatorProfile: {
              totalPosts: 0,
              totalFollowers: 0,
              totalFollowing: 0,
            },
          });
        }
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      toast.error("Profile unavailable");
    } finally {
      setLoading(false);
    }
  }, [userId, isOwnProfile, currentUser]);

  useEffect(() => {
    if (userId) fetchAllData();
  }, [fetchAllData, userId]);

  const handlePostUpdate = useCallback((postId: string, updatedData: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, ...updatedData } : p))
    );
  }, []);

  const handlePostDelete = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setProfileUser((prev) =>
      prev
        ? {
            ...prev,
            mediaCreatorProfile: {
              ...prev.mediaCreatorProfile,
              totalPosts: Math.max(0, (prev.mediaCreatorProfile?.totalPosts ?? 0) - 1),
              totalFollowers: prev.mediaCreatorProfile?.totalFollowers ?? 0,
              totalFollowing: prev.mediaCreatorProfile?.totalFollowing ?? 0,
            },
          }
        : prev
    );
  }, []);

  const mediaPosts = posts.filter((p) => p.media?.length > 0);

  // --- Premium Loading Skeleton ---
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 overflow-hidden animate-pulse">
          <div className="h-32 bg-slate-200" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end gap-5">
              <div className="w-24 h-24 rounded-full bg-slate-200 ring-4 ring-white" />
              <div className="space-y-2 mb-2 flex-1">
                <div className="h-5 w-48 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="flex gap-8 mt-6 pt-5 border-t border-slate-100">
              <div className="h-4 w-16 bg-slate-100 rounded" />
              <div className="h-4 w-16 bg-slate-100 rounded" />
              <div className="h-4 w-12 bg-slate-100 rounded" />
            </div>
          </div>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl ring-1 ring-slate-900/5 max-w-sm mx-auto">
          <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
          <div className="flex-1 h-9 bg-slate-50 rounded-xl" />
        </div>

        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-white/60 rounded-2xl ring-1 ring-slate-900/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!profileUser) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-8">
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        postsCount={posts.length}
      />

      {/* Tab Switcher */}
      <div className="sticky top-16 z-20 pt-2 backdrop-blur-sm">
        <div className="flex bg-white/70 backdrop-blur-md p-1.5 rounded-2xl ring-1 ring-slate-900/5 shadow-sm max-w-sm mx-auto">
          <motion.button
            onClick={() => setActiveTab("posts")}
            className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wide rounded-xl transition-colors duration-200 ${
              activeTab === "posts" ? "text-white" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {activeTab === "posts" && (
              <motion.div
                layoutId="profileTab"
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Feed</span>
            </span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("media")}
            className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wide rounded-xl transition-colors duration-200 ${
              activeTab === "media" ? "text-white" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {activeTab === "media" && (
              <motion.div
                layoutId="profileTab"
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>Media</span>
            </span>
          </motion.button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "posts" && (
            <motion.div
              key="posts-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {posts.length === 0 ? (
                <EmptyState icon={<FileText className="w-6 h-6" />} text="No stories published yet." />
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                ))
              )}
            </motion.div>
          )}

          {activeTab === "media" && (
            <motion.div
              key="media-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {mediaPosts.length === 0 ? (
                <EmptyState icon={<Camera className="w-6 h-6" />} text="No photos or videos yet." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaPosts.map((post) => (
                    <motion.button
                      key={post._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab("posts")}
                      className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-slate-200/70 shadow-sm group"
                    >
                      <img
                        src={getMediaUrl(post.media[0].url)}   // ✅ fixed
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="text-white w-6 h-6 drop-shadow" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------- Reusable Empty State -------- */
function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-16 text-center bg-white/70 backdrop-blur-sm rounded-2xl ring-1 ring-slate-900/5 shadow-sm"
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 ring-1 ring-slate-200/60">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </motion.div>
  );
}