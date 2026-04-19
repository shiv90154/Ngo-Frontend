"use client";

import { useState } from "react";
import { mediaAPI } from "@/lib/api";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import FollowButton from "@/components/news/FollowButton";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await mediaAPI.searchCreators(query);
      setResults(res.data.users);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Find Creators</h1>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e]"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-[#1a237e] text-white rounded-xl font-medium hover:bg-[#0d1757]">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-6 w-6 text-[#1a237e]" />
        </div>
      ) : searched && results.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-500">No creators found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {results.map((user: any) => (
            <div key={user._id} className="p-4 flex items-center justify-between">
              <Link href={`/news/profile/${user._id}`} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-medium">
                  {user.fullName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {user.mediaCreatorProfile?.totalFollowers || 0} followers
                  </p>
                </div>
              </Link>
              <FollowButton userId={user._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}