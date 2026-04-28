"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { educationAPI } from "@/lib/api";
import { Loader2, Plus, BookOpen, PenTool, Video, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ManageCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"content" | "tests" | "live">("content");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, chaptersRes, lessonsRes, testsRes, liveRes] = await Promise.all([
          educationAPI.getCourseDetails(id as string),
          educationAPI.getCourseDetails(id as string), // chapters & lessons are inside
          educationAPI.getCourseDetails(id as string),
          educationAPI.getPublishedCourses(), // we'll filter by course later (need backend endpoint)
          educationAPI.getLiveClassesByCourse(id as string),
        ]);
        setCourse(courseRes.data.course);
        setChapters(courseRes.data.chapters || []);
        setLessons(courseRes.data.lessons || []);
        setLiveClasses(liveRes.data.liveClasses || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#1a237e]" /></div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-500">{course.category} • ₹{course.price || "Free"}</p>
        </div>
        <Link
          href={`/education/instructor/courses/${id}/edit`}
          className="flex items-center gap-2 border border-[#1a237e] text-[#1a237e] px-4 py-2 rounded-lg hover:bg-[#1a237e]/5 transition"
        >
          <PenTool size={16} /> Edit Course
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4 flex gap-6">
          {["content", "tests", "live"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 font-medium capitalize ${activeTab === tab ? "text-[#1a237e] border-b-2 border-[#1a237e]" : "text-gray-500"}`}
            >
              {tab === "content" ? "Chapters & Lessons" : tab === "tests" ? "Tests" : "Live Classes"}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Content Tab */}
          {activeTab === "content" && (
            <div>
              <button
                onClick={async () => {
                  const title = prompt("Chapter title:");
                  if (!title) return;
                  const order = chapters.length + 1;
                  await educationAPI.addChapter(id as string, title, order);
                  toast.success("Chapter added");
                  // refresh
                }}
                className="flex items-center gap-2 text-[#1a237e] mb-4 font-medium"
              >
                <Plus size={16} /> Add Chapter
              </button>
              {chapters.map((chap: any) => {
                const chapterLessons = lessons.filter((l: any) => l.chapter === chap._id);
                return (
                  <div key={chap._id} className="mb-4 border rounded-lg p-3">
                    <h3 className="font-medium">{chap.title} (Order: {chap.order})</h3>
                    <div className="mt-2 space-y-1">
                      {chapterLessons.map((lesson: any) => (
                        <div key={lesson._id} className="flex items-center justify-between text-sm bg-gray-50 rounded p-2">
                          <div className="flex items-center gap-2">
                            {lesson.type === "video" ? <Video size={14} /> : <BookOpen size={14} />}
                            {lesson.title}
                          </div>
                          <button onClick={() => toast.info("Delete lesson coming soon")} className="text-red-500"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={async () => {
                        const title = prompt("Lesson title:");
                        if (!title) return;
                        const type = prompt("Type (video/pdf/quiz):", "video") || "video";
                        await educationAPI.addLesson({ chapterId: chap._id, title, type, content: {}, order: chapterLessons.length + 1 });
                        toast.success("Lesson added");
                        // refresh
                      }}
                      className="text-sm text-[#1a237e] mt-2 font-medium"
                    >
                      + Add Lesson
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tests Tab */}
          {activeTab === "tests" && (
            <div>
              <Link
                href={`/education/instructor/tests/new?courseId=${id}`}
                className="flex items-center gap-2 text-[#1a237e] mb-4 font-medium"
              >
                <Plus size={16} /> Create Test
              </Link>
              {tests.length === 0 ? (
                <p className="text-gray-500">No tests created for this course yet.</p>
              ) : (
                tests.map((test: any) => (
                  <div key={test._id} className="border rounded-lg p-3 mb-2 flex justify-between">
                    <div>
                      <p className="font-medium">{test.title}</p>
                      <p className="text-sm text-gray-500">Duration: {test.duration} min | Marks: {test.totalMarks}</p>
                    </div>
                    <Link href={`/education/instructor/tests/${test._id}`} className="text-[#1a237e] text-sm">Manage</Link>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Live Classes Tab */}
          {activeTab === "live" && (
            <div>
              <Link
                href={`/education/instructor/courses/${id}/live/new`}
                className="flex items-center gap-2 text-[#1a237e] mb-4 font-medium"
              >
                <Plus size={16} /> Schedule Live Class
              </Link>
              {liveClasses.length === 0 ? (
                <p className="text-gray-500">No live classes scheduled.</p>
              ) : (
                liveClasses.map((lc: any) => (
                  <div key={lc._id} className="border rounded-lg p-3 mb-2 flex justify-between">
                    <div>
                      <p className="font-medium">{lc.title}</p>
                      <p className="text-sm text-gray-500">{new Date(lc.startTime).toLocaleString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${lc.status === "live" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{lc.status}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}