import { Metadata } from "next";
import FinanceNavbar from "@/components/finance/FinanceNavbar";
import FinanceSidebar from "@/components/finance/FinanceSidebar";
import ModuleSetupWizard from "@/components/ModuleSetupWizard";   // 🆕

export const metadata: Metadata = {
  title: "Samraddh Finance | Government of India",
  description: "Wallet, loans, bill payments & banking",
};

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
     
      <FinanceNavbar />
      <div className="flex">
        <FinanceSidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto w-full">
          <ModuleSetupWizard module="finance" />
          {children}
        </main>
      </div>
    </div>
  );
}