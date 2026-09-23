'use client';

import React, { use } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, Users, Calendar, BookOpen, CheckCircle2, Award, Mail } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_CLASSES } from '@/lib/fixtures/academic';
import { FIXTURE_USERS } from '@/lib/fixtures/users';

export default function TeacherClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classId = resolvedParams.id;

  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const cls = FIXTURE_CLASSES.find((c) => c.id === classId) || FIXTURE_CLASSES[0];
  const students = FIXTURE_USERS.filter((u) => u.role === 'STUDENT');

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Link href="/teacher/classes" className="hover:text-primary-600 inline-flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Classes
          </Link>
          <span>/</span>
          <span className="text-foreground-strong font-semibold">{cls.name}</span>
        </div>

        {/* Class Header */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-bold border border-primary-100 text-[11px]">
                {cls.grade_level}
              </span>
              <span className="text-xs text-foreground-muted font-medium">Room {cls.room_number}</span>
            </div>
            <h1 className="text-xl font-bold text-foreground-strong mt-1.5">{cls.name}</h1>
            <p className="text-xs text-foreground-muted mt-0.5">
              Faculty Lead: <strong className="text-foreground-strong">{cls.lead_teacher}</strong> • Academic Term 2
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/teacher/attendance"
              className="px-3 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 shadow-sm inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Take Attendance
            </Link>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-600" /> Class Student Roster ({students.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                  <th className="py-3 px-4">Course Progress</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{s.name}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{s.email}</td>
                    <td className="py-3.5 px-4 font-bold text-success">{94 + (idx % 6)}%</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground-strong text-xs">{70 + idx * 5}%</span>
                        <div className="w-20 bg-surface-subtle border border-border rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary-600 h-full rounded-full" style={{ width: `${70 + idx * 5}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/teacher/students/${s.id}`}
                        className="text-primary-600 font-semibold hover:underline"
                      >
                        View Grades & Dossier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
