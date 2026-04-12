"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Award, FileText, ChevronRight, TrendingUp } from "lucide-react";
import api from "@/config/api";

export default function StudentDashboard() {
  const router = useRouter();
  const [myCourses, setMyCourses] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    // Optional: check role – redirect if not student
    if (user.role !== "USER" && user.role !== "STUDENT") {
      router.replace("/education/dashboard/teacher");
      return;
    }

    const fetchData = async () => {
      try {
        const [coursesRes, resultsRes, certsRes] = await Promise.all([
          api.get("/education/my-courses"),
          api.get("/education/my-results"),
          api.get("/education/my-certificates"),
        ]);

        // Backend wraps data in { success: true, data: ... }
        setMyCourses(coursesRes.data?.data || []);
        setMyResults(resultsRes.data?.data || []);
        setCertificates(certsRes.data?.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err.response?.status === 401) {
          // Token expired or invalid – logout
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const avgProgress = myCourses.length
    ? Math.round(myCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / myCourses.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your learning journey</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Enrolled</p>
                <p className="text-2xl font-bold">{myCourses.length}</p>
              </div>
              <BookOpen className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Tests Taken</p>
                <p className="text-2xl font-bold">{myResults.length}</p>
              </div>
              <FileText className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Certificates</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
              <Award className="text-yellow-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Avg Progress</p>
                <p className="text-2xl font-bold">{avgProgress}%</p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">My Courses</h2>
          {myCourses.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-500">You are not enrolled in any course.</p>
              <button
                onClick={() => router.push("/education")}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((enrollment) => (
                <div key={enrollment._id} className="bg-white rounded-xl shadow-md p-5">
                  <h3 className="font-bold text-lg">{enrollment.course?.title}</h3>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/education/courses/${enrollment.course._id}`)}
                    className="mt-4 w-full flex justify-center items-center gap-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}