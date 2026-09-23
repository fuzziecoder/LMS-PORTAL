'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { BookOpen, Search, PlusCircle, Filter } from 'lucide-react';
import { FIXTURE_COURSES } from '@/lib/fixtures/courses';

export default function FounderCoursesPage() {
  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };
  const [search, setSearch] = useState('');

  const filteredCourses = FIXTURE_COURSES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Global Course & Curriculum Catalog</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Standardized STEM, AI, Robotics, Coding, and Innovation modules distributed across all 5 schools.
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700">
            <PlusCircle className="w-4 h-4" /> Create Global Course
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses or subjects..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-surface rounded-xl border border-border shadow-card overflow-hidden flex flex-col justify-between hover:shadow-elevated transition-all">
              <div>
                <div className={`p-4 bg-gradient-to-r ${course.thumbnail_gradient || 'from-primary-600 to-primary-800'} text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/20 text-white">
                      {course.subject}
                    </span>
                    <span className="text-[10px] font-bold text-white/80">{course.code}</span>
                  </div>
                  <h3 className="font-bold text-base mt-3">{course.title}</h3>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-[11px]">
                    <div>
                      <span className="text-foreground-subtle block">Modules:</span>
                      <strong className="text-foreground-strong">{course.modules_count} Modules ({course.lessons_count} Lessons)</strong>
                    </div>
                    <div>
                      <span className="text-foreground-subtle block">Enrolled:</span>
                      <strong className="text-foreground-strong">{course.enrolled_students} Students</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
                <StatusBadge status={course.status} />
                <button className="font-semibold text-primary-600 hover:underline">
                  Curriculum Editor →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
