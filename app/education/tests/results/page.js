"use client";

import { useEffect, useState } from "react";
import api from "@/config/api";

export default function TestResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/education/my-results")
      .then((res) => setResults(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">My Test Results</h1>
        {results.length === 0 ? (
          <p className="text-gray-500">No tests attempted yet.</p>
        ) : (
          <div className="space-y-4">
            {results.map((res) => (
              <div key={res._id} className="border rounded-lg p-4">
                <h2 className="font-semibold">{res.test?.title}</h2>
                <p className="text-sm text-gray-600">
                  Score: {res.score} / {res.totalMarks} ({res.percentage}%)
                </p>
                <p className={`text-sm ${res.passed ? "text-green-600" : "text-red-600"}`}>
                  {res.passed ? "Passed" : "Failed"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}