'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { TrendingUp, Award, BookOpen, CheckCircle2, Calendar, FileText, HelpCircle, BarChart3 } from 'lucide-react';

export default function StudentProgressPage() {
  const session = {
    id: 'user-s1',
    name: 'Tharun V.',
    email: 'student.tharun.chennai@gclms.local',
    role: 'STUDENT' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const formulaData = {
    overallPercentage: 88.5,
    assignmentScore: 92.0, // 50%
    quizScore: 84.0, // 25%
    attendanceScore: 96.0, // 25%
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">My Academic Standing & Progress</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Real-time weighted score breakdown according to the official GCLMS 50% Assignments + 25% Quizzes + 25% Attendance standard.
          </p>
        </div>

        {/* Overall Score Banner */}
        <div className="bg-surface rounded-2xl border border-border shadow-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-success/10 text-success font-bold text-xs">
              TIER 1 DISTINCTION
            </span>
            <h2 className="text-xl font-bold text-foreground-strong">Cumulative Weighted Mastery</h2>
            <p className="text-xs text-foreground-muted max-w-lg leading-relaxed">
              Your overall score is calculated from continuous practical code submissions, timed conceptual quizzes, and laboratory roll call.
            </p>
          </div>

          <div className="text-right flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white flex flex-col items-center justify-center shadow-card">
              <span className="text-2xl font-black">{formulaData.overallPercentage}%</span>
              <span className="text-[10px] font-semibold text-primary-100 uppercase">Grade: A+</span>
            </div>
          </div>
        </div>

        {/* Formula Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Assignments (50%) */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                50% WEIGHTAGE
              </span>
              <FileText className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground-strong">{formulaData.assignmentScore}%</div>
              <h3 className="text-xs font-bold text-foreground-strong mt-0.5">Assignments & Practical Code</h3>
              <p className="text-[11px] text-foreground-muted mt-1">4 of 5 coding assignments completed and graded.</p>
            </div>
            <div className="w-full bg-surface-subtle border border-border rounded-full h-2 overflow-hidden">
              <div className="bg-primary-600 h-full rounded-full" style={{ width: `${formulaData.assignmentScore}%` }} />
            </div>
          </div>

          {/* Pillar 2: Quizzes (25%) */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                25% WEIGHTAGE
              </span>
              <HelpCircle className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground-strong">{formulaData.quizScore}%</div>
              <h3 className="text-xs font-bold text-foreground-strong mt-0.5">Knowledge Quizzes & MCQs</h3>
              <p className="text-[11px] text-foreground-muted mt-1">2 of 2 scheduled term quizzes passed.</p>
            </div>
            <div className="w-full bg-surface-subtle border border-border rounded-full h-2 overflow-hidden">
              <div className="bg-primary-600 h-full rounded-full" style={{ width: `${formulaData.quizScore}%` }} />
            </div>
          </div>

          {/* Pillar 3: Attendance (25%) */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                25% WEIGHTAGE
              </span>
              <Calendar className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground-strong">{formulaData.attendanceScore}%</div>
              <h3 className="text-xs font-bold text-foreground-strong mt-0.5">Roll Call & Lab Attendance</h3>
              <p className="text-[11px] text-foreground-muted mt-1">48 of 50 school sessions attended.</p>
            </div>
            <div className="w-full bg-surface-subtle border border-border rounded-full h-2 overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: `${formulaData.attendanceScore}%` }} />
            </div>
          </div>
        </div>

        {/* Course-by-Course Breakdown */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground-strong">Enrolled Course Mastery</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Subject & Course</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Assignments Avg</th>
                  <th className="py-3 px-4">Quiz Score</th>
                  <th className="py-3 px-4">Course Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-surface-hover transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground-strong">Introduction to Python & Computational Thinking</td>
                  <td className="py-3.5 px-4 text-foreground-muted">Rajesh Kumar</td>
                  <td className="py-3.5 px-4 font-bold text-success">92.5%</td>
                  <td className="py-3.5 px-4 font-bold text-success">87.5%</td>
                  <td className="py-3.5 px-4 font-bold text-primary-600">A+ (92.0%)</td>
                </tr>
                <tr className="hover:bg-surface-hover transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground-strong">Applied Artificial Intelligence & Machine Learning</td>
                  <td className="py-3.5 px-4 text-foreground-muted">Anita Desai</td>
                  <td className="py-3.5 px-4 font-bold text-success">88.0%</td>
                  <td className="py-3.5 px-4 font-bold text-success">85.0%</td>
                  <td className="py-3.5 px-4 font-bold text-primary-600">A (87.5%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
