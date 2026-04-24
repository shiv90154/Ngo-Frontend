// app/forbidden/page.tsx
import Link from "next/link";
import { ShieldOff } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-5xl font-extrabold text-orange-600 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Forbidden</h2>
        <p className="text-gray-500 mb-8">
          You do not have permission to access this resource.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1a237e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0d1757] transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}