// components/ui/SkipToContent.tsx
"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
    >
      Skip to main content
    </a>
  );
}