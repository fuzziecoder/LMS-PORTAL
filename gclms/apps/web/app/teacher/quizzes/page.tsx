'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { PlusCircle, HelpCircle, Clock, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_QUIZZES } from '@/lib/fixtures/quizzes';

export default function TeacherQuizzesPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const quizzes = FIXTURE_QUIZZES;

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Online Quizzes & Assessments</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Author timed multi-choice and coding quizzes, establish question banks, and review cohort completion statistics.
            </p>
          </div>
          <Link
            href="/teacher/quizzes/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Create New Quiz
          </Link>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((q) => (
            <div key={q.id} className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                    {q.course_title}
                  </span>
                  <StatusBadge status={q.status} />
                </div>
                <h3 className="font-bold text-base text-foreground-strong">{q.title}</h3>

                <div className="grid grid-cols-3 gap-2 bg-surface-subtle border border-border rounded-lg p-3 text-xs text-center">
                  <div>
                    <div className="text-[11px] text-foreground-muted">Questions</div>
                    <div className="font-bold text-foreground-strong mt-0.5">{q.questions_count} Qs</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-foreground-muted">Duration</div>
                    <div className="font-bold text-foreground-strong mt-0.5">{q.duration_minutes} Mins</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-foreground-muted">Pass Mark</div>
                    <div className="font-bold text-foreground-strong mt-0.5">{q.pass_percentage}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-foreground-muted pt-1">
                  <span>Attempts: <strong className="text-foreground-strong">{q.attempts_count}</strong></span>
                  <span>Cohort Average: <strong className="text-success">{q.average_score ? `${q.average_score}%` : 'N/A'}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                <span className="text-foreground-subtle text-[11px]">Max Allowed Attempts: {q.max_attempts}</span>
                <button className="text-primary-600 font-semibold hover:underline">Edit Questions</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
