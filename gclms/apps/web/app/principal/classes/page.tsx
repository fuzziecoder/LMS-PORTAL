'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Layers, PlusCircle, Users, BookOpen, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { FIXTURE_CLASSES } from '@/lib/fixtures/academic';

export default function PrincipalClassesPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [classes, setClasses] = useState(FIXTURE_CLASSES);

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Classes & Academic Sections</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Structure grade levels, assign class coordinators, configure room allocations, and track cohort attendance.
            </p>
          </div>
          <button
            onClick={() => alert('Add Class / Section builder triggered.')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Create New Class Section
          </button>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-bold border border-primary-100 text-[11px]">
                      {cls.grade_level}
                    </span>
                    <span className="text-xs text-foreground-muted font-medium">Room: {cls.room_number}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground-strong mt-1.5">{cls.name}</h3>
                  <div className="text-xs text-foreground-muted mt-0.5">
                    Lead Faculty Coordinator: <span className="font-semibold text-foreground-strong">{cls.lead_teacher}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-foreground-muted">Attendance Rate</div>
                  <div className="text-lg font-bold text-success mt-0.5">{cls.avg_attendance}%</div>
                </div>
              </div>

              {/* Class KPI Strip */}
              <div className="grid grid-cols-3 gap-2 bg-surface-subtle border border-border rounded-lg p-3 text-xs text-center">
                <div>
                  <div className="text-[11px] text-foreground-muted">Enrolled Students</div>
                  <div className="font-bold text-foreground-strong mt-0.5 flex items-center justify-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary-600" /> {cls.student_count}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-foreground-muted">Active Courses</div>
                  <div className="font-bold text-foreground-strong mt-0.5 flex items-center justify-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-primary-600" /> {cls.active_courses}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-foreground-muted">Term Session</div>
                  <div className="font-bold text-foreground-strong mt-0.5 text-[10px] truncate">
                    Term 2
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                <span className="text-foreground-subtle text-[11px]">Daily Roll Call: Up to date</span>
                <div className="flex items-center gap-3">
                  <button className="text-foreground-muted hover:text-foreground-strong font-medium">View Roster</button>
                  <button className="text-primary-600 font-semibold hover:underline">Manage Timetable</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
