"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Play, Lock, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!id) return;
    educationAPI.getCourseDetails(id as string).then((res) => {
      setCourse(res.data.course);
      setChapters(res.data.chapters);
      setLessons(res.data.lessons);
      setIsEnrolled(res.data.isEnrolled);
    }).catch(() => toast.error("Failed to load course")).finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return router.push("/login");
    setEnrolling(true);
    try {
      await educationAPI.enrollCourse(id as string);
      setIsEnrolled(true);
      toast.success("Enrolled successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>;
  if (!course) return <div className="text-center py-12">Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#1a237e] to-[#283593]" />
        <div className="p-6">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>Instructor: {course.instructor?.fullName}</span>
            <span className="flex items-center gap-1"><Users size={14} /> {course.totalEnrolled || 0} enrolled</span>
          </div>
          {!isEnrolled ? (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="mt-6 bg-[#1a237e] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0d1757] disabled:opacity-60"
            >
              {enrolling ? "Enrolling..." : course.price > 0 ? `Enroll - ₹${course.price}` : "Enroll Free"}
            </button>
          ) : (
            <Link
              href={`/education/courses/${id}/learn`}
              className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Continue Learning
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen size={18} /> Course Content</h2>
        {chapters.map((chap: any) => {
          const chapterLessons = lessons.filter((l: any) => l.chapter === chap._id);
          return (
            <div key={chap._id} className="mb-4">
              <h3 className="font-medium text-gray-800">{chap.title}</h3>
              <div className="mt-2 space-y-1">
                {chapterLessons.map((lesson: any) => (
                  <div key={lesson._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {lesson.isPreview || isEnrolled ? <Play size={14} className="text-green-600" /> : <Lock size={14} className="text-gray-400" />}
                      <span className={isEnrolled ? "" : "text-gray-400"}>{lesson.title}</span>
                    </div>
                    {lesson.type === "video" && <span className="text-xs text-gray-500">{lesson.content?.duration} min</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}