'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes'; // optional – if you want next-themes, but we implement simple toggle
import { Sun, Moon, Download, Copy, RotateCw, FileText, CheckCircle, XCircle } from 'lucide-react'; // optional icons – you can remove if not wanted

// -------------------------------
// Types
// -------------------------------
interface DocMeta {
  word_count: number;
  filename: string;
}

interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'truefalse';
  options: string[];
  answer: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

interface Quiz {
  title: string;
  questions: Question[];
  warning?: string;
}

interface Score {
  results: (Question & { userAnswer: string; correct: boolean })[];
  correct: number;
  total: number;
  pct: number;
}

type Phase = 'upload' | 'config' | 'generating' | 'quiz' | 'results';

// -------------------------------
// Helper: get API base URL
// -------------------------------
const API_BASE = 'https://5918brkf-8001.inc1.devtunnels.ms';

// -------------------------------
// Custom hook for localStorage persistence
// -------------------------------
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.error(error);
    }
  }, [key]);
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

// -------------------------------
// Main Component
// -------------------------------
export default function QuizApp() {
  // --- Theme (simple toggle, no extra deps) ---
  const [darkMode, setDarkMode] = useLocalStorage('quiz-dark-mode', false);
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // --- Core state ---
  const [file, setFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questionType, setQuestionType] = useState<'Multiple Choice' | 'True / False'>('Multiple Choice');
  const [phase, setPhase] = useLocalStorage<Phase>('quiz-phase', 'upload');
  const [streamedText, setStreamedText] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [quiz, setQuiz] = useLocalStorage<Quiz | null>('quiz-data', null);
  const [answers, setAnswers] = useLocalStorage<Record<string, string>>('quiz-answers', {});
  const [score, setScore] = useState<Score | null>(null);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [docMeta, setDocMeta] = useState<DocMeta | null>(null);
  const [generatingRetry, setGeneratingRetry] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load score from localStorage on mount (if exists)
  useEffect(() => {
    const savedScore = localStorage.getItem('quiz-score');
    if (savedScore) setScore(JSON.parse(savedScore));
  }, []);

  // Save score to localStorage when it changes
  useEffect(() => {
    if (score) localStorage.setItem('quiz-score', JSON.stringify(score));
    else localStorage.removeItem('quiz-score');
  }, [score]);

  // Cleanup on unmount
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  // --- File handling ---
  const handleFile = async (selectedFile: File | null) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      setError('Please upload a PDF or Word (.doc/.docx) file.');
      return;
    }
    setError('');
    setFile(selectedFile);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await fetch(`${API_BASE}/extract-text`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const meta = await res.json();
      setDocMeta(meta);
      setPhase('config');
    } catch (err: any) {
      setError(`Could not read file: ${err.message}`);
    }
  };

  // --- Quiz generation (streaming) with retry logic ---
  const generateQuiz = async (retryCount = 0) => {
    if (!file) return;
    setPhase('generating');
    setStreamedText('');
    setQuestionCount(0);
    setError('');
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('num_questions', String(numQuestions));
    formData.append('question_type', questionType);

    try {
      const response = await fetch(`${API_BASE}/generate-quiz-stream`, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) throw new Error(await response.text());

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      const decoder = new TextDecoder();
      let buffer = '';
      let streamCompleted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const eventBlock of events) {
          const trimmed = eventBlock.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(trimmed.slice(6));
            switch (event.type) {
              case 'question':
                setStreamedText((prev) => prev + JSON.stringify(event.data, null, 2) + '\n\n');
                setQuestionCount((c) => c + 1);
                break;
              case 'done':
                streamCompleted = true;
                if (event.error) throw new Error(event.error);
                setQuiz(event.quiz);
                setAnswers({});
                setScore(null);
                setPhase('quiz');
                break;
              case 'error':
                throw new Error(event.message);
            }
          } catch (e) { /* ignore parse errors */ }
        }
      }
      if (!streamCompleted) throw new Error('Stream ended unexpectedly');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        if (retryCount < 2) {
          setError(`Generation failed, retrying (${retryCount + 1}/2)...`);
          setTimeout(() => generateQuiz(retryCount + 1), 1500);
        } else {
          setError(`Generation failed: ${err.message}`);
          setPhase('config');
        }
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  // --- Submit quiz ---
  const submitQuiz = () => {
    if (!quiz) return;
    const results = quiz.questions.map((q, idx) => {
      const key = q.id || String(idx);
      const userAnswer = (answers[key] || '').trim();
      const correct = userAnswer.toLowerCase() === q.answer.trim().toLowerCase();
      return { ...q, userAnswer, correct };
    });
    const correctCount = results.filter((r) => r.correct).length;
    const newScore = {
      results,
      correct: correctCount,
      total: results.length,
      pct: Math.round((correctCount / results.length) * 100),
    };
    setScore(newScore);
    setPhase('results');
  };

  // --- Export results ---
  const exportResults = (format: 'json' | 'text') => {
    if (!score) return;
    const data = {
      quizTitle: quiz?.title,
      score: score.pct,
      correct: score.correct,
      total: score.total,
      details: score.results.map(r => ({
        question: r.question,
        userAnswer: r.userAnswer,
        correctAnswer: r.answer,
        correct: r.correct,
      })),
    };
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz-results-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      let text = `Quiz Results: ${quiz?.title}\nScore: ${score.pct}% (${score.correct}/${score.total})\n\n`;
      score.results.forEach((r, i) => {
        text += `${i+1}. ${r.question}\n   Your answer: ${r.userAnswer || '(none)'}\n   Correct: ${r.answer}\n   ${r.correct ? '✓' : '✗'}\n\n`;
      });
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  // --- Reset everything ---
  const resetToUpload = () => {
    setFile(null);
    setDocMeta(null);
    setQuiz(null);
    setAnswers({});
    setScore(null);
    setPhase('upload');
    setError('');
    setStreamedText('');
    setQuestionCount(0);
    localStorage.removeItem('quiz-data');
    localStorage.removeItem('quiz-answers');
    localStorage.removeItem('quiz-phase');
    localStorage.removeItem('quiz-score');
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  // --- UI helpers ---
  const totalQuestions = quiz?.questions.length || 0;
  const answeredCount = quiz?.questions.filter((q, idx) => {
    const ans = answers[q.id || String(idx)];
    return ans !== undefined && ans.trim() !== '';
  }).length || 0;

  // --- Render ---
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-amber-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📚 AI Quiz Generator</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Phase: Upload */}
        {phase === 'upload' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Upload Document</div>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
            >
              <div className="text-5xl mb-3">📄</div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">Drop file here or click to browse</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, DOCX — processed on server</p>
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
            {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
          </div>
        )}

        {/* Phase: Config */}
        {phase === 'config' && file && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-4">
              <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">Document</div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full">
                <span>📎 {file.name}</span>
                {docMeta && <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">{docMeta.word_count} words</span>}
                <button onClick={() => setPhase('upload')} className="ml-2 text-indigo-500 hover:text-indigo-700">×</button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Quiz Settings</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Question Type
                  <select
                    className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as any)}
                  >
                    <option>Multiple Choice</option>
                    <option>True / False</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Questions: {numQuestions}
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </label>
              </div>
              <button
                onClick={() => generateQuiz()}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition"
              >
                ✦ Generate Quiz
              </button>
              {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
            </div>
          </>
        )}

        {/* Phase: Generating */}
        {phase === 'generating' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 dark:text-gray-300">AI is generating your quiz on the server…</span>
              <span className="ml-auto text-indigo-600 dark:text-indigo-400 text-sm">{questionCount > 0 ? `${questionCount} questions received` : 'Starting...'}</span>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-80 text-sm font-mono whitespace-pre-wrap">
              {streamedText || 'Waiting for first question...'}
              <span className="inline-block w-1.5 h-4 bg-green-400 animate-pulse ml-0.5 align-middle"></span>
            </pre>
          </div>
        )}

        {/* Phase: Quiz */}
        {phase === 'quiz' && quiz && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <button onClick={() => setPhase('config')} className="text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-1 hover:underline">← Settings</button>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h2>
              <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">{totalQuestions} questions</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}></div>
            </div>
            {quiz.warning && <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">⚠️ {quiz.warning}</div>}
            {quiz.questions.map((q, idx) => {
              const key = q.id || String(idx);
              return (
                <div key={key} className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    <span>Q{idx+1}</span>
                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">{q.type === 'mcq' ? 'MCQ' : 'True/False'}</span>
                    {q.difficulty && <span className={`px-2 py-0.5 rounded-full text-white text-xs ${
                      q.difficulty === 'Easy' ? 'bg-green-600' : q.difficulty === 'Hard' ? 'bg-red-600' : 'bg-yellow-600'
                    }`}>{q.difficulty}</span>}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const value = q.type === 'mcq' ? String.fromCharCode(65 + optIdx) : opt;
                      const isSelected = answers[key] === value;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => setAnswers(prev => ({ ...prev, [key]: value }))}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {q.type === 'mcq' && <span className="inline-block w-6 font-bold">{String.fromCharCode(65 + optIdx)}.</span>}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <button
              onClick={submitQuiz}
              disabled={answeredCount < totalQuestions}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition ${
                answeredCount < totalQuestions ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {answeredCount < totalQuestions ? `Answer all (${answeredCount}/${totalQuestions})` : '✓ Submit Quiz'}
            </button>
          </div>
        )}

        {/* Phase: Results */}
        {phase === 'results' && score && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="text-center py-4">
              <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white shadow-lg">
                <div className="text-4xl font-bold">{score.pct}%</div>
                <div className="text-xs opacity-80 uppercase">Score</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                {score.pct >= 80 ? '🎉 Excellent!' : score.pct >= 60 ? '👍 Good effort!' : '📚 Keep practicing!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{score.correct} of {score.total} correct</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl text-center">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{score.correct}</div>
                <div className="text-xs uppercase text-gray-500">Correct</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl text-center">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">{score.total - score.correct}</div>
                <div className="text-xs uppercase text-gray-500">Wrong</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl text-center">
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{score.pct}%</div>
                <div className="text-xs uppercase text-gray-500">Percent</div>
              </div>
            </div>

            <div className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Review Answers</div>
            {score.results.map((r, idx) => (
              <div key={idx} className="flex gap-3 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${r.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {r.correct ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Q{idx+1}: {r.question}</div>
                  {r.difficulty && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 inline-block mb-1">{r.difficulty}</span>}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {r.correct ? (
                      <span className="text-green-600 dark:text-green-400">Your answer: {r.userAnswer} ✓</span>
                    ) : (
                      <>
                        <span className="text-red-600 dark:text-red-400">Your: {r.userAnswer || '(none)'}</span> · <span className="text-green-600 dark:text-green-400">Correct: {r.answer}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => { setAnswers({}); setScore(null); setPhase('quiz'); }} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                ↺ Retake
              </button>
              <button onClick={() => setPhase('config')} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                ⚙ Settings
              </button>
              <button onClick={() => exportResults('json')} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-1">
                <Download size={16} /> JSON
              </button>
              <button onClick={() => exportResults('text')} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-1">
                <Copy size={16} /> Copy
              </button>
              <button onClick={resetToUpload} className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
                + New Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}