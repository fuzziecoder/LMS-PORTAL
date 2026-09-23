'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { CalendarCheck, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function StudentAttendancePage() {
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };

  const recentAttendance = [
    { date: '2026-09-23', class: 'Grade 8 — Section A', period: 'Python Lab (Period 1)', status: 'PRESENT' },
    { date: '2026-09-22', class: 'Grade 8 — Section A', period: 'Robotics Workshop (Period 3)', status: 'PRESENT' },
    { date: '2026-09-21', class: 'Grade 8 — Section A', period: 'AI & Machine Learning (Period 2)', status: 'PRESENT' },
    { date: '2026-09-18', class: 'Grade 8 — Section A', period: 'Python Lab (Period 1)', status: 'LATE' },
    { date: '2026-09-17', class: 'Grade 8 — Section A', period: 'Innovation Project Lab (Period 4)', status: 'PRESENT' },
  ];

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">My Attendance Record</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Class session attendance, punctuality records, and weighted term percentage.
            </p>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <span className="text-xs font-bold text-foreground-muted uppercase">Term Attendance</span>
            <div className="text-3xl font-bold text-success-600 mt-2">96.5%</div>
            <span className="text-xs text-foreground-subtle mt-1 block">Formula: Weighted Present / Total</span>
          </div>
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <span className="text-xs font-bold text-foreground-muted uppercase">Present Sessions</span>
            <div className="text-3xl font-bold text-foreground-strong mt-2">28 Days</div>
            <span className="text-xs text-success-700 font-semibold mt-1 block">1.0 weight each</span>
          </div>
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <span className="text-xs font-bold text-foreground-muted uppercase">Late Sessions</span>
            <div className="text-3xl font-bold text-warning-700 mt-2">1 Day</div>
            <span className="text-xs text-warning-700 font-semibold mt-1 block">0.75 weight</span>
          </div>
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <span className="text-xs font-bold text-foreground-muted uppercase">Unexcused Absences</span>
            <div className="text-3xl font-bold text-foreground-strong mt-2">0 Days</div>
            <span className="text-xs text-success-700 font-semibold mt-1 block">Clean record</span>
          </div>
        </div>

        {/* Daily Attendance History */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground-strong">Recent Session Logs</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Subject / Period</th>
                  <th className="py-3 px-4 text-right">Status Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentAttendance.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-surface-hover">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{rec.date}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{rec.class}</td>
                    <td className="py-3.5 px-4 text-foreground-strong">{rec.period}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${rec.status === 'PRESENT' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-warning-50 text-warning-700 border border-warning-200'}`}>
                        {rec.status === 'PRESENT' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {rec.status}
                      </span>
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
