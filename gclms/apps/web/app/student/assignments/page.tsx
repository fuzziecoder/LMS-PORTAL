'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { FileText, Clock, ArrowRight, Award } from 'lucide-react';
import { FIXTURE_ASSIGNMENTS } from '@/lib/fixtures/assignments';

export default function StudentAssignmentsPage() {
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'GRADED'>('ALL');

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">My Coursework Assignments</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Submit code projects, review teacher evaluations, and inspect score breakdowns.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {['ALL', 'PENDING', 'GRADED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeTab === tab ? 'bg-primary-600 text-white shadow-card' : 'bg-surface border border-border text-foreground-muted hover:bg-surface-hover'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {FIXTURE_ASSIGNMENTS.map((asg) => (
            <div key={asg.id} className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-elevated transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                    {asg.course_title}
                  </span>
                  <StatusBadge status={asg.submission_status || 'DRAFT'} />
                </div>
                <h3 className="font-bold text-base text-foreground-strong">{asg.title}</h3>
                <p className="text-xs text-foreground-muted max-w-xl leading-relaxed">{asg.instructions}</p>
                <div className="text-[11px] text-foreground-subtle flex items-center gap-4 pt-1">
                  <span className="text-danger-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Due: {new Date(asg.due_at).toLocaleDateString()}
                  </span>
                  <span>Max Marks: <strong>{asg.max_marks}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {asg.student_score !== undefined && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-foreground-subtle block">Score Received</span>
                    <span className="text-base font-bold text-success-700 bg-success-50 px-2.5 py-0.5 rounded-md border border-success-200 inline-block">
                      {asg.student_score} / {asg.max_marks}
                    </span>
                  </div>
                )}
                <a
                  href={`/student/assignments/${asg.id}`}
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-card transition-colors inline-flex items-center gap-1.5"
                >
                  {asg.submission_status === 'GRADED' ? 'View Evaluation' : 'Open Submission'} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
