'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { BookOpen, Search, PlusCircle, Users, Layers, CheckCircle2 } from 'lucide-react';
import { FIXTURE_COURSES } from '@/lib/fixtures/courses';

export default function PrincipalCoursesPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [search, setSearch] = useState('');
  const courses = FIXTURE_COURSES;

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">School Course Catalog</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Publish school-wide STEM courses, review lesson module completions, and manage course enrollments.
            </p>
          </div>
          <button
            onClick={() => alert('New Course Wizard triggered.')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Deploy New Course
          </button>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course title, code, or subject..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {filtered.map((course) => (
              <div key={course.id} className="bg-surface-subtle border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary-600">{course.code}</span>
                    <StatusBadge status={course.status} />
                  </div>
                  <h3 className="font-bold text-sm text-foreground-strong line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-foreground-muted line-clamp-2">{course.description}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-foreground-muted">
                    <span>Instructor: <strong className="text-foreground-strong">{course.teacher_name}</strong></span>
                    <span>{course.enrolled_students} Students</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-foreground-muted font-medium">Cohort Completion Rate</span>
                      <span className="font-bold text-foreground-strong">{course.completion_rate}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary-600 h-full rounded-full" style={{ width: `${course.completion_rate}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-foreground-subtle">{course.modules_count} Modules • {course.lessons_count} Lessons</span>
                    <button className="text-primary-600 font-semibold hover:underline">Manage Modules</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
