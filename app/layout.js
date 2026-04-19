import { Outfit } from "next/font/google";
import ClientProvider from "./ClientProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Samraddh Bharat Foundation",
  description: "Digital India initiative",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable}`}>
      <body className="font-outfit antialiased text-gray-800 bg-gray-50">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}