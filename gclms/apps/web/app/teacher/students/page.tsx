'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Search, Eye, Mail, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_USERS } from '@/lib/fixtures/users';

export default function TeacherStudentsPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [search, setSearch] = useState('');
  const students = FIXTURE_USERS.filter((u) => u.role === 'STUDENT').map((s, idx) => ({
    ...s,
    class_name: idx % 2 === 0 ? 'Grade 10 - Section A' : 'Grade 11 - AI Specialized',
    attendance: 94 + (idx % 6),
    assignments_done: `${4 + (idx % 2)} / 5`,
    quiz_avg: 82 + (idx % 12),
  }));

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">My Assigned Students</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Track student coursework progress, assignment submission statuses, and performance in your STEM subjects.
          </p>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student by name or email..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Assignments Done</th>
                  <th className="py-3 px-4">Quiz Avg</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground-strong">{s.name}</div>
                      <div className="text-[11px] text-foreground-muted">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground-strong">{s.class_name}</td>
                    <td className="py-3.5 px-4 font-bold text-success">{s.attendance}%</td>
                    <td className="py-3.5 px-4 font-semibold text-foreground-strong">{s.assignments_done}</td>
                    <td className="py-3.5 px-4 font-bold text-primary-600">{s.quiz_avg}%</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/teacher/students/${s.id}`}
                        className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" /> Student Dossier
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
