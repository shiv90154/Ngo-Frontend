// app/news/post/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import PostCard from "@/components/news/PostCard";
import CommentItem from "@/components/news/CommentItem";
import { Send, Loader2, MessageSquare, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchComments(1);
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const res = await mediaAPI.getPost(params.id as string);
      setPost(res.data.post);
    } catch (error) {
      console.error("Failed to fetch post:", error);
      toast.error("This post might have been deleted.");
      router.push("/news");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (page: number) => {
    try {
      const res = await mediaAPI.getComments(params.id as string, { page, limit: 10 });
      if (page === 1) {
        setComments(res.data.comments);
      } else {
        setComments((prev) => [...prev, ...res.data.comments]);
      }
      setHasMoreComments(res.data.currentPage < res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await mediaAPI.addComment(params.id as string, commentText);
      setComments((prev) => [res.data.comment, ...prev]);
      setCommentText("");
      setPost((prev: any) => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }));
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c: any) => c._id !== commentId));
    setPost((prev: any) => ({ ...prev, commentsCount: Math.max(0, (prev.commentsCount || 0) - 1) }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-[#1a237e]" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Fetching Content</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Back Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Return to Feed</span>
      </button>

      {/* Main Content */}
      <div className="space-y-6">
        <PostCard 
          post={post} 
          onUpdate={(id: string, data: any) => setPost({ ...post, ...data })} 
        />

        {/* Discussion Header */}
        <div className="flex items-center gap-3 px-2">
          <MessageSquare className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Discussion <span className="text-slate-400 ml-1">({post.commentsCount || 0})</span>
          </h2>
        </div>

        {/* Comment Input Card */}
        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 p-4 border-b-2 border-slate-100">
          <form onSubmit={handleAddComment} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#1a237e] font-bold ring-1 ring-indigo-100 shrink-0 shadow-sm">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover rounded-2xl" alt="" />
              ) : (
                user?.fullName?.charAt(0)
              )}
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a thoughtful reply..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 transition-all"
              />
              <button 
                type="submit" 
                disabled={submitting || !commentText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#1a237e] text-white disabled:opacity-30 hover:bg-[#0d1440] transition-all active:scale-90"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden divide-y divide-slate-50">
          <AnimatePresence mode="popLayout">
            {comments.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                   <MessageSquare className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-slate-500 font-medium text-sm">Be the first to share your thoughts.</p>
              </motion.div>
            ) : (
              comments.map((comment: any, idx: number) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
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
          
          {hasMoreComments && (
            <button
              onClick={() => {
                const nextPage = commentPage + 1;
                setCommentPage(nextPage);
                fetchComments(nextPage);
              }}
              className="w-full py-4 text-xs font-black uppercase tracking-widest text-[#1a237e] hover:bg-slate-50 transition-all border-t border-slate-50"
            >
              Load Older Comments
            </button>
          )}
        </div>
      </div>
    </div>
  );
}