"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import PostCard from "@/components/news/PostCard";
import CommentItem from "@/components/news/CommentItem";
import { Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState([]);
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
      toast.error("Post not found");
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
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
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
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PostCard post={post} onUpdate={(id: string, data: any) => setPost({ ...post, ...data })} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleAddComment} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a237e] rounded-full flex items-center justify-center text-white text-sm">
            {user?.fullName?.charAt(0)}
          </div>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#1a237e]"
          />
          <button type="submit" disabled={submitting || !commentText.trim()}>
            <Send className="w-5 h-5 text-[#1a237e]" />
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
        {comments.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment: any) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              postAuthorId={post.author._id}
            />
          ))
        )}
        {hasMoreComments && (
          <button
            onClick={() => {
              setCommentPage((p) => p + 1);
              fetchComments(commentPage + 1);
            }}
            className="w-full py-3 text-sm text-[#1a237e] hover:bg-gray-50"
          >
            Load more comments
          </button>
        )}
      </div>
    </div>
  );
}