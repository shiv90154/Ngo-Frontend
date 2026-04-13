"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, DollarSign, PlusCircle, Edit, Trash2, Eye, Users } from "lucide-react";
import api from "@/config/api";

export default function TeacherDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses created by this teacher
        const coursesRes = await api.get("/education/courses?myCourses=true"); // backend should support filter
        const earningsRes = await api.get("/education/teacher/earnings");
        setCourses(coursesRes.data);
        setEarnings(earningsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (courseId) => {
    if (!confirm("Delete this course?")) return;
    try {
      await api.delete(`/education/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage courses and track earnings</p>
          </div>
          <button
            onClick={() => router.push("/education/courses/create")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusCircle size={18} /> New Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">My Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <Users className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="text-yellow-500" size={32} />
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">My Courses</h2>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No courses created yet.</p>
              <button
                onClick={() => router.push("/education/courses/create")}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Create First Course
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {courses.map((course) => (
                <div key={course._id} className="p-5 flex flex-wrap justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-gray-600 text-sm">{course.enrolledCount || 0} students enrolled</p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => router.push(`/education/courses/${course._id}`)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => router.push(`/education/courses/edit/${course._id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}