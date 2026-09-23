'use client';

import React, { use } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { ArrowLeft, Clock, Award, FileText, CheckCircle2, Eye } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_ASSIGNMENTS } from '@/lib/fixtures/assignments';
import { FIXTURE_USERS } from '@/lib/fixtures/users';

export default function TeacherAssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;

  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const asg = FIXTURE_ASSIGNMENTS.find((a) => a.id === assignmentId) || FIXTURE_ASSIGNMENTS[0];
  const students = FIXTURE_USERS.filter((u) => u.role === 'STUDENT');

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Link href="/teacher/assignments" className="hover:text-primary-600 inline-flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Assignments
          </Link>
          <span>/</span>
          <span className="text-foreground-strong font-semibold">{asg.title}</span>
        </div>

        {/* Header Card */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                  {asg.course_title}
                </span>
                <StatusBadge status={asg.status} />
              </div>
              <h1 className="text-xl font-bold text-foreground-strong mt-2">{asg.title}</h1>
              <p className="text-xs text-foreground-muted mt-1">
                Target: <strong>{asg.target_class}</strong> • Due: <strong>{asg.due_at}</strong> • Max Score: <strong>{asg.max_marks} pts</strong>
              </p>
            </div>

            <Link
              href="/teacher/submissions"
              className="px-4 py-2.5 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 inline-flex items-center gap-2 self-start md:self-auto"
            >
              <FileText className="w-4 h-4" /> Open Grading Queue ({asg.submissions_count - asg.graded_count} Pending)
            </Link>
          </div>

          <div className="p-4 bg-surface-subtle border border-border rounded-lg text-xs text-foreground-muted font-mono leading-relaxed">
            {asg.instructions}
          </div>
        </div>

        {/* Student Submission Ledger */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground-strong">Student Submission Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Submission Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Assigned Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{s.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${idx < 4 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {idx < 4 ? 'SUBMITTED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-foreground-subtle">{idx < 4 ? '2026-03-22 14:10' : '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{idx < 3 ? `${90 + idx * 2} / 100` : 'Ungraded'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href="/teacher/submissions" className="text-primary-600 font-semibold hover:underline">
                        Review Submission
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
