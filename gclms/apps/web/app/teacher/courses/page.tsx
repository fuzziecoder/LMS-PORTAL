'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { BookOpen, Users, Layers, ArrowRight, PlusCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_COURSES } from '@/lib/fixtures/courses';

export default function TeacherCoursesPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const myCourses = FIXTURE_COURSES.filter((c) => c.teacher_name === 'Rajesh Kumar' || c.teacher_name === 'Anita Desai');

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">My Taught Courses & Curricula</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Structure course modules, create lessons, attach programming notebooks, and track student completion.
            </p>
          </div>
          <Link
            href="/teacher/lessons"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Lesson Planner
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myCourses.map((c) => (
            <div key={c.id} className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary-600">{c.code}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="font-bold text-base text-foreground-strong">{c.title}</h3>
                <p className="text-xs text-foreground-muted line-clamp-2">{c.description}</p>

                <div className="grid grid-cols-2 gap-2 bg-surface-subtle border border-border rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="text-[11px] text-foreground-muted">Enrolled Students</div>
                      <div className="font-bold text-foreground-strong">{c.enrolled_students} Active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="text-[11px] text-foreground-muted">Modules & Lessons</div>
                      <div className="font-bold text-foreground-strong">{c.modules_count} Mods / {c.lessons_count} Lessons</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-foreground-muted">Class Completion Avg</span>
                    <span className="font-bold text-foreground-strong">{c.completion_rate}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary-600 h-full rounded-full" style={{ width: `${c.completion_rate}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                <Link href="/teacher/lessons" className="text-primary-600 font-semibold hover:underline inline-flex items-center gap-1">
                  Open Lesson Builder <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/teacher/assignments" className="text-foreground-muted hover:text-foreground-strong font-medium">
                  Assignments
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
