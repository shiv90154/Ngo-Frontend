// app/news/profile/[userId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import ProfileHeader from "@/components/news/ProfileHeader";
import { ImageIcon, FileText, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getMediaUrl } from "@/utils/mediaUrl";

interface UserProfile {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  socialProfile?: {
    username?: string;
  };
  mediaCreatorProfile?: {
    isCreator?: boolean;
    creatorStatus?: string;
    bio?: string;
    totalPosts?: number;
    totalFollowers?: number;
    totalFollowing?: number;
  };
  state?: string;
  district?: string;
  block?: string;
  village?: string;
  createdAt?: string;
}

interface Post {
  _id: string;
  author: UserProfile;
  media?: { url: string; type?: string }[];
}

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
    if (!userId) return;

    setLoading(true);

    try {
      const [profileRes, postsRes] = await Promise.allSettled([
        mediaAPI.getCreatorProfile(userId),
        mediaAPI.getUserPosts(userId, { limit: 50 }),
      ]);

      if (profileRes.status === "fulfilled") {
        setProfileUser(profileRes.value.data.user);
      } else {
        console.error("Profile fetch failed:", profileRes.reason);

        if (isOwnProfile && currentUser) {
          setProfileUser(currentUser as unknown as UserProfile);
        } else {
          setProfileUser(null);
        }
      }

      if (postsRes.status === "fulfilled") {
        setPosts(postsRes.value.data.posts || []);
      } else {
        console.error("Posts fetch failed:", postsRes.reason);
        setPosts([]);
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      toast.error("Profile unavailable");
    } finally {
      setLoading(false);
    }
  }, [userId, isOwnProfile, currentUser]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handlePostUpdate = useCallback(
    (postId: string, updatedData: Partial<Post>) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, ...updatedData } : post
        )
      );
    },
    []
  );

  const handlePostDelete = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));

    setProfileUser((prev) =>
      prev
        ? {
            ...prev,
            mediaCreatorProfile: {
              ...prev.mediaCreatorProfile,
              totalPosts: Math.max(
                0,
                (prev.mediaCreatorProfile?.totalPosts ?? 0) - 1
              ),
              totalFollowers: prev.mediaCreatorProfile?.totalFollowers ?? 0,
              totalFollowing: prev.mediaCreatorProfile?.totalFollowing ?? 0,
            },
          }
        : prev
    );
  }, []);

  const mediaPosts = posts.filter((post) => post.media && post.media.length > 0);

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

        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="h-40 bg-white/60 rounded-2xl ring-1 ring-slate-900/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-white/70 rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-10">
          <h2 className="text-lg font-bold text-slate-800">
            Profile not found
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            This user profile is unavailable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-8">
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        postsCount={posts.length}
      />

      <div className="sticky top-16 z-20 pt-2 backdrop-blur-sm">
        <div className="flex bg-white/70 backdrop-blur-md p-1.5 rounded-2xl ring-1 ring-slate-900/5 shadow-sm max-w-sm mx-auto">
          <motion.button
            onClick={() => setActiveTab("posts")}
            className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wide rounded-xl transition-colors duration-200 ${
              activeTab === "posts"
                ? "text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
            aria-pressed={activeTab === "posts"}
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
              activeTab === "media"
                ? "text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
            aria-pressed={activeTab === "media"}
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
                <EmptyState
                  icon={<FileText className="w-6 h-6" />}
                  text="No stories published yet."
                />
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
                <EmptyState
                  icon={<Camera className="w-6 h-6" />}
                  text="No photos or videos yet."
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaPosts.map((post) => (
                    <motion.button
                      key={post._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab("posts")}
                      className="relative aspect-square rounded-2xl overflow-hidden ring-1 ring-slate-200/70 shadow-sm group"
                      aria-label="View post"
                    >
                      <Image
                        src={getMediaUrl(post.media?.[0]?.url || "")}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
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

function EmptyState({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
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