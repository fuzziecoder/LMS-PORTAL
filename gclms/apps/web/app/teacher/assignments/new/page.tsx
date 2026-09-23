'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, Save, PlusCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TeacherNewAssignmentPage() {
  const router = useRouter();
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [form, setForm] = useState({
    title: '',
    course_title: 'Introduction to Python & Computational Thinking',
    target_class: 'Grade 10 - Section A',
    due_at: '2026-04-05T23:59',
    max_marks: 100,
    instructions: '',
    allow_late: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Assignment "${form.title || 'New Assignment'}" created and published to students!`);
    router.push('/teacher/assignments');
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Link href="/teacher/assignments" className="hover:text-primary-600 inline-flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Assignments
          </Link>
          <span>/</span>
          <span className="text-foreground-strong font-semibold">New Assignment</span>
        </div>

        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">Create New Coding Assignment</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Specify homework problem requirements, submission formats (code vs files), deadlines, and grading rubrics.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-5">
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-foreground-strong block mb-1">Assignment Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Assignment 3: Object-Oriented Bank Account Class"
                className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Course Curriculum</label>
                <select
                  value={form.course_title}
                  onChange={(e) => setForm({ ...form, course_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong text-xs"
                >
                  <option value="Introduction to Python & Computational Thinking">Introduction to Python & Computational Thinking</option>
                  <option value="Applied Artificial Intelligence & Machine Learning">Applied Artificial Intelligence & Machine Learning</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground-strong block mb-1">Target Class Cohort</label>
                <select
                  value={form.target_class}
                  onChange={(e) => setForm({ ...form, target_class: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong text-xs"
                >
                  <option value="Grade 10 - Section A">Grade 10 - Section A</option>
                  <option value="Grade 10 - Section B">Grade 10 - Section B</option>
                  <option value="Grade 11 - AI Specialized">Grade 11 - AI Specialized</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Submission Deadline</label>
                <input
                  type="datetime-local"
                  required
                  value={form.due_at}
                  onChange={(e) => setForm({ ...form, due_at: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-foreground-strong block mb-1">Maximum Evaluated Score (Points)</label>
                <input
                  type="number"
                  required
                  value={form.max_marks}
                  onChange={(e) => setForm({ ...form, max_marks: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-foreground-strong block mb-1">Instructions & Problem Specifications</label>
              <textarea
                rows={6}
                required
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                placeholder="Detail the coding requirements, required functions, edge cases, and automated test pass criteria..."
                className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong text-xs font-mono"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.allow_late}
                onChange={(e) => setForm({ ...form, allow_late: e.target.checked })}
                className="rounded border-border text-primary-600"
              />
              <span className="font-medium text-foreground-strong">
                Allow late submissions (Flagged automatically as LATE in grading queue)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Link
              href="/teacher/assignments"
              className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Publish Assignment to Students
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
