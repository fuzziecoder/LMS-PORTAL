'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { fetchCohortProgress } from '@/lib/api/principal';
import { BarChart3, BookOpen, CheckCircle2, FileText, HelpCircle, Layers, TrendingUp } from 'lucide-react';

export default function PrincipalProgressPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [loading, setLoading] = useState(true);
  const [cohorts, setCohorts] = useState<any[]>([]);

  useEffect(() => {
    fetchCohortProgress()
      .then((data) => setCohorts(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">School Learning Progress Analytics</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Institutional compliance with the official GCLMS Course Progress Formula: 50% lesson completion + 25% assignment completion + 25% quiz completion.
          </p>
        </div>

        {/* Formula Explainer Card */}
        <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-5">
          <div className="flex items-center gap-2 font-bold text-primary-900 text-sm">
            <BarChart3 className="w-4 h-4 text-primary-700" /> Official GCLMS Course Progress Formula
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs">
            <div className="bg-surface rounded-lg p-3 border border-primary-200 shadow-sm">
              <div className="font-bold text-primary-700">50% Weightage</div>
              <div className="text-foreground-strong font-semibold mt-0.5">Lesson Completion</div>
              <div className="text-[11px] text-foreground-muted mt-0.5">
                Completed published lessons / total published lessons × 100
              </div>
            </div>
            <div className="bg-surface rounded-lg p-3 border border-primary-200 shadow-sm">
              <div className="font-bold text-primary-700">25% Weightage</div>
              <div className="text-foreground-strong font-semibold mt-0.5">Assignment Completion</div>
              <div className="text-[11px] text-foreground-muted mt-0.5">
                Submitted required assignments / total required assignments × 100
              </div>
            </div>
            <div className="bg-surface rounded-lg p-3 border border-primary-200 shadow-sm">
              <div className="font-bold text-primary-700">25% Weightage</div>
              <div className="text-foreground-strong font-semibold mt-0.5">Quiz Completion</div>
              <div className="text-[11px] text-foreground-muted mt-0.5">
                Completed required quizzes / total required quizzes × 100
              </div>
            </div>
          </div>
        </div>

        {/* Cohort Breakdown Table */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground-strong">Cohort Learning Progress Breakdown</h2>

          {loading ? (
            <div className="py-8 text-center text-xs text-foreground-muted">Loading cohort progress analytics...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Cohort / Class</th>
                    <th className="py-3 px-4">Lessons Completion (50%)</th>
                    <th className="py-3 px-4">Assignments (25%)</th>
                    <th className="py-3 px-4">Quizzes (25%)</th>
                    <th className="py-3 px-4">Overall Course Progress</th>
                    <th className="py-3 px-4 text-right">Attendance Rate (Separate)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cohorts.map((c) => (
                    <tr key={c.class_id} className="hover:bg-surface-hover transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground-strong">{c.class_name}</div>
                        <div className="text-[11px] text-foreground-muted">{c.enrolled_count} Students</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground-strong">{c.avg_lesson_completion}%</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground-strong">{c.avg_assignment_completion}%</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground-strong">{c.avg_quiz_completion}%</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary-600 text-sm">{c.avg_course_progress}%</span>
                          <div className="w-16 bg-surface-subtle border border-border rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary-600 h-full rounded-full" style={{ width: `${c.avg_course_progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-success">{c.avg_attendance_rate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
