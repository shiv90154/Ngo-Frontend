"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/config/api";

export default function TakeTest() {
  const { testId } = useParams();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startedAt] = useState(new Date());

  useEffect(() => {
    api
      .get(`/education/tests/${testId}`) // you need to create this endpoint or fetch via course
      .then((res) => {
        setTest(res.data);
        setTimeLeft(res.data.duration * 60); // duration in minutes -> seconds
      })
      .catch(console.error);
  }, [testId]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (qIndex, optIndex) => {
    setAnswers({ ...answers, [qIndex]: optIndex });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const payload = {
      answers: Object.entries(answers).map(([qIdx, optIdx]) => ({
        questionId: parseInt(qIdx),
        selectedOption: optIdx,
      })),
      startedAt: startedAt.toISOString(),
    };
    try {
      await api.post(`/education/tests/${testId}/submit`, payload);
      alert("Test submitted successfully!");
      router.push("/education/tests/results");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!test) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{test.title}</h1>
            <div className="text-red-600 font-mono text-lg">
              Time left: {minutes}:{seconds < 10 ? "0" : ""}{seconds}
            </div>
          </div>
          <p className="text-gray-600 mb-6">{test.description}</p>

          <form onSubmit={(e) => e.preventDefault()}>
            {test.questions?.map((q, idx) => (
              <div key={idx} className="mb-6 p-4 border rounded-lg">
                <p className="font-medium mb-2">
                  {idx + 1}. {q.questionText} ({q.marks} marks)
                </p>
                <div className="space-y-2 ml-4">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={optIdx}
                        checked={answers[idx] === optIdx}
                        onChange={() => handleAnswer(idx, optIdx)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}