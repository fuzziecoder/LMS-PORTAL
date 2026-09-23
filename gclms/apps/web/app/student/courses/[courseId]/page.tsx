'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, PlayCircle, CheckCircle, Clock, FileText, Code2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FIXTURE_COURSES } from '@/lib/fixtures/courses';

export default function StudentCourseDetailPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };
  const course = FIXTURE_COURSES.find((c) => c.id === params.courseId) || FIXTURE_COURSES[0];

  const modules = [
    {
      id: 'm1',
      title: 'Module 1: Introduction to Python & Development Environments',
      lessons: [
        { id: 'les-1', title: 'Setting Up Python 3.12 & VS Code', duration: '15 mins', completed: true, type: 'VIDEO' },
        { id: 'les-2', title: 'Variables, Numeric Types & Strings', duration: '20 mins', completed: true, type: 'TEXT' },
        { id: 'les-3', title: 'Interactive Coding Challenge: String Slicing', duration: '30 mins', completed: true, type: 'CODE' },
      ],
    },
    {
      id: 'm2',
      title: 'Module 2: Control Flow & Data Structures',
      lessons: [
        { id: 'les-4', title: 'Conditional Statements (if/elif/else)', duration: '25 mins', completed: true, type: 'VIDEO' },
        { id: 'les-5', title: 'While & For Loops with Sensor Data', duration: '30 mins', completed: true, type: 'VIDEO' },
        { id: 'les-6', title: 'Python Lists, Tuples, and Dictionaries', duration: '35 mins', completed: false, type: 'CODE' },
      ],
    },
    {
      id: 'm3',
      title: 'Module 3: Functions, Modules & Real-World Algorithms',
      lessons: [
        { id: 'les-7', title: 'Defining Functions & Return Values', duration: '25 mins', completed: false, type: 'VIDEO' },
        { id: 'les-8', title: 'Working with JSON & External Libraries', duration: '40 mins', completed: false, type: 'CODE' },
      ],
    },
  ];

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <button
          onClick={() => router.push('/student/courses')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground-strong"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Courses
        </button>

        {/* Course Header Banner */}
        <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-r ${course.thumbnail_gradient || 'from-primary-900 to-primary-700'} text-white shadow-elevated`}>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 border border-white/15">
            {course.subject} • {course.code}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-3">{course.title}</h1>
          <p className="text-xs sm:text-sm text-primary-100 mt-2 max-w-2xl leading-relaxed">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-md">Instructor: <strong>{course.teacher_name}</strong></span>
            <span className="bg-white/10 px-3 py-1 rounded-md">Progress: <strong>{course.completion_rate}% Completed</strong></span>
          </div>
        </div>

        {/* Modules & Lessons Curriculum Accordion */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground-strong">Curriculum Modules</h2>

          {modules.map((mod, idx) => (
            <div key={mod.id} className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
              <div className="p-4 bg-surface-subtle border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-xs sm:text-sm text-foreground-strong">{mod.title}</h3>
                <span className="text-xs text-foreground-subtle">{mod.lessons.length} Lessons</span>
              </div>

              <div className="divide-y divide-border">
                {mod.lessons.map((les) => (
                  <div
                    key={les.id}
                    onClick={() => router.push(`/student/lessons/${les.id}`)}
                    className="p-4 flex items-center justify-between hover:bg-surface-hover cursor-pointer transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {les.completed ? (
                        <CheckCircle className="w-4 h-4 text-success-600 shrink-0" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-primary-600 shrink-0" />
                      )}
                      <div>
                        <span className={`font-semibold block ${les.completed ? 'text-foreground-muted' : 'text-foreground-strong'}`}>
                          {les.title}
                        </span>
                        <span className="text-[11px] text-foreground-subtle flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3" /> {les.duration} • Type: {les.type}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${les.completed ? 'bg-success-50 text-success-700' : 'bg-primary-50 text-primary-700'}`}>
                      {les.completed ? 'Completed' : 'Start Lesson →'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
