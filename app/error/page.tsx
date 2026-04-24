// app/error/page.tsx
import Link from "next/link";
import { ShieldAlert, Ban, ServerCrash } from "lucide-react";

const errorConfig: Record<
  string,
  { icon: React.ElementType; title: string; color: string }
> = {
  "403": {
    icon: Ban,
    title: "Access Denied",
    color: "text-orange-600",
  },
  "500": {
    icon: ServerCrash,
    title: "Internal Server Error",
    color: "text-red-600",
  },
  default: {
    icon: ShieldAlert,
    title: "Error",
    color: "text-gray-800",
  },
};

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { status?: string; message?: string };
}) {
  const status = searchParams.status || "500";
  const message = searchParams.message || "An unexpected error occurred.";
  const config = errorConfig[status] || errorConfig.default;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className={`w-10 h-10 ${config.color}`} />
        </div>
        <h1 className={`text-5xl font-extrabold ${config.color} mb-2`}>
          {status}
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {config.title}
        </h2>
        <p className="text-gray-500 mb-8">{message}</p>
        <Link
          href="/"
          className="inline-block bg-[#1a237e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0d1757] transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}