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
    <div className="min-h-screen bg-slate-50 font-sans">
      <NewsNavbar />
      
      {/* Centered container to prevent extreme stretching on large monitors */}
      <div className="max-w-7xl mx-auto flex justify-center">
        <NewsSidebar />
        
        {/* Main feed area */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-2xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}