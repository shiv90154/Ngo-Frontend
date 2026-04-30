"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    educationAPI.getMyEnrollments()
      .then(res => setEnrollments(res.data.enrollments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Learning</h1>
      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
          <Link href="/education/courses" className="text-[#1a237e] font-medium mt-2 inline-block">
            Browse courses →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map(({ course, progress, _id }: any) => (
            <Link key={_id} href={`/education/courses/${course._id}`} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition">
              <h3 className="font-semibold">{course.title}</h3>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-[#1a237e] rounded-full" style={{ width: `${progress || 0}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-2">Progress: {Math.round(progress || 0)}%</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}