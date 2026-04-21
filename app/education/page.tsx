// app/(education)/education/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { educationAPI } from "@/lib/api";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Users,
  IndianRupee,
  Loader2,
  ArrowRight,
  GraduationCap,
  PenTool,
} from "lucide-react";
import CourseCard from "@/components/education/CourseCard";

export default function EducationDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // 教师仪表盘数据
  const [instructorStats, setInstructorStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    recentEnrollments: [],
  });

  // 学生数据：推荐课程 + 继续学习
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);

  const isTeacher = user?.role === "TEACHER";

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        if (isTeacher) {
          const res = await educationAPI.getInstructorDashboard();
          setInstructorStats({
            totalCourses: res.data.totalCourses,
            totalStudents: res.data.totalStudents,
            totalRevenue: res.data.totalRevenue,
            recentEnrollments: res.data.recentEnrollments || [],
          });
        } else {
          // 学生：获取推荐课程（这里简单获取最新课程） + 我的注册
          const [coursesRes] = await Promise.all([
            educationAPI.getPublishedCourses({ limit: 6 }),
          ]);
          setRecommendedCourses(coursesRes.data.courses || []);

          // 获取我的学习进度（如果已登录）
          if (user) {
            try {
              // 通过获取已发布课程并过滤已注册的，实际应有专门接口
              const allCourses = coursesRes.data.courses;
              const enrolled = [];
              for (const course of allCourses) {
                const detail = await educationAPI.getCourseDetails(course._id);
                if (detail.data.isEnrolled) {
                  enrolled.push({
                    course,
                    progress: detail.data.enrollment?.progress || 0,
                  });
                }
              }
              setMyEnrollments(enrolled.slice(0, 3));
            } catch (e) {
              console.error("Failed to fetch enrollments", e);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [isTeacher, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-[#1a237e]" />
      </div>
    );
  }

  // ---------- 教师仪表盘 ----------
  if (isTeacher) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <PenTool className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
              <p className="text-blue-100 text-sm mt-1">
                Manage your courses and track student progress
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <BookOpen className="text-[#1a237e] mb-2" />
            <p className="text-3xl font-bold">{instructorStats.totalCourses}</p>
            <p className="text-gray-500">Total Courses</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <Users className="text-[#1a237e] mb-2" />
            <p className="text-3xl font-bold">{instructorStats.totalStudents}</p>
            <p className="text-gray-500">Total Students</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <IndianRupee className="text-[#1a237e] mb-2" />
            <p className="text-3xl font-bold">₹{instructorStats.totalRevenue}</p>
            <p className="text-gray-500">Total Revenue</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Enrollments</h2>
            <Link href="/education/instructor/courses" className="text-[#1a237e] text-sm">
              View all courses
            </Link>
          </div>
          {instructorStats.recentEnrollments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent enrollments</p>
          ) : (
            <div className="divide-y">
              {instructorStats.recentEnrollments.map((e: any) => (
                <div key={e._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{e.student?.fullName}</p>
                    <p className="text-sm text-gray-500">{e.course?.title}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(e.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/education/instructor/courses/new"
            className="bg-[#1a237e] text-white px-5 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <BookOpen size={18} /> Create New Course
          </Link>
        </div>
      </div>
    );
  }

  // ---------- 学生仪表盘 ----------
  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <GraduationCap className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.fullName?.split(" ")[0] || "Learner"}!
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Continue your learning journey with Samraddh Bharat
            </p>
          </div>
        </div>
      </div>

      {/* 继续学习 */}
      {myEnrollments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1a237e]" /> Continue Learning
            </h2>
            <Link href="/education/courses/my" className="text-[#1a237e] text-sm">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myEnrollments.map((item: any) => (
              <Link
                key={item.course._id}
                href={`/education/courses/${item.course._id}`}
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold line-clamp-1">{item.course.title}</h3>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-[#1a237e] rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Progress: {Math.round(item.progress)}%</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 推荐课程 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1a237e]" /> Recommended for you
          </h2>
          <Link href="/education/courses" className="text-[#1a237e] text-sm">
            Explore all
          </Link>
        </div>
        {recommendedCourses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border">
            <BookOpen className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No courses available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedCourses.slice(0, 3).map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          href="/education/courses"
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition flex flex-col items-center text-center gap-2"
        >
          <BookOpen className="w-6 h-6 text-[#1a237e]" />
          <span className="text-sm font-medium">Browse Courses</span>
        </Link>
        <Link
          href="/education/courses/my"
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition flex flex-col items-center text-center gap-2"
        >
          <Clock className="w-6 h-6 text-[#1a237e]" />
          <span className="text-sm font-medium">My Learning</span>
        </Link>
        <Link
          href="/education/certificates"
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition flex flex-col items-center text-center gap-2"
        >
          <Award className="w-6 h-6 text-[#1a237e]" />
          <span className="text-sm font-medium">Certificates</span>
        </Link>
        <Link
          href="/education/tests"
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition flex flex-col items-center text-center gap-2"
        >
          <PenTool className="w-6 h-6 text-[#1a237e]" />
          <span className="text-sm font-medium">Practice Tests</span>
        </Link>
      </div>
    </div>
  );
}