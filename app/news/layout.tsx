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
   
      <NewsNavbar />
      <div className="flex">
        <NewsSidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}