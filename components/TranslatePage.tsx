"use client";

import { useEffect, useState } from "react";
import { FaLanguage } from "react-icons/fa";

declare global {
  interface Window {
    translate?: any;
  }
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  const [isLoaded, setIsLoaded] = useState(false);

  const languages = [
    { code: "english", name: "English", flag: "🇮🇳" },
    { code: "hindi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "punjabi", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "gujarati", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "marathi", name: "मराठी", flag: "🇮🇳" },
    { code: "bengali", name: "বাংলা", flag: "🇮🇳" },
    { code: "tamil", name: "தமிழ்", flag: "🇮🇳" },
    { code: "telugu", name: "తెలుగు", flag: "🇮🇳" },
    { code: "malayalam", name: "മലയാളം", flag: "🇮🇳" },
    { code: "kannada", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "urdu", name: "اردو", flag: "🇮🇳" },
  ];

  const fixTranslateIgnore = () => {
    if (!window.translate) return;

    const oldIgnore = window.translate.ignore || {};

    window.translate.ignore = {
      ...oldIgnore,
      className: ["no-translate", "Toastify", "splash-screen"],
      tag: ["CODE", "PRE", "SVG", "SCRIPT", "STYLE"],
      id: ["google_translate_element"],
      isIgnore:
        typeof oldIgnore.isIgnore === "function"
          ? oldIgnore.isIgnore
          : () => false,
    };
  };

  const resetAndTranslate = (langCode: string) => {
    if (!window.translate) return;

    try {
      fixTranslateIgnore();
      window.translate.changeLanguage(langCode);

      if (window.translate.listener) {
        window.translate.listener.start();
      }
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const changeLanguage = (langCode: string, langName: string) => {
    if (!isLoaded || !window.translate) return;

    localStorage.setItem("preferredLanguage", langCode);
    setCurrentLang(langName);
    setIsOpen(false);

    resetAndTranslate(langCode);
  };

  const initTranslate = () => {
    if (!window.translate) {
      console.error("Translate object not available");
      setIsLoaded(true);
      return;
    }

    try {
      const savedLang = localStorage.getItem("preferredLanguage") || "english";
      const selectedLang = languages.find((lang) => lang.code === savedLang);

      if (selectedLang) {
        setCurrentLang(selectedLang.name);
      } else {
        localStorage.setItem("preferredLanguage", "english");
        setCurrentLang("English");
      }

      window.translate.service.use("client.edge");

      if (window.translate.selectLanguageTag) {
        window.translate.selectLanguageTag.show = false;
      }

      fixTranslateIgnore();

      if (savedLang !== "english") {
        resetAndTranslate(savedLang);
      }

      setIsLoaded(true);
    } catch (error) {
      console.error("Translate initialization error:", error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existingScript = document.querySelector("#translate-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "translate-script";
      script.src =
        "https://cdn.staticfile.net/translate.js/3.18.66/translate.js";
      script.async = true;

      script.onload = () => {
        const checkTranslate = setInterval(() => {
          if (window.translate) {
            clearInterval(checkTranslate);
            initTranslate();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkTranslate);

          if (!window.translate) {
            console.error("Translate failed to initialize");
            setIsLoaded(true);
          }
        }, 5000);
      };

      script.onerror = () => {
        console.error("Failed to load translate.js");
        setIsLoaded(true);
      };

      document.head.appendChild(script);
    } else {
      const checkTranslate = setInterval(() => {
        if (window.translate) {
          clearInterval(checkTranslate);
          initTranslate();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkTranslate);
        setIsLoaded(true);
      }, 5000);
    }
  }, []);

  return (
    <div className="relative inline-block no-translate z-[999999]">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={!isLoaded}
        className="flex items-center gap-1.5 px-3 py-2.5 bg-white rounded-md  hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
      >
        <span className="text-base"><FaLanguage />
</span>

        <span className="text-xs font-semibold text-gray-700">
          {isLoaded ? currentLang : "Loading..."}
        </span>

        <svg
          className={`w-3.5 h-3.5 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[999998]"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg  z-[999999] max-h-80 overflow-y-auto">
            <div className="p-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code, lang.name)}
                  disabled={!isLoaded}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-gray-100 rounded-md transition-colors duration-150 disabled:opacity-50"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {lang.name}
                  </span>

                  {currentLang === lang.name && (
                    <svg
                      className="w-4 h-4 ml-auto text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}