"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import { Loader2, Plus, BookOpen, Users, IndianRupee, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await educationAPI.getInstructorCourses();
      setCourses(res.data.courses);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await educationAPI.deleteCourse(id);
      toast.success("Course deleted");
      fetchCourses();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <Link
          href="/education/instructor/courses/new"
          className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-[#0d1757] transition"
        >
          <Plus size={18} /> Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">You haven't created any courses yet.</p>
          <Link href="/education/instructor/courses/new" className="text-[#1a237e] font-medium mt-2 inline-block">
            Create your first course →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course: any) => (
            <div key={course._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-10 h-10 text-white/60" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Users size={14} /> {course.totalEnrolled || 0}</span>
                  <span className="flex items-center gap-1"><IndianRupee size={14} /> {course.price || "Free"}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/education/instructor/courses/${course._id}`}
                    className="flex-1 text-center py-2 bg-[#1a237e] text-white rounded-lg text-sm font-medium hover:bg-[#0d1757] transition"
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}