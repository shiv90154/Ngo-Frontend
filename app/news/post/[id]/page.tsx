"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import PostCard from "@/components/news/PostCard";
import CommentItem from "@/components/news/CommentItem";
import { Send, Loader2, MessageSquare, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface Comment {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  content: string;
  commentsCount?: number;
  media?: { url: string }[];
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  // ...any other fields used
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const res = await mediaAPI.getPost(params.id as string);
      setPost(res.data.post as Post);
    } catch (error) {
      console.error("Failed to fetch post:", error);
      toast.error("This post might have been deleted.");
      router.push("/news");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  const fetchComments = useCallback(
    async (page: number) => {
      try {
        const res = await mediaAPI.getComments(params.id as string, {
          page,
          limit: 10,
        });
        const fetchedComments = res.data.comments as Comment[];
        if (page === 1) {
          setComments(fetchedComments);
        } else {
          setComments((prev) => [...prev, ...fetchedComments]);
        }
        setHasMoreComments(res.data.currentPage < res.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    },
    [params.id]
  );

  useEffect(() => {
    fetchPost();
    fetchComments(1);
  }, [fetchPost, fetchComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await mediaAPI.addComment(params.id as string, commentText);
      setComments((prev) => [res.data.comment as Comment, ...prev]);
      setCommentText("");
      setPost((prev) =>
        prev ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 } : prev
      );
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setPost((prev) =>
      prev
        ? { ...prev, commentsCount: Math.max(0, (prev.commentsCount || 0) - 1) }
        : prev
    );
  };

  const handlePostUpdate = (postId: string, data: Partial<Post>) => {
    setPost((prev) => (prev ? { ...prev, ...data } : prev));
  };

  // --- Premium Loading Skeleton ---
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6 pt-6">
        {/* Back button skeleton */}
        <div className="h-8 w-28 bg-slate-200/70 rounded-full animate-pulse" />
        {/* Post skeleton */}
        <div className="h-64 bg-white/70 rounded-2xl ring-1 ring-slate-900/5 animate-pulse" />
        {/* Comment input skeleton */}
        <div className="h-16 bg-white/70 rounded-2xl ring-1 ring-slate-900/5 animate-pulse" />
        {/* Comment skeletons */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-white/50 rounded-2xl ring-1 ring-slate-900/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
      {/* Back Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group mt-6"
      >
        <motion.div
          whileHover={{ x: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.div>
        <span className="font-semibold text-sm">Back to Feed</span>
      </motion.button>

      {/* PostCard (already upgraded) */}
      <PostCard post={post} onUpdate={handlePostUpdate} />

      {/* Discussion Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-white/70 backdrop-blur-sm ring-1 ring-slate-900/5">
          <MessageSquare className="w-4 h-4 text-slate-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Discussion{" "}
          <span className="text-slate-400 font-medium">
            ({post.commentsCount || 0})
          </span>
        </h2>
      </div>

      {/* Comment Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-lg rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-4"
      >
        <form onSubmit={handleAddComment} className="flex items-center gap-3">
          {/* User avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm ring-1 ring-indigo-300/60 shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              user?.fullName?.charAt(0) || "?"
            )}
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a thoughtful reply..."
              className="w-full pl-4 pr-14 py-3 bg-slate-50/80 rounded-2xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none placeholder:text-slate-400"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-sm 
                       disabled:opacity-40 disabled:shadow-none hover:shadow-md transition-all"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Comments List */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-lg rounded-2xl ring-1 ring-slate-900/5 shadow-sm overflow-hidden"
      >
        <AnimatePresence mode="popLayout">
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">
                No comments yet. Be the first to share your thoughts.
              </p>
            </motion.div>
          ) : (
            comments.map((comment, idx) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b border-slate-100 last:border-b-0"
              >
                <CommentItem
                  comment={comment}
                  onDelete={handleDeleteComment}
                  postAuthorId={post.author._id}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Load More */}
        {hasMoreComments && comments.length > 0 && (
          <button
            onClick={() => {
              const nextPage = commentPage + 1;
              setCommentPage(nextPage);
              fetchComments(nextPage);
            }}
            className="w-full py-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-50/50 transition-all border-t border-slate-100"
          >
            Load older comments
          </button>
        )}
      </motion.div>
    </div>
  );
}