// app/(news)/layout.tsx
import { Metadata } from "next";
import NewsNavbar from "@/components/news/NewsNavbar";
import NewsSidebar from "@/components/news/NewsSidebar";

export const metadata: Metadata = {
  title: "Samraddh News | Government of India",
  description: "Latest news, community stories, and media updates",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Government Header Bar */}
      <div className="bg-[#1a237e] text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <span>भारत सरकार | Government of India</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Ministry of Information & Broadcasting</span>
          </div>
          <div className="flex items-center gap-3">
            <span>हिन्दी</span>
            <span className="hidden sm:inline">|</span>
            <span>Skip to main content</span>
          </div>
        </div>
      </div>

      {/* Tricolor Strip */}
      <div className="h-1 flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <NewsNavbar />
      <div className="flex">
        <NewsSidebar />
        <main className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}