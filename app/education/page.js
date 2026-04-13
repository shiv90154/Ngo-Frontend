"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/config/api";

export default function EducationLanding() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and redirect to role‑specific dashboard
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role === "TEACHER") router.replace("/education/dashboard/teacher");
      else if (user.role === "USER" || user.role === "STUDENT") router.replace("/education/dashboard/student");
      // else stay on public listing
    }

    // Fetch published courses
    api
      .get("/education/courses")
      .then((res) => {
        // Backend returns { success: true, data: [...] }
        setCourses(res.data.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );

  if (!courses.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No courses available yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Courses</h1>
        <p className="text-gray-600 mb-8">Learn from industry experts and advance your career</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => router.push(`/education/courses/${course._id}`)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">{course.title}</h2>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-blue-600">₹{course.price}</span>
                  <span className="text-sm text-gray-500">{course.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}