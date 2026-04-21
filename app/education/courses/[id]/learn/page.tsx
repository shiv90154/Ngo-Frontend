"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LearnPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams.get("lesson");
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await educationAPI.getCourseDetails(id as string);
      setCourse(res.data.course);
      setLessons(res.data.lessons);
      setEnrollment(res.data.enrollment);
      const found = res.data.lessons.find((l: any) => l._id === lessonId) || res.data.lessons[0];
      setCurrentLesson(found);
      if (found && res.data.enrollment?.completedLessons?.includes(found._id)) {
        setCompleted(true);
      }
    };
    fetchData();
  }, [id, lessonId]);

  const markComplete = async () => {
    if (!currentLesson) return;
    try {
      await educationAPI.markLessonComplete(id as string, currentLesson._id);
      setCompleted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToLesson = (lesson: any) => {
    router.push(`/education/courses/${id}/learn?lesson=${lesson._id}`);
  };

  const currentIndex = lessons.findIndex((l: any) => l._id === currentLesson?._id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (!currentLesson) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-black rounded-xl overflow-hidden mb-4">
        {currentLesson.type === "video" ? (
          <video src={currentLesson.content.videoUrl} controls className="w-full aspect-video" />
        ) : (
          <iframe src={currentLesson.content.pdfUrl} className="w-full h-[70vh]" />
        )}
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{currentLesson.title}</h1>
        <button
          onClick={markComplete}
          disabled={completed}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${completed ? "bg-green-100 text-green-700" : "bg-[#1a237e] text-white"}`}
        >
          <CheckCircle size={16} /> {completed ? "Completed" : "Mark Complete"}
        </button>
      </div>
      <div className="flex justify-between mt-6">
        {prevLesson ? (
          <button onClick={() => navigateToLesson(prevLesson)} className="flex items-center gap-1 text-[#1a237e]">
            <ChevronLeft size={18} /> {prevLesson.title}
          </button>
        ) : <div />}
        {nextLesson ? (
          <button onClick={() => navigateToLesson(nextLesson)} className="flex items-center gap-1 text-[#1a237e]">
            {nextLesson.title} <ChevronRight size={18} />
          </button>
        ) : <div />}
      </div>
      <div className="mt-4">
        <Link href={`/education/courses/${id}`} className="text-gray-500">← Back to course</Link>
      </div>
    </div>
  );
}