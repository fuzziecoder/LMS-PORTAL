'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { PlusCircle, FileText, CheckCircle2, Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_ASSIGNMENTS } from '@/lib/fixtures/assignments';

export default function TeacherAssignmentsPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const assignments = FIXTURE_ASSIGNMENTS;

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Assignment Ledger & Management</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Create homework assignments, set automatic late submission policies, view rosters, and jump to grading queues.
            </p>
          </div>
          <Link
            href="/teacher/assignments/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Create New Assignment
          </Link>
        </div>

        {/* Assignments Table */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Title & Course</th>
                  <th className="py-3 px-4">Target Class</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Max Marks</th>
                  <th className="py-3 px-4">Submissions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assignments.map((asg) => (
                  <tr key={asg.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground-strong">{asg.title}</div>
                      <div className="text-[11px] text-primary-600">{asg.course_title}</div>
                    </td>
                    <td className="py-3.5 px-4 text-foreground-muted font-medium">{asg.target_class}</td>
                    <td className="py-3.5 px-4 text-foreground-strong font-medium">{asg.due_at}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{asg.max_marks} pts</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground-strong">
                        {asg.submissions_count} submitted ({asg.graded_count} graded)
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={asg.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/teacher/assignments/${asg.id}`}
                        className="text-foreground-muted hover:text-foreground-strong font-medium"
                      >
                        Overview
                      </Link>
                      <Link
                        href="/teacher/submissions"
                        className="text-primary-600 font-semibold hover:underline"
                      >
                        Grade Queue
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
