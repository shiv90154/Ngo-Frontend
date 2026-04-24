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
  Moon,
  Search,
  Share2,
  Shuffle,
  Sun,
  Timer,
  Trash2,
  Volume2,
  X,
} from "lucide-react";

// -------------------- Educational Keywords (classes 1-12) --------------------
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

// -------------------- Rest of the types and helpers (same as before) --------------------
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

const STORAGE_KEYS = {
  recent: "wiki_recent_searches_v8",
  favorites: "wiki_favorites_v8",
  dark: "wiki_dark_mode_v8",
  eduMode: "wiki_edu_mode_v8",
};

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", voice: "en-US" },
  { code: "hi", label: "Hindi", voice: "hi-IN" },
  { code: "es", label: "Spanish", voice: "es-ES" },
  { code: "fr", label: "French", voice: "fr-FR" },
  { code: "de", label: "German", voice: "de-DE" },
  { code: "ar", label: "Arabic", voice: "ar-SA" },
  { code: "ja", label: "Japanese", voice: "ja-JP" },
];

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
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
  } catch {
    return [];
  }
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
  } catch {
    return null;
  }
}

async function fetchFullText(title: string, lang: string): Promise<string> {
  try {
    const json = await fetchJson<any>(
      `https://${lang}.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&explaintext=1&exsectionformat=plain&titles=${encodeURIComponent(title)}&format=json`,
      "Failed to load full article."
    );
    const page = Object.values(json?.query?.pages || {})[0] as any;
    return String(page?.extract || "").trim();
  } catch {
    return "";
  }
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
  } catch {
    return null;
  }
}

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
          <mark key={i} className="rounded bg-yellow-200 px-1 dark:bg-yellow-800 dark:text-white">
            {part}
          </mark>
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
  if (!cleanText) return <p className="italic text-slate-500 dark:text-slate-400">No text available.</p>;
  const maxLength = 950;
  const isLong = cleanText.length > maxLength;
  const visibleText = isLong && !expanded ? `${cleanText.slice(0, maxLength)}…` : cleanText;
  return (
    <div>
      <p className="whitespace-pre-wrap break-words leading-8 text-slate-800 dark:text-slate-200">
        <SearchHighlight text={visibleText} query={query} />
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
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
    <div className="fixed bottom-5 right-5 z-[80] flex max-w-[90vw] items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-2xl">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close toast">
        <X size={16} />
      </button>
    </div>
  );
}

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
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [educationMode, setEducationMode] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const articleCache = useRef<Map<string, WikiSummary>>(new Map());
  const detailsCache = useRef<Map<string, ArticleDetails>>(new Map());
  const activeRequestId = useRef(0);

  // Load settings
  useEffect(() => {
    setRecentSearches(safeRead<string[]>(STORAGE_KEYS.recent, []));
    setFavorites(safeRead<string[]>(STORAGE_KEYS.favorites, []));
    setDarkMode(safeRead<boolean>(STORAGE_KEYS.dark, true));
    setEducationMode(safeRead<boolean>(STORAGE_KEYS.eduMode, false));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    safeWrite(STORAGE_KEYS.dark, darkMode);
  }, [darkMode]);

  useEffect(() => {
    safeWrite(STORAGE_KEYS.eduMode, educationMode);
  }, [educationMode]);

  useEffect(() => safeWrite(STORAGE_KEYS.recent, recentSearches), [recentSearches]);
  useEffect(() => safeWrite(STORAGE_KEYS.favorites, favorites), [favorites]);

  // Block scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = showHistorySidebar ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showHistorySidebar]);

  // Fetch suggestions with optional educational filter
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

        // Educational mode warning
        if (educationMode && !isEducationalTopic(article.title, article.description)) {
          setError("⚠️ This article may not be part of the school curriculum (1-12). But you can still read it.");
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
    if (!data?.title) {
      setError("Search an article first, then translate it.");
      return;
    }
    if (targetLang === lang) {
      setToastMsg("Already selected this language");
      return;
    }
    setTranslating(true);
    setError("");
    try {
      const translatedTitle = await fetchTranslatedTitle(data.title, lang, targetLang);
      if (!translatedTitle) {
        setError("Translation article is not available on Wikipedia for this language.");
        return;
      }
      await fetchAndDisplay(translatedTitle, targetLang);
      setToastMsg("Article translated");
    } finally {
      setTranslating(false);
    }
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
        // Keep fetching until we find an educational article (max 5 attempts)
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
      if (educationMode && !isEducationalTopic(article.title, article.description)) {
        setError("⚠️ This random article may not be school‑level. Try again.");
      }
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
    setShowHistorySidebar(false);
    loadDetails(item.article.title, item.lang, activeRequestId.current);
    if (educationMode && !isEducationalTopic(item.article.title, item.article.description)) {
      setError("⚠️ This article may not be part of the school curriculum.");
    } else {
      setError("");
    }
  }

  function goBack() {
    if (historyIndex <= 0) return;
    openHistoryItem(historyIndex - 1);
  }

  function goForward() {
    if (historyIndex >= historyStack.length - 1) return;
    openHistoryItem(historyIndex + 1);
  }

  function clearSearch() {
    activeRequestId.current = Date.now();
    setQuery("");
    setData(null);
    setDetails(null);
    setError("");
    setSuggestions([]);
    setShowSuggestions(false);
    setShowFullText(false);
    window.speechSynthesis?.cancel();
    inputRef.current?.focus();
  }

  function clearHistory() {
    setHistoryStack([]);
    setHistoryIndex(-1);
    setToastMsg("History cleared");
  }

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
    } catch {
      setError("Clipboard permission blocked.");
    }
  }

  async function shareArticle() {
    const articleUrl = data?.content_urls?.desktop?.page || details?.pageUrl || window.location.href;
    try {
      if (navigator.share && data) {
        await navigator.share({
          title: data.title,
          text: activeText.slice(0, 140) || data.title,
          url: articleUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(articleUrl);
      setToastMsg("Article link copied");
    } catch {
      setToastMsg("Share cancelled");
    }
  }

  function downloadTxt() {
    if (!data || !activeText) return;
    const blob = new Blob([`${data.title}\n\n${activeText}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setToastMsg("TXT downloaded");
  }

  function speakText() {
    if (!activeText) return;
    if (!("speechSynthesis" in window)) {
      setToastMsg("Read aloud not supported");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeText.slice(0, 4500));
      utterance.lang = getVoiceLang(lang);
      window.speechSynthesis.speak(utterance);
      setToastMsg("Reading started");
    } catch {
      setToastMsg("Speech failed");
    }
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setToastMsg("Reading stopped");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-3 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white sm:p-6">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:p-6 lg:flex-row">
        {/* Sidebar (same as before) */}
        <aside
          className={`${
            showHistorySidebar
              ? "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto rounded-r-3xl bg-slate-50 p-4 shadow-2xl dark:bg-slate-800"
              : "hidden"
          } lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)] lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:rounded-3xl`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
            <h2 className="flex items-center gap-2 text-lg font-black">
              <Clock size={18} /> Library
            </h2>
            <div className="flex items-center gap-2">
              {historyStack.length > 0 && (
                <button onClick={clearHistory} className="rounded-lg p-2 text-slate-500 hover:bg-red-100 hover:text-red-600" aria-label="Clear history">
                  <Trash2 size={16} />
                </button>
              )}
              <button onClick={() => setShowHistorySidebar(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 lg:hidden">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">History</h3>
            {historyStack.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No article opened yet.</p>
            ) : (
              <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {historyStack.map((item, idx) => (
                  <li key={`${item.article.title}-${item.lang}-${idx}`}>
                    <button
                      onClick={() => openHistoryItem(idx)}
                      className={`w-full truncate rounded-2xl px-3 py-2 text-left text-sm transition ${
                        idx === historyIndex
                          ? "bg-blue-600 font-bold text-white"
                          : "text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
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
          <div className="mt-6">
            <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Favorites</h3>
            {favorites.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Saved articles appear here.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {favorites.map((item) => (
                  <button key={item} onClick={() => fetchAndDisplay(item)} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300">
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight sm:text-4xl">
                <span className="rounded-3xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/25">
                  <Globe size={30} />
                </span>
                Smarddh Bharat
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Search Wikipedia, translate, read full text, save favorites, copy, share, PDF, TXT, audio.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={lang}
                onChange={(e) => {
                  const next = e.target.value;
                  setLang(next);
                  setTargetLang(next === "hi" ? "en" : "hi");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>

              {/* Education Mode Toggle Button */}
              <button
                onClick={() => setEducationMode(!educationMode)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 font-bold transition ${
                  educationMode
                    ? "bg-green-600 text-white shadow-md shadow-green-500/30 hover:bg-green-700"
                    : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                }`}
                aria-label="Toggle Education Mode"
              >
                <GraduationCap size={18} />
                <span className="hidden sm:inline">{educationMode ? "School Mode ON" : "School Mode OFF"}</span>
              </button>

              
              

              <button
                onClick={() => setShowHistorySidebar(true)}
                className="rounded-2xl bg-slate-200 p-3 text-slate-800 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 lg:hidden"
                aria-label="Open history"
              >
                <Clock size={18} />
              </button>
            </div>
          </header>

          {/* Search Box */}
          <div ref={searchBoxRef} className="relative mb-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                <input
                  ref={inputRef}
                  type="text"
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
                  placeholder="Search any topic, e.g. Photosynthesis, Algebra, Hamlet..."
                  className="w-full rounded-3xl border-2 border-slate-200 bg-white py-4 pl-12 pr-12 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
                />
                {query && (
                  <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500">
                    <X size={18} />
                  </button>
                )}
              </div>
              <button onClick={() => fetchAndDisplay(query)} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-600 px-7 py-4 font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                Search
              </button>
              <button onClick={handleRandomArticle} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-200 px-7 py-4 font-black text-slate-800 transition hover:bg-slate-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                <Shuffle size={18} /> Random
              </button>
            </div>

            {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
              <div className="absolute left-0 right-0 top-full z-40 mt-3 max-h-96 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                {recentSearches.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-black uppercase tracking-wide text-slate-500">Recent</span>
                      <button onClick={() => setRecentSearches([])} className="text-xs font-bold text-red-500 hover:underline">Clear</button>
                    </div>
                    {recentSearches.map((term) => (
                      <button key={term} onMouseDown={(e) => e.preventDefault()} onClick={() => fetchAndDisplay(term)} className="flex w-full items-center gap-2 rounded-2xl px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-700">
                        <Clock size={14} className="text-slate-400" /> {term}
                      </button>
                    ))}
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-500">Suggestions</div>
                    {suggestions.map((sugg) => (
                      <button key={sugg.title} onMouseDown={(e) => e.preventDefault()} onClick={() => fetchAndDisplay(sugg.title)} className="w-full rounded-2xl px-4 py-3 text-left transition hover:bg-blue-50 dark:hover:bg-slate-700">
                        <p className="font-black text-slate-900 dark:text-white">{sugg.title}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{sugg.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Translation bar */}
          {data && (
            <div className="mb-5 flex flex-wrap items-center gap-2 rounded-3xl border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                <Languages size={17} /> Translate article to
              </span>
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                {LANGUAGES.filter((l) => l.code !== lang).map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <button onClick={handleTranslate} disabled={translating} className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2 text-sm font-black text-white transition hover:bg-purple-700 disabled:opacity-60">
                {translating ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
                {translating ? "Translating..." : "Translate"}
              </button>
            </div>
          )}

          {loading && (
            <div className="my-16 flex flex-col items-center justify-center text-center">
              <div className="mb-4 h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500" />
              <p className="font-bold text-slate-600 dark:text-slate-400">Loading article...</p>
            </div>
          )}

          {error && (
            <div className="my-5 flex items-center justify-between gap-4 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              <span>⚠️ {error}</span>
              <button onClick={() => setError("")} aria-label="Close error">
                <X size={20} />
              </button>
            </div>
          )}

          {data && !loading && (
            <article className="rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 sm:p-6">
              <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={goBack} disabled={historyIndex <= 0} className="rounded-2xl bg-slate-100 p-3 text-slate-700 shadow-sm transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700">
                    <ArrowLeft size={18} />
                  </button>
                  <button onClick={goForward} disabled={historyIndex >= historyStack.length - 1} className="rounded-2xl bg-slate-100 p-3 text-slate-700 shadow-sm transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700">
                    <ArrowRight size={18} />
                  </button>
                  <button onClick={toggleFavorite} className={`rounded-2xl p-3 shadow-sm transition ${isFavorite ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700"}`}>
                    {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                  {detailsLoading && <span>Loading details...</span>}
                  {details?.lastModified && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} /> Updated {new Date(details.lastModified).toLocaleDateString()}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <BookOpen size={14} /> {details?.references ? "References available" : "Summary"}
                  </span>
                  {isEducational && educationMode && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <GraduationCap size={12} /> School‑verified
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0">
                  <h2 className="break-words text-3xl font-black tracking-tight sm:text-4xl">{data.title}</h2>
                  {data.description && <p className="mt-2 text-base italic text-slate-500 dark:text-slate-400">{data.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">
                      <Timer size={14} /> {wordCount} words
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-900">
                      <Clock size={14} /> {readTime} min read
                    </span>
                    {details?.fullText && details.fullText.length > (data.extract?.length || 0) + 100 && (
                      <button onClick={() => setShowFullText((v) => !v)} className="rounded-full bg-purple-100 px-3 py-1 text-purple-700 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-300">
                        {showFullText ? "Show Summary" : "Show Full Article"}
                      </button>
                    )}
                  </div>
                  <div className="mt-5 max-h-[700px] overflow-y-auto rounded-3xl bg-slate-50 p-4 dark:bg-slate-900/60">
                    <ArticleText text={activeText} query={debouncedQuery} />
                  </div>
                </div>

                <div className="min-w-0">
                  {data.thumbnail?.source ? (
                    <button onClick={() => window.open(data.thumbnail?.source, "_blank")} className="block w-full overflow-hidden rounded-3xl bg-slate-200 shadow-xl dark:bg-slate-900">
                      <img src={data.thumbnail.source} alt={data.title} className="h-72 w-full object-cover" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
                    </button>
                  ) : (
                    <div className="flex h-72 w-full items-center justify-center rounded-3xl bg-slate-200 text-slate-400 dark:bg-slate-900">
                      <ImageIcon size={46} />
                    </div>
                  )}
                  {details?.images && details.images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="mb-3 flex items-center gap-2 font-black">
                        <ImageIcon size={18} /> Gallery
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {details.images.map((img, idx) => (
                          <button key={`img-${idx}`} onClick={() => window.open(img, "_blank")} className="overflow-hidden rounded-2xl bg-slate-200 shadow-sm dark:bg-slate-900">
                            <img src={img} alt={`${data.title} ${idx + 1}`} className="h-28 w-full object-cover transition hover:scale-105" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {data.content_urls?.desktop?.page && (
                  <a href={data.content_urls.desktop.page} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                    Full Article <ExternalLink size={15} />
                  </a>
                )}
                <button onClick={copyText} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700">
                  <Copy size={15} /> Copy
                </button>
                <button onClick={shareArticle} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700">
                  <Share2 size={15} /> Share
                </button>
                {pdfLink && (
                  <a href={pdfLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700">
                    <FileText size={15} /> PDF
                  </a>
                )}
                <button onClick={downloadTxt} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700">
                  <Download size={15} /> TXT
                </button>
                <button onClick={speakText} className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700">
                  <Volume2 size={15} /> Read Aloud
                </button>
                <button onClick={stopSpeech} className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950">
                  Stop Audio
                </button>
              </div>
            </article>
          )}

          {!loading && !data && !error && (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/60 px-4 py-16 text-center dark:border-slate-700 dark:bg-slate-800/40">
              <Search size={54} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">Search Wikipedia articles</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Type a topic and press Enter. {educationMode && "🎓 School Mode is active – showing only class 1-12 relevant results."}</p>
            </div>
          )}
        </div>
      </section>

      {showHistorySidebar && (
        <button className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setShowHistorySidebar(false)} aria-label="Close history overlay" />
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </main>
  );
}