import HealthcareNavbar from "@/components/healthcare/HealthcareNavbar";
import HealthcareSidebar from "@/components/healthcare/HealthcareSidebar";

export const metadata = {
  title: "Samraddh Healthcare - Your Health Partner",
  description: "Book appointments, consult BAMS doctors, manage health records",
};

export default function HealthcareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <HealthcareNavbar />
      <div className="flex">
        <HealthcareSidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}