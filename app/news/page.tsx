"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import StoryRow from "@/components/news/StoryRow";
import Link from "next/link";
import { toast } from "react-toastify";
import { Newspaper, Sparkles, UserPlus } from "lucide-react";

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
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ---------- Skeleton ----------
const SkeletonCard = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-slate-900/5 shadow-sm animate-pulse">
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
    <div className="mt-4 h-48 bg-slate-100 rounded-xl" />
  </div>
);

// ---------- Empty feed state ----------
const EmptyFeed = () => (
  <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-12 text-center ring-1 ring-slate-900/5 shadow-sm overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-white/80" />
    <div className="relative z-10">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center">
        <Newspaper className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        Your feed is quiet
      </h3>
      <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
        Follow more creators to discover stories that matter to you.
      </p>
      <Link
        href="/news/search"
        className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full text-sm font-medium 
                   hover:bg-indigo-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        Explore Creators
        <Sparkles className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

// ---------- Creator onboarding ----------
const CreatorOnboarding = ({ onBecomeCreator }: { onBecomeCreator: () => void }) => (
  <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-10 text-center ring-1 ring-slate-900/5 shadow-xl shadow-indigo-500/5 overflow-hidden mt-8">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-amber-300/5" />
    <div className="relative z-10">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-6 ring-1 ring-slate-900/5">
        <Sparkles className="w-8 h-8 text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
        Become a Media Creator
      </h2>
      <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
        Join our community of storytellers. Share your perspective, breaking
        news, and engaging stories with the world.
      </p>
      <button
        onClick={onBecomeCreator}
        className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-8 py-3 rounded-full font-medium 
                   shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/40 
                   hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        aria-label="Become a media creator"
      >
        <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
        Start Creating Now
      </button>
    </div>
  </div>
);

// ---------- Main Feed Page ----------
export default function NewsFeedPage() {
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

  // Cleanup observer
  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  // Check if user is creator
  useEffect(() => {
    if (user?.mediaCreatorProfile?.isCreator !== undefined) {
      setIsCreator(user.mediaCreatorProfile.isCreator);
    }
  }, [user]);

  // Initial fetch
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
      const newPosts = res.data.posts as Post[];

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
      toast.success("You are now a media creator! 🎉");
    } catch (error) {
      console.error("Failed to become creator:", error);
      toast.error("Could not enable creator status");
    }
  };

  if (!isCreator && !loading) {
    return <CreatorOnboarding onBecomeCreator={handleBecomeCreator} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stories row */}
      <StoryRow />

      {/* First load skeleton */}
      {loading && posts.length === 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && <EmptyFeed />}

      {/* Post feed */}
      {posts.length > 0 && (
        <div role="feed" aria-label="News feed" className="space-y-5 sm:space-y-6">
          <h2 className="sr-only">Latest posts</h2>
          {posts.map((post, index) => {
            const isLast = index === posts.length - 1;
            return (
              <div
                key={post._id}
                ref={isLast ? lastPostRef : undefined}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PostCard
                  post={post}
                  onUpdate={handlePostUpdate}
                  onDelete={handlePostDelete}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Loading more skeleton */}
      {loading && posts.length > 0 && (
        <div className="space-y-4 pt-2" aria-label="Loading more posts">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={`loading-more-${i}`} />
          ))}
        </div>
      )}

      {/* End marker */}
      {!hasMore && posts.length > 0 && !loading && (
        <div className="text-center py-10">
          <div className="h-px bg-slate-200/60 w-full mb-6" />
          <p className="text-sm font-medium text-slate-400">
            You’ve reached the end of the feed ✨
          </p>
        </div>
      )}
    </div>
  );
}