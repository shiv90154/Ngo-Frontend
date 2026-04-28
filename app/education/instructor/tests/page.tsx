// app/(education)/instructor/tests/page.tsx
"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import { Loader2, Plus, Clock, FileText, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function InstructorTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    try {
      // Get all courses first
      const coursesRes = await educationAPI.getInstructorCourses();
      const courses = coursesRes.data.courses;
      
      // Fetch tests for each course (you may want a dedicated endpoint later)
      let allTests: any[] = [];
      for (const course of courses) {
        try {
          // Assuming getCourseDetails returns tests as well (or you have a dedicated getTests endpoint)
          const detailRes = await educationAPI.getCourseDetails(course._id);
          const courseTests = (detailRes.data.tests || []).map((t: any) => ({
            ...t,
            courseTitle: course.title,
            courseId: course._id,
          }));
          allTests = [...allTests, ...courseTests];
        } catch (e) {
          console.error(`Failed to fetch tests for course ${course._id}`, e);
        }
      }
      setTests(allTests);
    } catch (error) {
      toast.error("Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTests(); }, []);

  const handleDelete = async (testId: string) => {
    if (!confirm("Delete this test? All questions will be lost.")) return;
    try {
      await educationAPI.deleteTest(testId);
      toast.success("Test deleted");
      fetchTests();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Tests</h1>
        <Link
          href="/education/instructor/tests/new"
          className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-[#0d1757] transition"
        >
          <Plus size={16} /> Create Test
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No tests created yet.</p>
          <Link href="/education/instructor/courses" className="text-[#1a237e] font-medium mt-2 inline-block">
            Go to a course to create a test →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Test Title</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Course</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-left">Marks</th>
                <th className="px-4 py-3 text-left">Passing</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test: any) => (
                <tr key={test._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{test.title}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{test.courseTitle}</td>
                  <td className="px-4 py-3">{test.duration} min</td>
                  <td className="px-4 py-3">{test.totalMarks}</td>
                  <td className="px-4 py-3">{test.passingMarks}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/education/instructor/tests/${test._id}/questions`}
                        className="p-1.5 text-[#1a237e] hover:bg-[#1a237e]/10 rounded"
                        title="Manage Questions"
                      >
                        <FileText size={16} />
                      </Link>
                      <Link
                        href={`/education/instructor/tests/${test._id}/edit`}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                        title="Edit Test"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(test._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Test"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}