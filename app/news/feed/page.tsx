
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import StoryRow from "@/components/news/StoryRow";
import { Loader2, Newspaper, Sparkles, Search } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Types ----------
interface Post {
  _id: string;
  content: string;
  tags?: string[];
  location?: string;
  media?: { url: string; type: "image" | "video" }[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  author: {
    _id: string;
    fullName: string;
    profileImage?: string;   // ✅ uses the correct backend field
  };
  createdAt: string;
  updatedAt: string;
}

// ---------- Skeleton Card ----------
const SkeletonCard = () => (
  <div className="bg-white/70 backdrop-blur-lg rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-2 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
    </div>
    <div className="mt-4 h-40 bg-slate-100 rounded-xl" />
  </div>
);

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user?.mediaCreatorProfile?.isCreator !== undefined) {
      setIsCreator(user.mediaCreatorProfile.isCreator);
    }
  }, [user]);

  useEffect(() => {
    fetchFeed(1);
  }, []);

  useEffect(() => {
    if (page > 1) fetchFeed(page);
  }, [page]);

  const fetchFeed = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await mediaAPI.getFeed({ page: pageNum, limit: 5 });
      const newPosts: Post[] = res.data.posts;
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (postId: string, updatedData: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, ...updatedData } : p))
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handleBecomeCreator = async () => {
    try {
      await mediaAPI.becomeCreator();
      setIsCreator(true);
    } catch (error) {
      console.error("Failed to become creator:", error);
    }
  };

  // 1. Non-Creator Welcome View
  if (!isCreator && !loading && posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-10 text-center max-w-lg mx-auto"
      >
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Start Your Creator Journey
        </h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Share news, regional updates, and stories with your community.
          Join our network of local voices today.
        </p>
        <button
          onClick={handleBecomeCreator}
          className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-8 py-3.5 rounded-full font-semibold text-sm
                     shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30
                     hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          aria-label="Become a media creator"
        >
          <Sparkles className="w-4 h-4" />
          Become a Creator
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stories Row */}
      <StoryRow />

      {/* First‑load skeleton */}
      {loading && posts.length === 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty Feed State */}
      {!loading && posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-200/60">
            <Newspaper className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Your feed is quiet
          </h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            Follow some creators to start seeing the latest news and updates.
          </p>
          <Link
            href="/news/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-500/25
                       hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            aria-label="Explore creators"
          >
            <Search className="w-4 h-4" />
            Explore Creators
          </Link>
        </motion.div>
      )}

      {/* Post Feed */}
      {posts.length > 0 && (
        <div role="feed" aria-label="News feed" className="space-y-5">
          <h2 className="sr-only">Latest posts</h2>
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                ref={index === posts.length - 1 ? lastPostRef : null}
              >
                <PostCard
                  post={post}
                  onUpdate={handlePostUpdate}
                  onDelete={handlePostDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && posts.length > 0 && (
        <div className="space-y-4 pt-2" aria-label="Loading more posts">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={`loading-more-${i}`} />
          ))}
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <div className="h-px bg-slate-200/60 w-full mb-6" />
          <p className="text-sm font-medium text-slate-400">
            You’ve reached the end of the feed ✨
          </p>
        </motion.div>
      )}
    </div>
  );
}