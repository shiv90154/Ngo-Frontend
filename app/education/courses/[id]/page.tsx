"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, Users, Award, Video, Play, Lock, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import LiveClassList from "@/components/education/LiveClassList";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [tests, setTests] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  const isInstructor = user?.role === "TEACHER" && course?.instructor?._id === user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await educationAPI.getCourseDetails(id as string);
        setCourse(res.data.course);
        setChapters(res.data.chapters);
        setLessons(res.data.lessons);
        setTests(res.data.tests || []);
        setIsEnrolled(res.data.isEnrolled);
        setEnrollment(res.data.enrollment);
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
      // 刷新数据
      const res = await educationAPI.getCourseDetails(id as string);
      setEnrollment(res.data.enrollment);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 课程头部 */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/5 bg-gradient-to-br from-[#1a237e] to-[#283593] p-6 text-white flex items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              <p className="mt-2 text-blue-100">{course.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <span>Instructor: {course.instructor?.fullName}</span>
                <span className="flex items-center gap-1"><Users size={14} /> {course.totalEnrolled} students</span>
              </div>
              {!isEnrolled && !isInstructor && (
                <button onClick={handleEnroll} className="mt-6 bg-white text-[#1a237e] px-6 py-2 rounded-lg font-semibold">
                  Enroll Now {course.price > 0 ? `₹${course.price}` : "Free"}
                </button>
              )}
              {isEnrolled && (
                <Link href={`/education/courses/${id}/learn`} className="mt-6 inline-block bg-white text-[#1a237e] px-6 py-2 rounded-lg font-semibold">
                  Continue Learning
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-3/5 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3"><Clock /> <div><p className="text-sm text-gray-500">Duration</p><p className="font-medium">8 weeks</p></div></div>
              <div className="flex items-center gap-3"><Award /> <div><p className="text-sm text-gray-500">Certificate</p><p className="font-medium">Yes</p></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4 flex gap-6">
          {["content", "tests", "live"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 font-medium capitalize ${activeTab === tab ? "text-[#1a237e] border-b-2 border-[#1a237e]" : "text-gray-500"}`}>
              {tab === "content" ? "Course Content" : tab === "tests" ? "Tests" : "Live Classes"}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === "content" && (
            <div>
              {chapters.map((chap: any) => {
                const chapterLessons = lessons.filter((l: any) => l.chapter === chap._id);
                return (
                  <div key={chap._id} className="mb-4">
                    <h3 className="font-medium text-gray-800">{chap.title}</h3>
                    <div className="mt-2 space-y-1">
                      {chapterLessons.map((lesson: any) => (
                        <div key={lesson._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {lesson.isPreview || isEnrolled || isInstructor ? <Play size={14} /> : <Lock size={14} />}
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
          )}
          {activeTab === "tests" && (
            <div className="space-y-3">
              {tests.length === 0 ? <p className="text-gray-500">No tests available.</p> : tests.map((test: any) => (
                <div key={test._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{test.title}</h4>
                    <p className="text-sm text-gray-500">Duration: {test.duration} min | Marks: {test.totalMarks}</p>
                  </div>
                  {isEnrolled && <Link href={`/education/tests/${test._id}`} className="text-[#1a237e]">Start Test →</Link>}
                </div>
              ))}
            </div>
          )}
          {activeTab === "live" && (
            <LiveClassList courseId={id as string} isEnrolled={isEnrolled} isInstructor={isInstructor} />
          )}
        </div>
      </div>
    </div>
  );
}