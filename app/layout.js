"use client";
import { AuthProvider } from "@/contexts/AuthContext";
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}