"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Book, Stethoscope, Newspaper, User } from "lucide-react";
import Link from "next/link";
import api  from "@/lib/api"; 
interface SearchResults {
  courses?: any[];
  doctors?: any[];
  news?: any[];
  users?: any[];
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    if (query.length < 2) { setResults({}); setOpen(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.results);
        setOpen(true);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isEmpty = !results.courses?.length && !results.doctors?.length && !results.news?.length && !results.users?.length;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search everything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (Object.keys(results).length > 0) setOpen(true); }}
          className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-[#1a237e] focus:border-transparent bg-white"
        />
        {loading && <Loader2 className="absolute right-3 top-2.5 animate-spin text-gray-400" size={16} />}
      </div>

      {open && (
        <div className="absolute mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center"><Loader2 className="animate-spin mx-auto" /></div>
          ) : isEmpty ? (
            <p className="p-4 text-center text-sm text-gray-500">No results found.</p>
          ) : (
            <>
              {results.courses?.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-bold text-gray-500 px-3 py-1 uppercase">Courses</p>
                  {results.courses.map((c: any) => (
                    <Link key={c._id} href={`/education/courses/${c._id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
                      <Book size={16} className="text-purple-600" />
                      <span className="text-sm">{c.title}</span>
                    </Link>
                  ))}
                </div>
              )}
              {results.doctors?.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-bold text-gray-500 px-3 py-1 uppercase">Doctors</p>
                  {results.doctors.map((d: any) => (
                    <Link key={d._id} href={`/healthcare/doctors/${d._id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
                      <Stethoscope size={16} className="text-red-600" />
                      <span className="text-sm">Dr. {d.fullName} – {d.doctorProfile?.specialization}</span>
                    </Link>
                  ))}
                </div>
              )}
              {results.news?.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-bold text-gray-500 px-3 py-1 uppercase">News</p>
                  {results.news.map((n: any) => (
                    <Link key={n._id} href={`/news/post/${n._id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
                      <Newspaper size={16} className="text-orange-600" />
                      <span className="text-sm truncate">{n.content?.slice(0, 60)}</span>
                    </Link>
                  ))}
                </div>
              )}
              {results.users?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 px-3 py-1 uppercase">People</p>
                  {results.users.map((u: any) => (
                    <Link key={u._id} href={`/news/profile/${u._id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
                      <User size={16} className="text-blue-600" />
                      <span className="text-sm">{u.fullName} – {u.role}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}