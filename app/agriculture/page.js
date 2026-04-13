// app/agriculture/dashboard/page.js
import AgricultureDashboard from "@/components/agriculture/Dashboard";

export const metadata = {
    title: "Agriculture Dashboard | Your App Name",
    description: "Manage your crops, products, orders, and farming activities",
};

export default function DashboardPage() {
    return <AgricultureDashboard />;
}