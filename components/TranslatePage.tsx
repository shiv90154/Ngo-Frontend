"use client";
import "@/app/globals.css"
import { useEffect } from "react";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const languages = [
  { label: "English", code: "en" },
  { label: "हिन्दी", code: "hi" },
  { label: "ਪੰਜਾਬੀ", code: "pa" },
  {label:"Bengali", code:"bn"},
  {label:"Bhojpuri", code:"bho"},
  
];

export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,pa,bn,bho",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (lang: string) => {
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;

    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div className="relative">
      {/* Hidden Google Translate default widget */}
      <div id="google_translate_element" className="hidden" />

      {/* Custom UI */}
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">
        <Languages className="h-4 w-4 text-[#1a237e]" />

        <select
          onChange={(e) => changeLanguage(e.target.value)}
          defaultValue="en"
          className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}