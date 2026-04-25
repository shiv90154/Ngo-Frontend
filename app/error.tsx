"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-red-600 mb-2">500</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Please try again later.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-[#1a237e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0d1757] transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}