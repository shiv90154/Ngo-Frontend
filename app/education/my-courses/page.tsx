// app/(education)/my-courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { educationAPI } from "@/lib/api";
import { BookOpen, Loader2, Clock, Award } from "lucide-react";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMyCourses = async () => {
      try {
        // 方案A：后端提供专门的 /education/my-courses 接口（推荐）
        // const res = await educationAPI.getMyEnrollments();
        // setEnrollments(res.data.enrollments);

        // 方案B（临时）：获取所有公开课程，逐一检查是否已注册
        const coursesRes = await educationAPI.getPublishedCourses({ limit: 50 });
        const courses = coursesRes.data.courses;
        const enrolledList = [];

        for (const course of courses) {
          try {
            const detail = await educationAPI.getCourseDetails(course._id);
            if (detail.data.isEnrolled) {
              enrolledList.push({
                course,
                enrollment: detail.data.enrollment,
              });
            }
          } catch (e) {
            console.error(`Failed to check enrollment for course ${course._id}`, e);
          }
        }
        setEnrollments(enrolledList);
      } catch (error) {
        console.error("Failed to load my courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-[#1a237e]" />
          My Learning
        </h1>
        <p className="text-gray-500 mt-1">
          Continue where you left off and track your progress
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            You haven't enrolled in any courses yet
          </h2>
          <p className="text-gray-500 mb-6">
            Explore our catalog and start learning today!
          </p>
          <Link
            href="/education/courses"
            className="inline-flex items-center gap-2 bg-[#1a237e] text-white px-6 py-2 rounded-lg hover:bg-[#0d1757] transition"
          >
            <BookOpen size={18} /> Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map(({ course, enrollment }) => (
            <Link
              key={course._id}
              href={`/education/courses/${course._id}`}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden group"
            >
              <div className="h-32 bg-gradient-to-br from-[#1a237e] to-[#283593] relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-serif">
                    अ
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 group-hover:text-[#1a237e] transition line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{course.instructor?.fullName}</p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(enrollment?.progress || 0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1a237e] rounded-full transition-all"
                      style={{ width: `${enrollment?.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* 状态标签 */}
                <div className="mt-4 flex items-center justify-between">
                  {enrollment?.completedAt ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <Award size={12} /> Completed
                    </span>
                  ) : (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock size={12} /> In Progress
                    </span>
                  )}
                  <span className="text-sm text-[#1a237e] font-medium group-hover:translate-x-1 transition">
                    Continue →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 快捷链接 */}
      <div className="pt-4">
        <Link
          href="/education/courses"
          className="text-[#1a237e] hover:underline inline-flex items-center gap-1"
        >
          ← Back to course catalog
        </Link>
      </div>
    </div>
  );
}