import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SplashScreen from "@/components/SplashScreen";
import OnboardingTutorial from "@/components/OnboardingTutorial";   // 🆕

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samraddh Bharat Foundation",
  description: "Unified Digital Ecosystem for Education, Healthcare, Agriculture & More",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SplashScreen />
          <OnboardingTutorial />   {/* 🆕 guided tour for new users */}
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </body>
    </html>
  );
}