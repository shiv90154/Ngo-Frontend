"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Image as ImageIcon,
  Languages,
  Loader2,
  Search,
  Share2,
  Shuffle,
  Timer,
  Trash2,
  Volume2,
  X,
} from "lucide-react";

// -------------------- Educational Keywords --------------------
const EDUCATION_KEYWORDS = [
  "math", "mathematics", "algebra", "geometry", "calculus", "arithmetic",
  "science", "physics", "chemistry", "biology", "astronomy", "ecology",
  "history", "geography", "civics", "economics", "political science",
  "english", "literature", "grammar", "vocabulary",
  "computer", "programming", "coding", "ict",
  "art", "music", "physical education", "sports",
  "environment", "sustainable development",
  "ancient", "medieval", "modern history",
  "fractions", "decimals", "equations", "periodic table", "photosynthesis"
];

function isEducationalTopic(title: string, description = ""): boolean {
  const text = `${title} ${description}`.toLowerCase();
  return EDUCATION_KEYWORDS.some(keyword => text.includes(keyword));
}

// -------------------- Types & helpers --------------------
type WikiSummary = {
  title: string;
  extract?: string;
  description?: string;
  thumbnail?: { source: string };
  content_urls?: { desktop?: { page?: string } };
};

type ArticleDetails = {
  lastModified: string;
  pageUrl: string;
  references: boolean;
  images: string[];
  fullText: string;
};

type Suggestion = { title: string; description?: string };
type LanguageOption = { code: string; label: string; voice: string };
type HistoryItem = { article: WikiSummary; lang: string };

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", voice: "en-US" },
  { code: "hi", label: "Hindi", voice: "hi-IN" },
  { code: "es", label: "Spanish", voice: "es-ES" },
  { code: "fr", label: "French", voice: "fr-FR" },
  { code: "de", label: "German", voice: "de-DE" },
  { code: "ar", label: "Arabic", voice: "ar-SA" },
  { code: "ja", label: "Japanese", voice: "ja-JP" },
];

const STORAGE_KEYS = {
  recent: "wiki_recent_searches_v8",
  favorites: "wiki_favorites_v8",
  eduMode: "wiki_edu_mode_v8",
};

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch { return fallback; }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function useDebounce<T>(value: T, delay = 350): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function getVoiceLang(lang: string) {
  return LANGUAGES.find((item) => item.code === lang)?.voice || "en-US";
}

function validImageUrl(url?: string) {
  if (!url) return null;
  if (/\.(svg|ogg|oga|webm)$/i.test(url)) return null;
  return url;
}

async function fetchJson<T>(url: string, errorMessage: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/json" }, signal });
  if (!response.ok) throw new Error(response.status === 404 ? "Article not found." : errorMessage);
  return (await response.json()) as T;
}

async function fetchSuggestionsFromApi(query: string, lang: string, signal?: AbortSignal): Promise<Suggestion[]> {
  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) return [];
  try {
    const json = await fetchJson<any>(
      `https://${lang}.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${encodeURIComponent(cleanQuery)}&limit=12&namespace=0`,
      "Failed to load suggestions.",
      signal
    );
    const titles: string[] = Array.isArray(json?.[1]) ? json[1] : [];
    const descriptions: string[] = Array.isArray(json?.[2]) ? json[2] : [];
    return titles.map((title, index) => ({
      title,
      description: descriptions[index] || "Wikipedia article",
    }));
  } catch { return []; }
}

async function fetchSummaryFromApi(title: string, lang: string, signal?: AbortSignal): Promise<WikiSummary> {
  const data = await fetchJson<WikiSummary>(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.trim())}`,
    "Wikipedia request failed. Please try again.",
    signal
  );
  if (!data?.title) throw new Error("No article data found.");
  return data;
}

async function fetchImageUrl(imageTitle: string, lang: string): Promise<string | null> {
  try {
    const json = await fetchJson<any>(
      `https://${lang}.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(imageTitle)}&prop=imageinfo&iiprop=url&format=json`,
      "Failed to load image."
    );
    const page = Object.values(json?.query?.pages || {})[0] as any;
    return validImageUrl(page?.imageinfo?.[0]?.url);
  } catch { return null; }
}

async function fetchFullText(title: string, lang: string): Promise<string> {
  try {
    const json = await fetchJson<any>(
      `https://${lang}.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&explaintext=1&exsectionformat=plain&titles=${encodeURIComponent(title)}&format=json`,
      "Failed to load full article."
    );
    const page = Object.values(json?.query?.pages || {})[0] as any;
    return String(page?.extract || "").trim();
  } catch { return ""; }
}

async function fetchArticleDetails(title: string, lang: string): Promise<ArticleDetails> {
  const details: ArticleDetails = { lastModified: "", pageUrl: "", references: false, images: [], fullText: "" };
  try {
    const infoJson = await fetchJson<any>(
      `https://${lang}.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(title)}&prop=info|images&inprop=url&format=json&imlimit=14`,
      "Failed to load article details."
    );
    const page = Object.values(infoJson?.query?.pages || {})[0] as any;
    details.lastModified = page?.touched || "";
    details.pageUrl = page?.fullurl || "";
    const imageTitles: string[] = Array.isArray(page?.images)
      ? page.images
          .map((image: any) => String(image?.title || ""))
          .filter((img: string) => img && !/\.(svg|ogg|oga|webm)$/i.test(img) && !img.toLowerCase().includes("logo"))
          .slice(0, 8)
      : [];
    const imageUrls = await Promise.all(imageTitles.map((img) => fetchImageUrl(img, lang)));
    details.images = imageUrls.filter(Boolean).slice(0, 6) as string[];
  } catch {}
  try {
    const parseJson = await fetchJson<any>(
      `https://${lang}.wikipedia.org/w/api.php?origin=*&action=parse&page=${encodeURIComponent(title)}&prop=sections&format=json`,
      "Failed to load sections."
    );
    const sections = parseJson?.parse?.sections || [];
    details.references = sections.some((s: any) => String(s?.line || "").toLowerCase().includes("reference"));
  } catch {}
  details.fullText = await fetchFullText(title, lang);
  return details;
}

async function fetchTranslatedTitle(title: string, fromLang: string, toLang: string): Promise<string | null> {
  try {
    const json = await fetchJson<any>(
      `https://${fromLang}.wikipedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(title)}&prop=langlinks&lllang=${toLang}&lllimit=1&format=json`,
      "Failed to translate article."
    );
    const page = Object.values(json?.query?.pages || {})[0] as any;
    return page?.langlinks?.[0]?.["*"] || null;
  } catch { return null; }
}

// -------------------- Sub‑components --------------------
function SearchHighlight({ text, query }: { text: string; query: string }) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return <>{text}</>;
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === cleanQuery.toLowerCase() ? (
          <mark key={i} className="rounded bg-yellow-200 px-1">{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function ArticleText({ text, query }: { text: string; query: string }) {
  const [expanded, setExpanded] = useState(false);
  const cleanText = text.trim();
  useEffect(() => setExpanded(false), [cleanText]);
  if (!cleanText) return <p className="italic text-slate-500">No text available.</p>;
  const maxLength = 950;
  const isLong = cleanText.length > maxLength;
  const visibleText = isLong && !expanded ? `${cleanText.slice(0, maxLength)}…` : cleanText;
  return (
    <div>
      <p className="whitespace-pre-wrap break-words leading-8 text-slate-800">
        <SearchHighlight text={visibleText} query={query} />
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-[90vw] items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close toast"><X size={16} /></button>
    </div>
  );
}

// -------------------- Main Component --------------------
export default function WikipediaSearchEnhanced() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const debouncedQuery = useDebounce(query);

  const [data, setData] = useState<WikiSummary | null>(null);
  const [details, setDetails] = useState<ArticleDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");
  const [showFullText, setShowFullText] = useState(false);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [historyStack, setHistoryStack] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Library popover state (instead of sidebar)
  const [showLibrary, setShowLibrary] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [educationMode, setEducationMode] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const libraryRef = useRef<HTMLDivElement>(null);
  const articleCache = useRef<Map<string, WikiSummary>>(new Map());
  const detailsCache = useRef<Map<string, ArticleDetails>>(new Map());
  const activeRequestId = useRef(0);

  // Load from localStorage
  useEffect(() => {
    setRecentSearches(safeRead<string[]>(STORAGE_KEYS.recent, []));
    setFavorites(safeRead<string[]>(STORAGE_KEYS.favorites, []));
    setEducationMode(safeRead<boolean>(STORAGE_KEYS.eduMode, false));
    inputRef.current?.focus();
  }, []);

  useEffect(() => safeWrite(STORAGE_KEYS.eduMode, educationMode), [educationMode]);
  useEffect(() => safeWrite(STORAGE_KEYS.recent, recentSearches), [recentSearches]);
  useEffect(() => safeWrite(STORAGE_KEYS.favorites, favorites), [favorites]);

  // Block scroll when mobile library open
  useEffect(() => {
    document.body.style.overflow = showLibrary ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLibrary]);

  // Close library on outside click (desktop) and on escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (libraryRef.current && !libraryRef.current.contains(event.target as Node)) {
        setShowLibrary(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setShowLibrary(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Fetch suggestions with educational filter
  useEffect(() => {
    const controller = new AbortController();
    async function loadSuggestions() {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }
      let results = await fetchSuggestionsFromApi(debouncedQuery, lang, controller.signal);
      if (educationMode) {
        results = results.filter(sugg => isEducationalTopic(sugg.title, sugg.description));
      }
      setSuggestions(results);
      if (document.activeElement === inputRef.current) {
        setShowSuggestions(results.length > 0 || recentSearches.length > 0);
      }
    }
    loadSuggestions();
    return () => controller.abort();
  }, [debouncedQuery, lang, recentSearches.length, educationMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeText = showFullText && details?.fullText ? details.fullText : data?.extract || "";
  const wordCount = useMemo(() => (activeText.trim() ? activeText.trim().split(/\s+/).length : 0), [activeText]);
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const isFavorite = data ? favorites.some((item) => item.toLowerCase() === data.title.toLowerCase()) : false;
  const pdfLink = data ? `https://${lang}.wikipedia.org/api/rest_v1/page/pdf/${encodeURIComponent(data.title)}` : "";
  const isEducational = data ? isEducationalTopic(data.title, data.description) : false;

  // ---------- Core functions (unchanged) ----------
  const addToRecent = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, 10);
    });
  }, []);

  const pushToHistory = useCallback((article: WikiSummary, selectedLang: string) => {
    setHistoryStack((prev) => {
      const last = prev[prev.length - 1];
      if (last?.article.title.toLowerCase() === article.title.toLowerCase() && last.lang === selectedLang) return prev;
      const next = [...prev, { article, lang: selectedLang }].slice(-30);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, []);

  const loadDetails = useCallback(async (title: string, selectedLang: string, requestId?: number) => {
    const cacheKey = `${selectedLang}:${title.toLowerCase()}`;
    setDetails(null);
    setDetailsLoading(true);
    setShowFullText(false);
    try {
      if (detailsCache.current.has(cacheKey)) {
        if (!requestId || activeRequestId.current === requestId) setDetails(detailsCache.current.get(cacheKey)!);
        return;
      }
      const articleDetails = await fetchArticleDetails(title, selectedLang);
      detailsCache.current.set(cacheKey, articleDetails);
      if (!requestId || activeRequestId.current === requestId) setDetails(articleDetails);
    } finally {
      if (!requestId || activeRequestId.current === requestId) setDetailsLoading(false);
    }
  }, []);

  const fetchAndDisplay = useCallback(
    async (searchTerm: string, selectedLang = lang) => {
      const cleanTerm = searchTerm.trim();
      if (!cleanTerm) {
        setError("Please enter a topic.");
        inputRef.current?.focus();
        return;
      }
      const requestId = Date.now();
      activeRequestId.current = requestId;
      setLoading(true);
      setError("");
      setShowSuggestions(false);
      setDetails(null);
      setShowFullText(false);
      try {
        const cacheKey = `${selectedLang}:${cleanTerm.toLowerCase()}`;
        const article = articleCache.current.has(cacheKey)
          ? articleCache.current.get(cacheKey)!
          : await fetchSummaryFromApi(cleanTerm, selectedLang);
        if (activeRequestId.current !== requestId) return;
        articleCache.current.set(cacheKey, article);
        setLang(selectedLang);
        setData(article);
        setQuery(article.title);
        addToRecent(article.title);
        pushToHistory(article, selectedLang);
        await loadDetails(article.title, selectedLang, requestId);
        if (educationMode && !isEducationalTopic(article.title, article.description)) {
          setError("⚠️ This article may not be part of the school curriculum. You can still read it.");
        }
      } catch (err) {
        if (activeRequestId.current !== requestId) return;
        const message = err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        setData(null);
      } finally {
        if (activeRequestId.current === requestId) setLoading(false);
      }
    },
    [addToRecent, lang, loadDetails, pushToHistory, educationMode]
  );

  async function handleTranslate() {
    if (!data?.title) { setError("Search an article first, then translate it."); return; }
    if (targetLang === lang) { setToastMsg("Already selected this language"); return; }
    setTranslating(true);
    setError("");
    try {
      const translatedTitle = await fetchTranslatedTitle(data.title, lang, targetLang);
      if (!translatedTitle) { setError("Translation article is not available for this language."); return; }
      await fetchAndDisplay(translatedTitle, targetLang);
      setToastMsg("Article translated");
    } finally { setTranslating(false); }
  }

  async function handleRandomArticle() {
    const requestId = Date.now();
    activeRequestId.current = requestId;
    setLoading(true);
    setError("");
    setShowSuggestions(false);
    setDetails(null);
    setShowFullText(false);
    try {
      let article = await fetchJson<WikiSummary>(
        `https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`,
        "Failed to load random article."
      );
      if (educationMode) {
        for (let attempt = 0; attempt < 5 && !isEducationalTopic(article.title, article.description); attempt++) {
          article = await fetchJson<WikiSummary>(
            `https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`,
            "Failed to load random article."
          );
        }
      }
      if (activeRequestId.current !== requestId) return;
      setData(article);
      setQuery(article.title);
      addToRecent(article.title);
      pushToHistory(article, lang);
      await loadDetails(article.title, lang, requestId);
      if (educationMode && !isEducationalTopic(article.title, article.description))
        setError("⚠️ This random article may not be school‑level. Try again.");
    } catch (err) {
      if (activeRequestId.current !== requestId) return;
      setError(err instanceof Error ? err.message : "Failed to load random article.");
      setData(null);
    } finally {
      if (activeRequestId.current === requestId) setLoading(false);
    }
  }

  function openHistoryItem(index: number) {
    const item = historyStack[index];
    if (!item) return;
    activeRequestId.current = Date.now();
    setHistoryIndex(index);
    setData(item.article);
    setLang(item.lang);
    setQuery(item.article.title);
    setShowLibrary(false);
    loadDetails(item.article.title, item.lang, activeRequestId.current);
    if (educationMode && !isEducationalTopic(item.article.title, item.article.description))
      setError("⚠️ This article may not be part of the school curriculum.");
    else setError("");
  }

  function goBack() { if (historyIndex > 0) openHistoryItem(historyIndex - 1); }
  function goForward() { if (historyIndex < historyStack.length - 1) openHistoryItem(historyIndex + 1); }

  function clearSearch() {
    activeRequestId.current = Date.now();
    setQuery(""); setData(null); setDetails(null); setError("");
    setSuggestions([]); setShowSuggestions(false); setShowFullText(false);
    window.speechSynthesis?.cancel(); inputRef.current?.focus();
  }

  function clearHistory() { setHistoryStack([]); setHistoryIndex(-1); setToastMsg("History cleared"); }

  function toggleFavorite() {
    if (!data?.title) return;
    setFavorites((prev) => {
      const exists = prev.some((item) => item.toLowerCase() === data.title.toLowerCase());
      setToastMsg(exists ? "Removed from favorites" : "Added to favorites");
      return exists
        ? prev.filter((item) => item.toLowerCase() !== data.title.toLowerCase())
        : [data.title, ...prev].slice(0, 25);
    });
  }

  async function copyText() {
    if (!activeText) return;
    try {
      await navigator.clipboard.writeText(activeText);
      setToastMsg(showFullText ? "Full article copied" : "Summary copied");
    } catch { setError("Clipboard permission blocked."); }
  }

  async function shareArticle() {
    const articleUrl = data?.content_urls?.desktop?.page || details?.pageUrl || window.location.href;
    try {
      if (navigator.share && data) {
        await navigator.share({ title: data.title, text: activeText.slice(0, 140), url: articleUrl });
        return;
      }
      await navigator.clipboard.writeText(articleUrl);
      setToastMsg("Article link copied");
    } catch { setToastMsg("Share cancelled"); }
  }

  function downloadTxt() {
    if (!data || !activeText) return;
    const blob = new Blob([`${data.title}\n\n${activeText}`], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    a.click(); URL.revokeObjectURL(a.href);
    setToastMsg("TXT downloaded");
  }

  function speakText() {
    if (!activeText) return;
    if (!("speechSynthesis" in window)) { setToastMsg("Read aloud not supported"); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeText.slice(0, 4500));
    utterance.lang = getVoiceLang(lang);
    window.speechSynthesis.speak(utterance);
    setToastMsg("Reading started");
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); setToastMsg("Reading stopped"); }
  }

  // Category chips (UI only - non-functional, just for visual)
  const categories = ["All", "Math", "Science", "History", "Geography", "English", "Computer"];
  const [topicCategory, setTopicCategory] = useState("All"); // state kept but not used for filtering

  // -------------------- Responsive UI --------------------
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">

        {/* ==== HERO BANNER - fully responsive ==== */}
        <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-2xl p-6 sm:p-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold flex flex-wrap items-center gap-2 sm:gap-3">
            <Globe size={28} className="text-white/80 sm:size-[34]" />
            Samraddh Education
          </h1>
          <p className="mt-2 text-blue-100 text-sm sm:text-base">
            Search any Wikipedia article, translate, save favorites, and more.
          </p>

          {/* Search box - full width with responsive padding */}
          <div className="mt-6 relative max-w-2xl" ref={searchBoxRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              ref={inputRef}
              type="text"
              placeholder={educationMode ? "Search school topics..." : "What do you want to learn?"}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(e.target.value.trim().length > 1 || recentSearches.length > 0);
              }}
              onFocus={() => setShowSuggestions(suggestions.length > 0 || recentSearches.length > 0)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchAndDisplay(query);
                if (e.key === "Escape") setShowSuggestions(false);
              }}
              className="w-full pl-10 pr-12 py-3 rounded-lg text-gray-800 bg-white border-2 border-white focus:border-blue-300 focus:ring-4 focus:ring-blue-200 outline-none transition text-base"
            />
            {query && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                <X size={18} />
              </button>
            )}

            {/* Suggestion dropdown - responsive max-height */}
            {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-1">
                {recentSearches.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Recent</span>
                      <button onClick={() => setRecentSearches([])} className="text-xs font-bold text-red-500 hover:underline">Clear</button>
                    </div>
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => fetchAndDisplay(term)}
                        className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50"
                      >
                        <Clock size={14} className="text-slate-400" /> {term}
                      </button>
                    ))}
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500">Suggestions</div>
                    {suggestions.map((sugg) => (
                      <button
                        key={sugg.title}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => fetchAndDisplay(sugg.title)}
                        className="w-full rounded-xl px-4 py-3 text-left hover:bg-blue-50"
                      >
                        <p className="font-bold text-slate-900">{sugg.title}</p>
                        <p className="truncate text-xs text-slate-500">{sugg.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons - wrap on mobile */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => fetchAndDisplay(query)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-white text-[#1a237e] font-bold px-4 py-2 sm:px-5 sm:py-2.5 shadow-md hover:bg-gray-50 disabled:opacity-60 transition text-sm sm:text-base"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Search
            </button>
            <button
              onClick={handleRandomArticle}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 hover:bg-white/30 disabled:opacity-60 transition text-sm sm:text-base"
            >
              <Shuffle size={18} /> Random
            </button>
          </div>
        </div>

        {/* ==== FILTER ROW (responsive scrolling) ==== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              setTargetLang(e.target.value === "hi" ? "en" : "hi");
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="bg-white border border-gray-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold text-slate-700 outline-none cursor-pointer transition whitespace-nowrap"
          >
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>🌐 {l.label}</option>)}
          </select>

          <button
            onClick={() => setEducationMode(!educationMode)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-bold transition whitespace-nowrap ${
              educationMode ? "bg-green-600 text-white shadow-md" : "bg-white border border-gray-200 text-slate-700"
            }`}
          >
            <GraduationCap size={16} />
            {educationMode ? "School Mode ON" : "School Mode OFF"}
          </button>

          {/* Category pills - non-functional, purely visual, responsive */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setTopicCategory(cat)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                topicCategory === cat
                  ? "bg-[#1a237e] text-white shadow-md"
                  : "bg-white border border-gray-200 text-slate-700 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Library Button */}
          <div className="relative ml-auto" ref={libraryRef}>
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="rounded-full bg-white border border-gray-200 p-2 text-slate-700 hover:bg-gray-50 transition"
            >
              <Clock size={18} />
            </button>

            {/* Desktop Library Popover */}
            {showLibrary && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border p-4 z-50 hidden sm:block animate-in fade-in slide-in-from-top-2">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">History</h3>
                    {historyStack.length > 0 && (
                      <button onClick={clearHistory} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    )}
                  </div>
                  {historyStack.length === 0 ? (
                    <p className="text-xs text-slate-400">No articles opened yet.</p>
                  ) : (
                    <ul className="max-h-32 space-y-1 overflow-y-auto pr-1">
                      {historyStack.map((item, idx) => (
                        <li key={`${item.article.title}-${item.lang}-${idx}`}>
                          <button
                            onClick={() => openHistoryItem(idx)}
                            className={`w-full truncate rounded-lg px-3 py-1.5 text-left text-xs transition ${
                              idx === historyIndex
                                ? "bg-[#1a237e] text-white"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                            title={`${item.article.title} (${item.lang})`}
                          >
                            {item.article.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Favorites</h3>
                  {favorites.length === 0 ? (
                    <p className="text-xs text-slate-400">Saved articles appear here.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {favorites.map((item) => (
                        <button
                          key={item}
                          onClick={() => fetchAndDisplay(item)}
                          className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==== TRANSLATION BAR - responsive wrapping ==== */}
        {data && !loading && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white border border-gray-200 p-3">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Languages size={17} /> Translate to
            </span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="rounded-full bg-white border px-3 py-1 text-sm font-bold text-slate-700"
            >
              {LANGUAGES.filter((l) => l.code !== lang).map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="inline-flex items-center gap-2 rounded-full bg-[#1a237e] px-4 py-2 text-sm font-bold text-white hover:bg-[#283593] disabled:opacity-60 transition"
            >
              {translating ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
              {translating ? "Translating..." : "Translate"}
            </button>
          </div>
        )}

        {/* ==== LOADING / ERROR / EMPTY / ARTICLE ==== */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#1a237e]" size={36} />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700">
            <span>⚠️ {error}</span>
            <button onClick={() => setError("")}><X size={20} /></button>
          </div>
        )}

        {data && !loading && (
          <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            {/* Navigation bar - responsive wrap */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <button onClick={goBack} disabled={historyIndex <= 0} className="rounded-full bg-slate-100 p-2 text-slate-700 disabled:opacity-40 hover:bg-slate-200 transition">
                  <ArrowLeft size={18} />
                </button>
                <button onClick={goForward} disabled={historyIndex >= historyStack.length - 1} className="rounded-full bg-slate-100 p-2 text-slate-700 disabled:opacity-40 hover:bg-slate-200 transition">
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`rounded-full p-2 transition ${isFavorite ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                {detailsLoading && <span>Loading details...</span>}
                {details?.lastModified && (
                  <span className="flex items-center gap-1"><Clock size={14} /> Updated {new Date(details.lastModified).toLocaleDateString()}</span>
                )}
                <span className="flex items-center gap-1"><BookOpen size={14} /> {details?.references ? "References available" : "Summary"}</span>
                {isEducational && educationMode && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700"><GraduationCap size={12} /> School‑verified</span>
                )}
              </div>
            </div>

            {/* Article content - responsive grid: stacks on mobile, side by side on desktop */}
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{data.title}</h2>
                {data.description && <p className="mt-2 italic text-slate-500 text-sm sm:text-base">{data.description}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><Timer size={14} /> {wordCount} words</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><Clock size={14} /> {readTime} min read</span>
                  {details?.fullText && details.fullText.length > (data.extract?.length || 0) + 100 && (
                    <button
                      onClick={() => setShowFullText((v) => !v)}
                      className="rounded-full bg-purple-100 px-3 py-1 text-purple-700 hover:bg-purple-200 transition text-sm"
                    >
                      {showFullText ? "Show Summary" : "Show Full Article"}
                    </button>
                  )}
                </div>
                <div className="mt-5 max-h-[700px] overflow-y-auto rounded-xl bg-slate-50 p-4">
                  <ArticleText text={activeText} query={debouncedQuery} />
                </div>
              </div>
              <div>
                {data.thumbnail?.source ? (
                  <button onClick={() => window.open(data.thumbnail?.source, "_blank")} className="block w-full overflow-hidden rounded-xl bg-slate-200 shadow-lg">
                    <img src={data.thumbnail.source} alt={data.title} className="h-48 sm:h-64 lg:h-72 w-full object-cover" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
                  </button>
                ) : (
                  <div className="flex h-48 sm:h-64 lg:h-72 w-full items-center justify-center rounded-xl bg-slate-200 text-slate-400"><ImageIcon size={46} /></div>
                )}
                {details?.images && details.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 flex items-center gap-2 font-bold"><ImageIcon size={18} /> Gallery</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {details.images.map((img, idx) => (
                        <button key={`img-${idx}`} onClick={() => window.open(img, "_blank")} className="overflow-hidden rounded-lg bg-slate-200">
                          <img src={img} alt={`${data.title} ${idx+1}`} className="h-24 sm:h-28 w-full object-cover hover:scale-105 transition" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons - wrap on mobile */}
            <div className="mt-6 flex flex-wrap gap-3">
              {data.content_urls?.desktop?.page && (
                <a href={data.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1a237e] px-4 py-2 text-sm font-bold text-white hover:bg-[#283593] transition">
                  Full Article <ExternalLink size={15} />
                </a>
              )}
              <button onClick={copyText} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"><Copy size={15} /> Copy</button>
              <button onClick={shareArticle} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"><Share2 size={15} /> Share</button>
              {pdfLink && (
                <a href={pdfLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"><FileText size={15} /> PDF</a>
              )}
              <button onClick={downloadTxt} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"><Download size={15} /> TXT</button>
              <button onClick={speakText} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"><Volume2 size={15} /> Read Aloud</button>
              <button onClick={stopSpeech} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition">Stop Audio</button>
            </div>
          </article>
        )}

        {!loading && !data && !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-12 text-center">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Search Wikipedia articles</h2>
            <p className="mt-2 text-slate-500 text-sm sm:text-base">Type a topic and press Search. {educationMode && "🎓 School Mode is active – showing only class 1-12 relevant results."}</p>
          </div>
        )}
      </div>

      {/* Mobile Library Drawer (overlay) - fully responsive */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLibrary(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">📚 Library</h2>
              <button onClick={() => setShowLibrary(false)}><X size={20} /></button>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase text-slate-500">History</h3>
                {historyStack.length > 0 && (
                  <button onClick={clearHistory} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                )}
              </div>
              {historyStack.length === 0 ? (
                <p className="text-xs text-slate-400">No articles opened yet.</p>
              ) : (
                <ul className="max-h-40 space-y-1 overflow-y-auto pr-1">
                  {historyStack.map((item, idx) => (
                    <li key={`${item.article.title}-${item.lang}-${idx}`}>
                      <button
                        onClick={() => openHistoryItem(idx)}
                        className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                          idx === historyIndex ? "bg-[#1a237e] text-white" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item.article.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase text-slate-500">Favorites</h3>
              {favorites.length === 0 ? (
                <p className="text-xs text-slate-400">Saved articles appear here.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {favorites.map((item) => (
                    <button
                      key={item}
                      onClick={() => { fetchAndDisplay(item); setShowLibrary(false); }}
                      className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 hover:bg-amber-100 transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </main>
  );
}