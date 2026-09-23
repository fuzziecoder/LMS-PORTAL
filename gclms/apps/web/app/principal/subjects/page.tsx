'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { BookOpen, PlusCircle, Search, Clock, Users, CheckCircle2 } from 'lucide-react';
import { FIXTURE_SUBJECTS } from '@/lib/fixtures/academic';

export default function PrincipalSubjectsPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [search, setSearch] = useState('');
  const [subjects, setSubjects] = useState(FIXTURE_SUBJECTS);

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Curriculum Subjects & Disciplines</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Curate academic subjects, manage department head allocations, and define standard weekly credit hours.
            </p>
          </div>
          <button
            onClick={() => alert('Add Subject builder triggered.')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Add Academic Subject
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
              placeholder="Search by subject code, title, or department..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Faculty Lead</th>
                  <th className="py-3 px-4">Credit / Wk</th>
                  <th className="py-3 px-4">Enrolled</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary-600">{s.code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground-strong">{s.name}</div>
                      <div className="text-[11px] text-foreground-muted">Levels: {s.grade_levels.join(', ')}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground-strong">{s.department}</td>
                    <td className="py-3.5 px-4 text-foreground-strong font-semibold">{s.head_faculty}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{s.weekly_hours} hrs / week</td>
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{s.enrolled_students} students</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-primary-600 font-semibold hover:underline">Edit Syllabus</button>
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
