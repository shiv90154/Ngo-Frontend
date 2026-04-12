"use client";

import { AuthProvider } from "@/contexts/AuthContext";

export default function ClientProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}