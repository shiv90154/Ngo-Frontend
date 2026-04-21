// app/(news)/news/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import StoryRow from "@/components/news/StoryRow";
import { Loader2, Newspaper, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function NewsFeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
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
      toast.success("You are now a media creator!");
    } catch (error) {
      console.error("Failed to become creator:", error);
      toast.error("Could not enable creator status");
    }
  };

  if (!isCreator && !loading) {
    return (
      <div className="bg-indigo-50/50 rounded-3xl ring-1 ring-indigo-100 p-10 text-center max-w-lg mx-auto mt-8">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-5 ring-1 ring-slate-900/5">
          <Sparkles className="w-8 h-8 text-[#1a237e]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Become a Media Creator
        </h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Join our growing community of creators. Share your unique perspective, breaking news, and engaging stories with the world.
        </p>
        <button
          onClick={handleBecomeCreator}
          className="bg-[#1a237e] text-white px-8 py-3 rounded-full font-medium hover:bg-[#0d1757] transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          Start Creating Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stories Row */}
      <StoryRow />

      {posts.length === 0 && !loading ? (
        <div className="bg-white rounded-3xl p-12 text-center ring-1 ring-slate-900/5 shadow-sm">
          <Newspaper className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Your feed is quiet</h3>
          <p className="text-slate-500 mb-6">Follow more creators to discover new stories.</p>
          <Link 
            href="/news/search" 
            className="text-[#1a237e] bg-indigo-50 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors inline-flex items-center gap-2"
          >
            Explore Creators <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post: any, index) => {
            if (index === posts.length - 1) {
              return (
                <div ref={lastPostRef} key={post._id}>
                  <PostCard
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                </div>
              );
            }
            return (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            );
          })}
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
        </div>
      )}
    </div>
  );
}