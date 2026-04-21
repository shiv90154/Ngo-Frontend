// app/(news)/profile/[userId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import ProfileHeader from "@/components/news/ProfileHeader";
import { Loader2, Image as ImageIcon, LayoutGrid, FileText, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts");

  const isOwnProfile = currentUser?._id === userId;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, statusRes] = await Promise.allSettled([
        mediaAPI.getUserPosts(userId, { limit: 50 }),
        isOwnProfile ? Promise.resolve(null) : mediaAPI.checkFollowStatus(userId),
      ]);

      if (postsRes.status === "fulfilled") {
        const fetchedPosts = postsRes.value.data.posts;
        setPosts(fetchedPosts);
        
        // Dynamic user info extraction
        if (fetchedPosts.length > 0) {
          setProfileUser(fetchedPosts[0].author);
        } else if (isOwnProfile && currentUser) {
          setProfileUser(currentUser);
        } else {
          // Fallback for empty profiles
          setProfileUser({
            _id: userId,
            fullName: "Media Creator",
            mediaCreatorProfile: { totalPosts: 0, totalFollowers: 0, totalFollowing: 0 }
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

  const handlePostUpdate = useCallback((postId: string, updatedData: any) => {
    setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, ...updatedData } : p)));
  }, []);

  const handlePostDelete = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setProfileUser((prev: any) => ({
      ...prev,
      mediaCreatorProfile: {
        ...prev.mediaCreatorProfile,
        totalPosts: Math.max(0, (prev.mediaCreatorProfile?.totalPosts || 0) - 1),
      },
    }));
  }, []);

  const mediaPosts = posts.filter((p) => p.media?.length > 0);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-8 px-4">
        <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-50 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <ProfileHeader 
        user={profileUser} 
        isOwnProfile={isOwnProfile} 
        postsCount={posts.length} 
      />

      {/* Modern Tabs */}
      <div className="mt-8">
        <div className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4 px-2">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm ring-1 ring-slate-900/5 max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === "posts" ? "bg-[#1a237e] text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <FileText className="w-4 h-4" />
              Feed
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === "media" ? "bg-[#1a237e] text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Media
            </button>
          </div>
        </div>

        <div className="mt-6 px-2 sm:px-0">
          <AnimatePresence mode="wait">
            {activeTab === "posts" ? (
              <motion.div
                key="posts-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {posts.length === 0 ? (
                  <EmptyState icon={<LayoutGrid />} text="No stories published yet." />
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
            ) : (
              <motion.div
                key="media-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {mediaPosts.length === 0 ? (
                  <EmptyState icon={<Camera />} text="No photos or videos yet." />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mediaPosts.map((post) => (
                      <button 
                        key={post._id}
                        onClick={() => setActiveTab("posts")} // Or navigate to specific post
                        className="aspect-square rounded-2xl overflow-hidden relative group ring-1 ring-slate-200"
                      >
                        <img 
                          src={post.media[0].url} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          alt="" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <ImageIcon className="text-white w-6 h-6" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="py-20 text-center bg-white rounded-3xl ring-1 ring-slate-100">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
        {icon}
      </div>
      <p className="text-slate-500 font-medium">{text}</p>
    </div>
  );
}