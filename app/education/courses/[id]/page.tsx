"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, CheckCircle, Lock, Play } from "lucide-react";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await educationAPI.getCourseDetails(id as string);
        setCourse(res.data.course);
        setChapters(res.data.chapters);
        setLessons(res.data.lessons);
        setIsEnrolled(res.data.isEnrolled);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return router.push("/login");
    try {
      await educationAPI.enrollCourse(id as string);
      setIsEnrolled(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#1a237e] to-[#283593]" />
        <div className="p-6">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm">Instructor: {course.instructor?.fullName}</span>
            <span className="text-sm">Enrolled: {course.totalEnrolled}</span>
          </div>
          {!isEnrolled && (
            <button onClick={handleEnroll} className="mt-6 bg-[#1a237e] text-white px-6 py-2 rounded-lg">
              Enroll Now {course.price > 0 && `₹${course.price}`}
            </button>
          )}
        </div>
      </div>

      {/* 章节与课时列表 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Course Content</h2>
        {chapters.map((chap: any) => {
          const chapterLessons = lessons.filter((l: any) => l.chapter === chap._id);
          return (
            <div key={chap._id} className="mb-4">
              <h3 className="font-medium text-gray-800">{chap.title}</h3>
              <div className="mt-2 space-y-1">
                {chapterLessons.map((lesson: any) => (
                  <div key={lesson._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {lesson.isPreview || isEnrolled ? <Play size={14} /> : <Lock size={14} />}
                      <span>{lesson.title}</span>
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