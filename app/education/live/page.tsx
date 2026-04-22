"use client";

import { useEffect, useState } from "react";
import { educationAPI } from "@/lib/api";
import { Video, Calendar, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LiveClassesPage() {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // 获取所有已报名课程的直播 (实际应调用专门接口)
    educationAPI.getMyEnrollments().then(async (res) => {
      const enrollments = res.data.enrollments;
      let allLive = [];
      for (const e of enrollments) {
        const liveRes = await educationAPI.getLiveClassesByCourse(e.course._id);
        allLive = [...allLive, ...liveRes.data.liveClasses];
      }
      setLiveClasses(allLive);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Live Classes</h1>
      {loading ? <Loader2 className="animate-spin" /> : liveClasses.length === 0 ? (
        <p className="text-gray-500">No live classes scheduled.</p>
      ) : (
        <div className="grid gap-4">
          {liveClasses.map((cls: any) => (
            <div key={cls._id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between">
              <div>
                <h3 className="font-semibold">{cls.title}</h3>
                <p className="text-sm text-gray-500"><Calendar size={14} /> {new Date(cls.startTime).toLocaleString()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${cls.status === 'live' ? 'bg-red-100 text-red-700' : 'bg-blue-100'}`}>{cls.status}</span>
              </div>
              <Link href={`/education/live/${cls._id}`} className="bg-[#1a237e] text-white px-4 py-2 rounded-lg">Join</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}