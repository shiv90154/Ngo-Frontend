"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { educationAPI } from "@/lib/api";

export default function TakeTestPage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const start = async () => {
      const res = await educationAPI.startTest(id as string);
      setAttemptId(res.data.attempt._id);
      setQuestions(res.data.questions);
      setTimeLeft(res.data.duration * 60);
    };
    start();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const submit = async () => {
    const answerArray = Object.entries(answers).map(([q, opt]) => ({ question: q, selectedOption: opt }));
    const res = await educationAPI.submitTest(attemptId, answerArray);
    router.push(`/education/tests/${id}/result?score=${res.data.score}&passed=${res.data.passed}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex justify-between">
        <h1>Test</h1>
        <span className="font-mono">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
      </div>
      {questions.map((q: any, idx) => (
        <div key={q._id} className="bg-white p-5 rounded-xl shadow mb-4">
          <p className="font-medium mb-3">{idx+1}. {q.questionText}</p>
          {q.options.map((opt: string, optIdx: number) => (
            <label key={optIdx} className="block mb-2">
              <input type="radio" name={q._id} value={optIdx} onChange={() => setAnswers({...answers, [q._id]: optIdx})} /> {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submit} className="w-full bg-[#1a237e] text-white py-3 rounded-lg">Submit Test</button>
    </div>
  );
}