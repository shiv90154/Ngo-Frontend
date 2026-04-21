"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InstructorGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user?.role !== "TEACHER") router.replace("/education");
  }, [user, loading, router]);
  if (loading || user?.role !== "TEACHER") return null;
  return <>{children}</>;
}