// app/news/search/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { mediaAPI } from "@/lib/api";
import { Search, Loader2, X, Compass, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import FollowButton from "@/components/news/FollowButton";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
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
        setResults(res.data.users);
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

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Search Bar Section */}
      <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Compass className="w-5 h-5 text-[#1a237e]" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discover</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search creators, journalists, or topics..."
            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1a237e]/10 placeholder:text-slate-400 transition-all font-medium"
            autoFocus
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Animated Loading Bar */}
        <div className="h-1 mt-2 rounded-full overflow-hidden bg-slate-50 relative">
          {loading && (
            <motion.div 
              layoutId="loader"
              className="absolute inset-y-0 bg-[#1a237e] w-1/3 rounded-full"
              animate={{ x: ["0%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>

      {/* Results / Discovery Area */}
      <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden">
        <AnimatePresence mode="wait">
          {!hasSearched && !loading ? (
            <motion.div 
              key="initial"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Sparkles className="w-10 h-10 text-indigo-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Find your community</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                Search for local creators to stay updated with what's happening in your area.
              </p>
              
              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap justify-center gap-2">
                {['News', 'Sports', 'Politics', 'Local'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => { setQuery(tag); setLoading(true); debouncedSearch(tag); }}
                    className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-[#1a237e] text-xs font-bold rounded-xl transition-colors border border-slate-100"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : results.length === 0 && !loading ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-20 text-center"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-rose-200" />
              </div>
              <p className="text-slate-900 font-bold">No results for "{query}"</p>
              <p className="text-slate-400 text-sm mt-1">Check your spelling or try another name.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="divide-y divide-slate-50"
            >
              {results.map((user, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={user._id} 
                  className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                >
                  <Link href={`/news/profile/${user._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-[#1a237e] flex items-center justify-center text-white font-black text-lg shadow-lg ring-2 ring-white overflow-hidden shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                      ) : (
                        user.fullName?.charAt(0)
                      )}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 group-hover:text-[#1a237e] transition-colors truncate">
                        {user.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          {user.mediaCreatorProfile?.totalFollowers || 0} Followers
                        </span>
                        {user.state && (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[11px] font-medium text-slate-500 truncate">{user.state}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="ml-4">
                    <FollowButton userId={user._id} size="sm" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Skeleton */}
      {loading && results.length === 0 && (
        <div className="bg-white rounded-3xl p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                <div className="h-3 bg-slate-50 rounded-full w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}