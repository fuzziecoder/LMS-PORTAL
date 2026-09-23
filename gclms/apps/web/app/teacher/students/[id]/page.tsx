'use client';

import React, { use } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { ArrowLeft, BookOpen, Award, CheckCircle2, Calendar, FileText, Mail } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_USERS } from '@/lib/fixtures/users';

export default function TeacherStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
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
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Link href="/teacher/students" className="hover:text-primary-600 inline-flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Students
          </Link>
          <span>/</span>
          <span className="text-foreground-strong font-semibold">{student.name}</span>
        </div>

        {/* Profile Card */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xl border border-primary-200">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground-strong">{student.name}</h1>
                <StatusBadge status={student.status} />
              </div>
              <div className="text-xs text-foreground-muted mt-1">{student.email} • Class: Grade 10 - Section A</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-foreground-muted">Teacher Standing</span>
              <div className="text-xl font-bold text-success">Grade: A (91.5%)</div>
            </div>
          </div>
        </div>

        {/* Submissions & Marks */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-600" /> Python Course Graded Assignments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase font-semibold">
                  <th className="py-2.5 px-3">Assignment</th>
                  <th className="py-2.5 px-3">Submitted Date</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Teacher Notes</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-foreground-strong">Assignment 1: Logic Gates & Arithmetic</td>
                  <td className="py-2.5 px-3 text-foreground-muted">2026-03-12</td>
                  <td className="py-2.5 px-3 font-bold text-success">95 / 100</td>
                  <td className="py-2.5 px-3 text-foreground-muted">Clean code formatting with proper docstrings.</td>
                  <td className="py-2.5 px-3 text-right">
                    <Link href="/teacher/submissions" className="text-primary-600 font-semibold hover:underline">
                      Review Code
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-foreground-strong">Assignment 2: Sorting Algorithm Benchmark</td>
                  <td className="py-2.5 px-3 text-foreground-muted">2026-03-20</td>
                  <td className="py-2.5 px-3 font-bold text-success">88 / 100</td>
                  <td className="py-2.5 px-3 text-foreground-muted">Good Big-O complexity analysis.</td>
                  <td className="py-2.5 px-3 text-right">
                    <Link href="/teacher/submissions" className="text-primary-600 font-semibold hover:underline">
                      Review Code
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
