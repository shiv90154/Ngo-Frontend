import { Metadata } from "next";
import HealthcareNavbar from "@/components/healthcare/HealthcareNavbar";
import HealthcareSidebar from "@/components/healthcare/HealthcareSidebar";
import ModuleSetupWizard from "@/components/ModuleSetupWizard";   // 🆕

export const metadata: Metadata = {
  title: "Samraddh Healthcare | Government of India",
  description: "Book appointments, consult doctors, manage health records",
};

export default function HealthcareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
   
    
      <HealthcareNavbar />
      <div className="flex">
        <HealthcareSidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto w-full">
          <ModuleSetupWizard module="healthcare" />
          {children}
        </main>
      </div>
    </div>
  );
}