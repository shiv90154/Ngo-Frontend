import { Metadata } from "next";
import ITNavbar from "@/components/it/ITNavbar";
import ITSidebar from "@/components/it/ITSidebar";

export const metadata: Metadata = {
  title: "Samraddh IT Services | Government of India",
  description: "Client Management, GST Billing, Project Tracking & Team Collaboration",
};

export default function ITLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* 政府头部 */}
      <div className="bg-[#1a237e] text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <span>भारत सरकार | Government of India</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Ministry of Electronics & IT</span>
          </div>
          <div className="flex items-center gap-3">
            <span>हिन्दी</span>
            <span className="hidden sm:inline">|</span>
            <span>Skip to main content</span>
          </div>
        </div>
      </div>
      <div className="h-1 flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>
      <ITNavbar />
      <div className="flex">
        <ITSidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}