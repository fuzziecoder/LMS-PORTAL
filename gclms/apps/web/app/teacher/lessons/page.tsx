'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { BookOpen, PlusCircle, Video, FileCode, CheckCircle2, Trash2, Edit3, X } from 'lucide-react';

export default function TeacherLessonsPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [lessons, setLessons] = useState([
    {
      id: 'les-1',
      module: 'Module 1: Foundations of Python',
      title: 'Variables, Expressions, and Built-in Types',
      type: 'CODE',
      duration: '45 mins',
      published: true,
    },
    {
      id: 'les-2',
      module: 'Module 1: Foundations of Python',
      title: 'Conditionals and Logical Branching',
      type: 'VIDEO',
      duration: '35 mins',
      published: true,
    },
    {
      id: 'les-3',
      module: 'Module 2: Iterations & Collections',
      title: 'While Loops and For-in Comprehensions',
      type: 'CODE',
      duration: '50 mins',
      published: true,
    },
    {
      id: 'les-4',
      module: 'Module 2: Iterations & Collections',
      title: 'Dictionaries, Key-Value Mappings & Sets',
      type: 'DOCUMENT',
      duration: '40 mins',
      published: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', module: 'Module 1: Foundations of Python', type: 'CODE', duration: '45 mins' });

  const handleAdd = () => {
    if (!newLesson.title) return;
    setLessons([
      ...lessons,
      {
        id: `les-${Date.now()}`,
        title: newLesson.title,
        module: newLesson.module,
        type: newLesson.type,
        duration: newLesson.duration,
        published: true,
      },
    ]);
    setShowModal(false);
    setNewLesson({ title: '', module: 'Module 1: Foundations of Python', type: 'CODE', duration: '45 mins' });
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Lesson Planner & Module Curriculum</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Author interactive lesson content, attach video lectures, code sandboxes, and publish to enrolled classes.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Create New Lesson
          </button>
        </div>

        {/* Lessons List */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground-strong">Course: CS-101 Introduction to Python</h2>
          <div className="space-y-3">
            {lessons.map((les) => (
              <div key={les.id} className="p-4 rounded-xl bg-surface-subtle border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{les.module}</span>
                  <h3 className="font-bold text-sm text-foreground-strong">{les.title}</h3>
                  <div className="text-xs text-foreground-muted flex items-center gap-2 pt-0.5">
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">{les.type}</span>
                    <span>•</span>
                    <span>Duration: {les.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${les.published ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {les.published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                  <button
                    onClick={() => setLessons(lessons.filter((l) => l.id !== les.id))}
                    className="p-1.5 text-foreground-muted hover:text-error transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Add Lesson */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-foreground-strong">Add New Course Lesson</h3>
                <button onClick={() => setShowModal(false)} className="text-foreground-muted hover:text-foreground-strong">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Lesson Title</label>
                  <input
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    placeholder="e.g. Recursion & Base Conditions"
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Target Module</label>
                  <select
                    value={newLesson.module}
                    onChange={(e) => setNewLesson({ ...newLesson, module: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  >
                    <option value="Module 1: Foundations of Python">Module 1: Foundations of Python</option>
                    <option value="Module 2: Iterations & Collections">Module 2: Iterations & Collections</option>
                    <option value="Module 3: Functions & Recursion">Module 3: Functions & Recursion</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Primary Content Type</label>
                  <select
                    value={newLesson.type}
                    onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  >
                    <option value="CODE">Interactive Code Sandbox (Python)</option>
                    <option value="VIDEO">Video Lecture (Embedded Stream)</option>
                    <option value="DOCUMENT">Markdown Reading / PDF</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                >
                  Create & Publish Lesson
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
