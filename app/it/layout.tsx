import { Metadata } from "next";
import ITNavbar from "@/components/it/ITNavbar";
import ITSidebar from "@/components/it/ITSidebar";
import ModuleSetupWizard from "@/components/ModuleSetupWizard";   // 🆕

export const metadata: Metadata = {
  title: "Samraddh IT Services | Government of India",
  description: "Client management, GST billing, project tracking",
};

export default function ITLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
     
    
      <ITNavbar />
      <div className="flex">
        <ITSidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto w-full">
          <ModuleSetupWizard module="it" />
          {children}
        </main>
      </div>
    </div>
  );
}