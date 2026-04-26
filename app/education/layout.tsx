import { Metadata } from "next";
import EducationNavbar from "@/components/education/EducationNavbar";
import EducationSidebar from "@/components/education/EducationSidebar";
import ModuleSetupWizard from "@/components/ModuleSetupWizard";   // 🆕

export const metadata: Metadata = {
  title: "Samraddh Education | Government of India",
  description: "Online courses, live classes, test series & certificates",
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
  
   
      <EducationNavbar />
      <div className="flex">
        <EducationSidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto w-full">
          <ModuleSetupWizard module="education" />
          {children}
        </main>
      </div>
    </div>
  );
}