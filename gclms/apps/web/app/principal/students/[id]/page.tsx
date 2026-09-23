'use client';

import React, { use } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { ArrowLeft, BookOpen, Award, CheckCircle2, Calendar, FileText, Code2, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_USERS } from '@/lib/fixtures/users';

export default function PrincipalStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const student = FIXTURE_USERS.find((u) => u.id === studentId) || {
    id: studentId,
    name: 'Tharun V.',
    email: 'student.tharun.chennai@gclms.local',
    role: 'STUDENT',
    school_name: 'Chennai Innovation Academy',
    status: 'ACTIVE' as const,
    created_at: '2026-02-10T14:00:00Z',
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Link href="/principal/students" className="hover:text-primary-600 inline-flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Students
          </Link>
          <span>/</span>
          <span className="text-foreground-strong font-semibold">{student.name}</span>
        </div>

        {/* Student Profile Header Card */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-card">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground-strong">{student.name}</h1>
                  <StatusBadge status={student.status} />
                </div>
                <div className="text-xs text-foreground-muted mt-1 space-y-0.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-primary-600 font-semibold">Roll: CIA-2026-104</span>
                    <span>•</span>
                    <span>Class: Grade 10 - Section A</span>
                    <span>•</span>
                    <span>Term: 2025-2026 Term 2</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground-subtle pt-1">
                    <Mail className="w-3.5 h-3.5" /> {student.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-border">
              <div className="text-right">
                <div className="text-xs text-foreground-muted font-medium">Academic Weighted GPA</div>
                <div className="text-2xl font-bold text-primary-600">3.88 / 4.0</div>
                <div className="text-[11px] text-success font-semibold">Tier 1 Distinction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Tabs / Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Courses & Modules */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-600" /> Active Course Enrollments & Progress
              </h2>
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-foreground-strong">Introduction to Python & Computational Thinking</div>
                      <div className="text-[11px] text-foreground-muted">Teacher: Rajesh Kumar • 6/8 Modules Done</div>
                    </div>
                    <span className="text-xs font-bold text-primary-600">75%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div className="bg-primary-600 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-foreground-strong">Applied Artificial Intelligence & Machine Learning</div>
                      <div className="text-[11px] text-foreground-muted">Teacher: Anita Desai • 4/8 Modules Done</div>
                    </div>
                    <span className="text-xs font-bold text-primary-600">50%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div className="bg-primary-600 h-full rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments & Quizzes History */}
            <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
                <Award className="w-4 h-4 text-primary-600" /> Recent Assessment Scores
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase font-semibold">
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-foreground-strong">Assignment 1: Logic Circuits</td>
                      <td className="py-2.5 px-3 text-foreground-muted">Homework</td>
                      <td className="py-2.5 px-3 font-bold text-success">95 / 100</td>
                      <td className="py-2.5 px-3"><span className="text-[10px] bg-success/10 text-success font-semibold px-2 py-0.5 rounded">GRADED</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-foreground-strong">Quiz 1: Python Basics</td>
                      <td className="py-2.5 px-3 text-foreground-muted">Online Quiz</td>
                      <td className="py-2.5 px-3 font-bold text-success">90 / 100</td>
                      <td className="py-2.5 px-3"><span className="text-[10px] bg-success/10 text-success font-semibold px-2 py-0.5 rounded">GRADED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600" /> Attendance Overview
              </h2>
              <div className="text-center py-2">
                <div className="text-3xl font-bold text-success">96.4%</div>
                <div className="text-xs text-foreground-muted mt-1">48 of 50 School Days Present</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                <div className="p-2 bg-surface-subtle rounded-lg text-center">
                  <div className="font-semibold text-foreground-muted">Absences</div>
                  <div className="font-bold text-foreground-strong mt-0.5">2 Days</div>
                </div>
                <div className="p-2 bg-surface-subtle rounded-lg text-center">
                  <div className="font-semibold text-foreground-muted">Late Arrivals</div>
                  <div className="font-bold text-foreground-strong mt-0.5">0 Days</div>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-3">
              <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary-600" /> Showcase Innovation Project
              </h2>
              <div className="p-3 bg-surface-subtle rounded-lg border border-border text-xs space-y-1.5">
                <div className="font-bold text-foreground-strong">Autonomous Solar Rover Simulator</div>
                <p className="text-[11px] text-foreground-muted line-clamp-2">
                  Simulating Mars rover navigation algorithms using WebGL and Python backend path-planning.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-primary-600 font-semibold pt-1">
                  Status: APPROVED by Faculty
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
