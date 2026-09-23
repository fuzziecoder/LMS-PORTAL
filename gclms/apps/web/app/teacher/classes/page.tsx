'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Layers, Users, BookOpen, Clock, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_CLASSES } from '@/lib/fixtures/academic';

export default function TeacherClassesPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const myClasses = FIXTURE_CLASSES.filter((c) => c.lead_teacher === 'Rajesh Kumar' || c.lead_teacher === 'Anita Desai');

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">My Assigned Classes & Cohorts</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Manage your cohort rosters, daily roll call sessions, timetable periods, and course allocations.
            </p>
          </div>
          <Link
            href="/teacher/attendance"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Start Today&apos;s Roll Call
          </Link>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myClasses.map((cls) => (
            <div key={cls.id} className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-bold border border-primary-100 text-[11px]">
                      {cls.grade_level}
                    </span>
                    <h3 className="text-base font-bold text-foreground-strong mt-2">{cls.name}</h3>
                    <div className="text-xs text-foreground-muted">Room: {cls.room_number} • Lead: {cls.lead_teacher}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-foreground-muted">Attendance</span>
                    <div className="text-base font-bold text-success mt-0.5">{cls.avg_attendance}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-surface-subtle border border-border rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="text-[11px] text-foreground-muted">Enrolled Students</div>
                      <div className="font-bold text-foreground-strong">{cls.student_count} Active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                    <div>
                      <div className="text-[11px] text-foreground-muted">STEM Courses</div>
                      <div className="font-bold text-foreground-strong">{cls.active_courses} Courses</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                <Link
                  href={`/teacher/classes/${cls.id}`}
                  className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:underline"
                >
                  Open Class Dossier <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/teacher/grades"
                  className="text-foreground-muted hover:text-foreground-strong font-medium"
                >
                  View Gradebook
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
