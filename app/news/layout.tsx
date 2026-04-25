// app/news/layout.tsx
import { Metadata } from "next";
import NewsNavbar from "@/components/news/NewsNavbar";
import NewsSidebar from "@/components/news/NewsSidebar";
import SkipToContent from "@/components/ui/SkipToContent";

export const metadata: Metadata = {
  title: "Samraddh News | Government of India",
  description: "Latest news, community stories, and media updates",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans antialiased">
      {/* Subtle background texture */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#e9e9ff_0%,_transparent_60%)] opacity-40" />

      {/* Accessibility: skip to content */}
      <SkipToContent />

      <NewsNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Sidebar – visible only on large screens */}
          <aside className="hidden lg:block w-64 shrink-0" aria-label="News sidebar">
            <div className="sticky top-24">
              <NewsSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main
            id="main-content"
            className="flex-1 min-w-0 py-6 lg:py-10 max-w-2xl"
            role="main"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}