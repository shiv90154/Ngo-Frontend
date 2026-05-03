"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Book, Stethoscope, Newspaper, User, Mic, MicOff } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

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
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US"; // can be changed based on user locale

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      inputRef.current?.focus();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Debounce search
  useEffect(() => {
    if (query.length < 2) {
      setResults({});
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.results);
        setOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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
    <div ref={containerRef} className="relative w-full max-w-lg">
      {/* Search Bar */}
      <div
        className={`relative flex items-center rounded-xl transition-shadow duration-200 ${
          open ? "shadow-lg ring-2 ring-indigo-100" : "shadow-sm hover:shadow-md"
        }`}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for courses, doctors, news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (Object.keys(results).length > 0) setOpen(true);
          }}
          className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-300 transition-colors"
        />
        {/* Mic button */}
        {micSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-200 ${
              isListening
                ? "text-red-500 bg-red-50 scale-110"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title={isListening ? "Stop listening" : "Search by voice"}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
        {loading && (
          <Loader2
            className={`absolute top-1/2 -translate-y-1/2 animate-spin text-indigo-500 ${
              micSupported ? "right-11" : "right-4"
            }`}
            size={16}
          />
        )}
      </div>

      {/* Dropdown Results */}
      {open && (
        <div className="absolute mt-3 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Results content */}
          <div className="max-h-96 overflow-y-auto p-2 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-indigo-500" size={20} />
                <span className="ml-2 text-sm text-gray-500">Searching...</span>
              </div>
            ) : isEmpty ? (
              <div className="text-center py-8">
                <Search className="mx-auto text-gray-300" size={32} />
                <p className="mt-2 text-sm text-gray-500">No results found.</p>
                <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
              </div>
            ) : (
              <>
                {results.courses?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1.5">
                      Courses
                    </p>
                    {results.courses.map((c: any) => (
                      <Link
                        key={c._id}
                        href={`/education/courses/${c._id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                          <Book size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                          {c.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {results.doctors?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1.5">
                      Doctors
                    </p>
                    {results.doctors.map((d: any) => (
                      <Link
                        key={d._id}
                        href={`/healthcare/doctors/${d._id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                          <Stethoscope size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                          Dr. {d.fullName} – {d.doctorProfile?.specialization}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {results.news?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1.5">
                      News
                    </p>
                    {results.news.map((n: any) => (
                      <Link
                        key={n._id}
                        href={`/news/post/${n._id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-orange-50 transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                          <Newspaper size={16} />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                          {n.content?.slice(0, 60)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {results.users?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1.5">
                      People
                    </p>
                    {results.users.map((u: any) => (
                      <Link
                        key={u._id}
                        href={`/news/profile/${u._id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
                      >
                        <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                          {u.fullName} – {u.role}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {/* Footer hint */}
          {!loading && !isEmpty && (
            <div className="border-t border-gray-100 px-4 py-2 bg-gray-50/50">
              <p className="text-xs text-gray-400 text-center">
                Press <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200 text-gray-600">ESC</kbd> to close
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}