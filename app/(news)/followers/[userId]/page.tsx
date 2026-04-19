"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mediaAPI } from "@/lib/api";
import Link from "next/link";
import { Loader2, Users, ChevronLeft } from "lucide-react";
import FollowButton from "@/components/news/FollowButton";

export default function FollowersPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetchFollowers();
  }, [userId, page]);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const res = await mediaAPI.getFollowers(userId, { page, limit: 20 });
      if (page === 1) {
        setFollowers(res.data.followers);
        // Assuming the first follower includes the target user's info? Actually we need a separate user endpoint.
        // We can extract userInfo from a known source; for simplicity, we'll use the followers list.
      } else {
        setFollowers((prev) => [...prev, ...res.data.followers]);
      }
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch followers:", error);
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
        <h1 className="text-xl font-bold text-gray-800">Followers</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
        {loading && page === 1 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6 text-[#1a237e]" />
          </div>
        ) : followers.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No followers yet.</p>
        ) : (
          followers.map((f: any) => (
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