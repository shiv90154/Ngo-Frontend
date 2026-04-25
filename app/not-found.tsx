// app/not-found.tsx
import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#1a237e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-[#1a237e]" />
        </div>
        <h1 className="text-6xl font-extrabold text-[#1a237e] mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1a237e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0d1757] transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}