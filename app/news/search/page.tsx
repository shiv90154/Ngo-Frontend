// app/news/search/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { mediaAPI } from "@/lib/api";
import { Search, Loader2, X, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/components/news/FollowButton";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from "@/utils/mediaUrl";

// ---------- Types ----------
interface Creator {
  _id: string;
  fullName?: string;
  profileImage?: string;
  state?: string;
  mediaCreatorProfile?: {
    totalFollowers?: number;
    totalFollowing?: number;
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setResults([]);
        setHasSearched(false);
        setLoading(false);
        return;
      }
      setHasSearched(true);
      try {
        const res = await mediaAPI.searchCreators(searchTerm);
        setResults(res.data.users || []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setLoading(true);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setLoading(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const quickTags = ['News', 'Sports', 'Politics', 'Local'];

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-6">
      {/* Search Bar Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-indigo-100/80 shadow-sm">
            <Compass className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Discover
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <label htmlFor="search-input" className="sr-only">
            Search creators
          </label>
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search creators, journalists, or topics..."
            className="w-full pl-12 pr-12 py-3.5 bg-slate-50/80 backdrop-blur-sm rounded-2xl text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none placeholder:text-slate-400"
            autoFocus
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Animated loading bar */}
        <div className="h-1 mt-3 rounded-full overflow-hidden bg-slate-100 relative">
          {loading && (
            <motion.div
              className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
              animate={{ x: ['0%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
          )}
        </div>
      </motion.div>

      {/* Results Container */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Initial empty state */}
          {!hasSearched && !loading && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Find your community
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                Search for local creators to stay updated with what's happening in your area.
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {quickTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      setLoading(true);
                      debouncedSearch(tag);
                    }}
                    className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 text-xs font-semibold rounded-xl transition-colors ring-1 ring-slate-100"
                    aria-label={`Search for ${tag}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* No results */}
          {hasSearched && !loading && results.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-200/60">
                <X className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No results for "{query}"
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Check your spelling or try another name.
              </p>
            </motion.div>
          )}

          {/* Results list */}
          {hasSearched && results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-slate-100"
            >
              {results.map((user, idx) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/30 transition-colors group"
                >
                  <Link
                    href={`/news/profile/${user._id}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm ring-1 ring-indigo-300/60 overflow-hidden shrink-0">
                      {user.profileImage ? (
                        <Image
                          src={getMediaUrl(user.profileImage)}
                          alt={user.fullName || "Creator"}
                          width={44}
                          height={44}
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        user.fullName?.charAt(0) || "?"
                      )}
                    </div>

                    <div className="truncate">
                      <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                        {user.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-slate-500">
                          {user.mediaCreatorProfile?.totalFollowers ?? 0} followers
                        </span>
                        {user.state && (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[11px] font-medium text-slate-500 truncate">
                              {user.state}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="ml-4 shrink-0">
                    <FollowButton userId={user._id} size="sm" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading skeleton */}
      {loading && !hasSearched && (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-11 h-11 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
              <div className="w-16 h-8 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}