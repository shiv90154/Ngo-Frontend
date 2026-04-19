"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mediaAPI } from "@/lib/api";
import PostCard from "@/components/news/PostCard";
import { Loader2, Newspaper } from "lucide-react";
import Link from "next/link";

export default function FeedPage() {
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
      // Optionally refresh user context
    } catch (error) {
      console.error("Failed to become creator:", error);
    }
  };

  if (!isCreator && !loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Newspaper className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Become a Media Creator
        </h2>
        <p className="text-gray-500 mb-4">
          Join our community of creators to share news, stories, and updates.
        </p>
        <button
          onClick={handleBecomeCreator}
          className="bg-[#1a237e] text-white px-6 py-2 rounded-lg hover:bg-[#0d1757] transition"
        >
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 && !loading ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Newspaper className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No posts yet. Follow creators to see their content!</p>
          <Link href="/news/search" className="text-[#1a237e] text-sm mt-2 inline-block">
            Find creators to follow →
          </Link>
        </div>
      ) : (
        <>
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
        </>
      )}
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin h-6 w-6 text-[#1a237e]" />
        </div>
      )}
    </div>
  );
}