"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { ChevronLeft, ChevronRight, CheckCircle, Menu, X } from "lucide-react";
import Link from "next/link";

export default function LearnPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams.get("lesson");
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await educationAPI.getCourseDetails(id as string);
      setCourse(res.data.course);
      setChapters(res.data.chapters);
      setLessons(res.data.lessons);
      setEnrollment(res.data.enrollment);
      const found = res.data.lessons.find((l: any) => l._id === lessonId) || res.data.lessons[0];
      setCurrentLesson(found);
      if (found && res.data.enrollment?.completedLessons?.includes(found._id)) setCompleted(true);
    };
    fetchData();
  }, [id, lessonId]);

  const markComplete = async () => {
    if (!currentLesson) return;
    await educationAPI.markLessonComplete(id as string, currentLesson._id);
    setCompleted(true);
  };

  const navigateToLesson = (lesson: any) => router.push(`/education/courses/${id}/learn?lesson=${lesson._id}`);

  const currentIndex = lessons.findIndex((l: any) => l._id === currentLesson?._id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (!currentLesson) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-150px)]">
      {/* 侧边栏目录 */}
      <div className={`bg-white border-r overflow-y-auto ${showSidebar ? "w-80" : "w-0"} transition-all`}>
        {showSidebar && (
          <div className="p-4">
            <h3 className="font-semibold mb-2">Course Content</h3>
            {chapters.map((chap: any) => {
              const chapterLessons = lessons.filter((l: any) => l.chapter === chap._id);
              return (
                <div key={chap._id} className="mb-3">
                  <p className="text-sm font-medium text-gray-700">{chap.title}</p>
                  {chapterLessons.map((l: any) => (
                    <button key={l._id} onClick={() => navigateToLesson(l)} className={`block w-full text-left text-sm py-1 px-2 rounded ${l._id === currentLesson._id ? "bg-blue-50 text-[#1a237e]" : "text-gray-600 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-1">
                        {enrollment?.completedLessons?.includes(l._id) && <CheckCircle size={12} className="text-green-600" />}
                        {l.title}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-2 border-b flex items-center gap-2">
          <button onClick={() => setShowSidebar(!showSidebar)}>{showSidebar ? <X size={18} /> : <Menu size={18} />}</button>
          <span className="font-medium">{course?.title}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {currentLesson.type === "video" ? (
              <video src={currentLesson.content.videoUrl} controls className="w-full aspect-video bg-black rounded-xl" />
            ) : (
              <iframe src={currentLesson.content.pdfUrl} className="w-full h-[70vh] border rounded-xl" />
            )}
            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold">{currentLesson.title}</h1>
              <button onClick={markComplete} disabled={completed} className={`px-4 py-2 rounded-lg ${completed ? "bg-green-100 text-green-700" : "bg-[#1a237e] text-white"}`}>
                {completed ? "Completed" : "Mark Complete"}
              </button>
            </div>
            <div className="flex justify-between mt-6">
              {prevLesson && <button onClick={() => navigateToLesson(prevLesson)} className="text-[#1a237e]"><ChevronLeft /> Previous</button>}
              {nextLesson && <button onClick={() => navigateToLesson(nextLesson)} className="text-[#1a237e]">Next <ChevronRight /></button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}