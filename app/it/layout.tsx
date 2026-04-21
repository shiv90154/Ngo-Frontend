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