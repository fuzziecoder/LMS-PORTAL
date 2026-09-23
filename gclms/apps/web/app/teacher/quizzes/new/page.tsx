'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, PlusCircle, Save, Trash2, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TeacherNewQuizPage() {
  const router = useRouter();
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(25);
  const [passMark, setPassMark] = useState(75);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      prompt: 'What does the `len()` function return in Python?',
      type: 'MULTIPLE_CHOICE',
      options: ['Length / count of items', 'Memory byte size', 'Execution time', 'List index'],
      correctAnswer: 'Length / count of items',
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        prompt: '',
        type: 'MULTIPLE_CHOICE',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Quiz "${title || 'New Quiz'}" saved and added to assessment bank!`);
    router.push('/teacher/quizzes');
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Link href="/teacher/quizzes" className="hover:text-primary-600 inline-flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Quizzes
          </Link>
          <span>/</span>
          <span className="text-foreground-strong font-semibold">New Assessment</span>
        </div>

        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">Create Timed Assessment & Quiz</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Build interactive question banks, specify passing percentages, and configure auto-grading rules.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-foreground-strong">Assessment Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-3">
                <label className="font-bold text-foreground-strong block mb-1">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quiz 3: Algorithms & Time Complexity"
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Pass Mark Percentage (%)</label>
                <input
                  type="number"
                  required
                  value={passMark}
                  onChange={(e) => setPassMark(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Max Attempts</label>
                <select className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong">
                  <option value="1">1 Attempt Only</option>
                  <option value="2">2 Attempts (Highest Score)</option>
                  <option value="3">3 Attempts</option>
                </select>
              </div>
            </div>
          </div>

          {/* Question Builder */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground-strong">Questions ({questions.length})</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 font-bold rounded-lg text-xs border border-primary-100 hover:bg-primary-100"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-surface-subtle border border-border rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground-strong">Question #{idx + 1}</span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))}
                        className="text-error hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={q.prompt}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].prompt = e.target.value;
                      setQuestions(updated);
                    }}
                    placeholder="Enter question text / prompt..."
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground-strong"
                  />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <input
                        key={oIdx}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].options[oIdx] = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground-strong text-xs"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/teacher/quizzes"
              className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700"
            >
              <Save className="w-4 h-4" /> Publish Quiz Assessment
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
