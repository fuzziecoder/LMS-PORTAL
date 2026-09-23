'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import MetricCard from '@/components/dashboard/MetricCard';
import { Building2, ArrowLeft, GraduationCap, UserCheck, BookOpen, CalendarCheck, Mail, MapPin, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FIXTURE_SCHOOLS } from '@/lib/fixtures/schools';

export default function SchoolDetailPage({ params }: { params: { schoolId: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'teachers'>('overview');

  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };
  const school = FIXTURE_SCHOOLS.find((s) => s.id === params.schoolId) || FIXTURE_SCHOOLS[0];

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <button
          onClick={() => router.push('/founder/schools')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground-strong"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Schools Directory
        </button>

        {/* Institution Header Banner */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary-100 text-primary-700 font-bold text-xl flex items-center justify-center border border-primary-200 shadow-sm">
              {school.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground-strong">{school.name}</h1>
                <StatusBadge status={school.status} />
              </div>
              <p className="text-xs text-foreground-muted flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {school.city}, {school.state}</span>
                <span>• Code: <strong className="text-foreground-strong">{school.code}</strong></span>
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-subtle border border-border text-xs">
            <span className="text-foreground-subtle block text-[10px] uppercase font-bold">Assigned Principal</span>
            <span className="font-bold text-foreground-strong block">{school.principal_name}</span>
            <span className="text-primary-600 block text-[11px]">{school.principal_email}</span>
          </div>
        </div>

        {/* School Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <MetricCard
            title="Enrolled Students"
            value={school.student_count}
            icon={<GraduationCap className="w-4 h-4" />}
            accentColor="blue"
          />
          <MetricCard
            title="Faculty Staff"
            value={school.teacher_count}
            icon={<UserCheck className="w-4 h-4" />}
            accentColor="cyan"
          />
          <MetricCard
            title="Active STEM Courses"
            value={school.active_courses}
            icon={<BookOpen className="w-4 h-4" />}
            accentColor="violet"
          />
          <MetricCard
            title="Term Attendance"
            value={`${school.attendance_rate}%`}
            icon={<CalendarCheck className="w-4 h-4" />}
            accentColor="green"
          />
        </div>

        {/* Tabbed Detail Sections */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6">
          <div className="flex items-center gap-4 border-b border-border pb-3 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-xs font-bold pb-1 transition-all ${activeTab === 'overview' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-foreground-muted hover:text-foreground-strong'}`}
            >
              School Overview
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`text-xs font-bold pb-1 transition-all ${activeTab === 'classes' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-foreground-muted hover:text-foreground-strong'}`}
            >
              Class Roster & Sections
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`text-xs font-bold pb-1 transition-all ${activeTab === 'teachers' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-foreground-muted hover:text-foreground-strong'}`}
            >
              Teaching Staff
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-surface-subtle border border-border">
                <h3 className="font-bold text-foreground-strong text-sm mb-1">Academic & Multi-Tenant Boundaries</h3>
                <p className="text-foreground-muted leading-relaxed">
                  Data isolation is strictly enforced for {school.name}. Students and Teachers authenticated under this institution cannot access records or project portfolios from other campuses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border space-y-2">
                  <span className="font-bold text-foreground-strong">Active Curriculum Focus</span>
                  <p className="text-foreground-muted">Python Programming, Robotics & Microcontrollers, Artificial Intelligence, IoT Sensors.</p>
                </div>
                <div className="p-4 rounded-lg border border-border space-y-2">
                  <span className="font-bold text-foreground-strong">Academic Term Details</span>
                  <p className="text-foreground-muted">AY 2026–2027 • Trimester 1 Active • 94.8% Average Assignment Submission Rate.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="text-xs space-y-3">
              <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                <span className="font-bold text-foreground-strong">Grade 8 — Section A</span>
                <span className="text-foreground-muted">32 Students • Teacher: Rajesh Kumar</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                <span className="font-bold text-foreground-strong">Grade 8 — Section B</span>
                <span className="text-foreground-muted">30 Students • Teacher: Priya Sharma</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                <span className="font-bold text-foreground-strong">Grade 9 — Section A</span>
                <span className="text-foreground-muted">28 Students • Teacher: Dr. Suresh V.</span>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="text-xs space-y-3">
              <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                <div>
                  <span className="font-bold text-foreground-strong block">Rajesh Kumar</span>
                  <span className="text-[11px] text-foreground-subtle">teacher.python.chennai@gclms.local</span>
                </div>
                <span className="px-2 py-1 rounded bg-primary-50 text-primary-700 font-semibold">Python Programming</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                <div>
                  <span className="font-bold text-foreground-strong block">Anita Desai</span>
                  <span className="text-[11px] text-foreground-subtle">teacher.ai.chennai@gclms.local</span>
                </div>
                <span className="px-2 py-1 rounded bg-violet-50 text-violet-700 font-semibold">Artificial Intelligence</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
