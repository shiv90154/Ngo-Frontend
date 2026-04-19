"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import Link from "next/link";
import { Loader2, Users, ChevronLeft } from "lucide-react";
import FollowButton from "@/components/news/FollowButton";

export default function FollowingPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFollowing();
  }, [userId, page]);

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const res = await mediaAPI.getFollowing(userId, { page, limit: 20 });
      if (page === 1) {
        setFollowing(res.data.following);
      } else {
        setFollowing((prev) => [...prev, ...res.data.following]);
      }
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch following:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/news/profile/${userId}`} className="text-gray-600 hover:text-[#1a237e]">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Following</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
        {loading && page === 1 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6 text-[#1a237e]" />
          </div>
        ) : following.length === 0 ? (
          <p className="p-6 text-center text-gray-500">Not following anyone yet.</p>
        ) : (
          following.map((f: any) => (
            <div key={f._id} className="p-4 flex items-center justify-between">
              <Link href={`/news/profile/${f._id}`} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-medium">
                  {f.fullName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{f.fullName}</p>
                  <p className="text-xs text-gray-500">
                    {f.mediaCreatorProfile?.totalFollowers || 0} followers
                  </p>
                </div>
              </Link>
              <FollowButton userId={f._id} />
            </div>
          ))
        )}
        {page < totalPages && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full py-3 text-sm text-[#1a237e] hover:bg-gray-50"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}   