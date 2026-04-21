// app/news/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import { Loader2, Newspaper, Sparkles, Search } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
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
      if (pageNum === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (postId: string, updatedData: any) => {
    setPosts((prev) =>
      prev.map((p: any) => (p._id === postId ? { ...p, ...updatedData } : p))
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p: any) => p._id !== postId));
  };

  const handleBecomeCreator = async () => {
    try {
      await mediaAPI.becomeCreator();
      setIsCreator(true);
    } catch (error) {
      console.error("Failed to become creator:", error);
    }
  };

  // 1. Unregistered Creator View
  if (!isCreator && !loading && posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 p-10 text-center max-w-lg mx-auto"
      >
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-[#1a237e]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">
          Start Your Creator Journey
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Share news, regional updates, and stories with your community. Join our network of local voices today.
        </p>
        <button
          onClick={handleBecomeCreator}
          className="w-full bg-[#1a237e] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#0d1757] transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
        >
          Become a Creator
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 2. Empty Feed View */}
      {posts.length === 0 && !loading ? (
        <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Your feed is quiet</h3>
          <p className="text-slate-500 mb-6">Follow some creators to start seeing the latest news and updates.</p>
          <Link 
            href="/news/search" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            <Search className="w-4 h-4" />
            Explore Creators
          </Link>
        </div>
      ) : (
        // 3. Post List
        <div className="space-y-6 pb-10">
          <AnimatePresence mode="popLayout">
            {posts.map((post: any, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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

      {/* 4. Loading Footer */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm ring-1 ring-slate-900/5">
            <Loader2 className="animate-spin h-5 w-5 text-[#1a237e]" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Feed</span>
          </div>
        </div>
      )}

      {/* 5. End of Feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-10">
          <div className="h-px bg-slate-100 w-full mb-6" />
          <p className="text-slate-400 font-medium text-sm">You've reached the end of the feed ✨</p>
        </div>
      )}
    </div>
  );
}