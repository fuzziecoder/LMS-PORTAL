'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Calendar, Download, Search, CheckCircle2, AlertTriangle, Users, Clock } from 'lucide-react';
import { FIXTURE_DAILY_ATTENDANCE } from '@/lib/fixtures/academic';

export default function PrincipalAttendancePage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [date, setDate] = useState('2026-03-23');
  const logs = FIXTURE_DAILY_ATTENDANCE;

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">School Attendance Audit & Roll Call Matrix</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Live daily roll call records across all sections, verified faculty submissions, and absence exceptions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong font-medium shadow-sm focus:outline-none"
            />
            <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface border border-border text-foreground-strong rounded-lg text-xs font-semibold hover:bg-surface-hover shadow-sm">
              <Download className="w-4 h-4 text-foreground-muted" /> Export Daily Log
            </button>
          </div>
        </div>

        {/* Daily KPI summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="text-xs font-semibold text-foreground-muted">Overall Present Rate</div>
            <div className="text-2xl font-bold text-success mt-1">95.8%</div>
            <div className="text-[11px] text-foreground-subtle mt-0.5">92 of 96 students logged</div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="text-xs font-semibold text-foreground-muted">Unexcused Absences</div>
            <div className="text-2xl font-bold text-error mt-1">2</div>
            <div className="text-[11px] text-foreground-muted mt-0.5">Parent SMS sent automatically</div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="text-xs font-semibold text-foreground-muted">Late Arrivals</div>
            <div className="text-2xl font-bold text-warning mt-1">2</div>
            <div className="text-[11px] text-foreground-muted mt-0.5">Logged with gate pass</div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="text-xs font-semibold text-foreground-muted">Sections Completed</div>
            <div className="text-2xl font-bold text-foreground-strong mt-1">4 / 4</div>
            <div className="text-[11px] text-success font-medium mt-0.5">100% faculty submission</div>
          </div>
        </div>

        {/* Section Matrix */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground-strong">Section Breakdown — {date}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Enrolled</th>
                  <th className="py-3 px-4">Present</th>
                  <th className="py-3 px-4">Absent</th>
                  <th className="py-3 px-4">Late</th>
                  <th className="py-3 px-4">Daily Rate</th>
                  <th className="py-3 px-4">Verified By Faculty</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{row.class_name}</td>
                    <td className="py-3.5 px-4 font-semibold text-foreground-muted">{row.total_enrolled}</td>
                    <td className="py-3.5 px-4 font-bold text-success">{row.present}</td>
                    <td className="py-3.5 px-4 font-bold text-error">{row.absent}</td>
                    <td className="py-3.5 px-4 font-bold text-warning">{row.late}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{row.rate_percentage}%</td>
                    <td className="py-3.5 px-4 text-foreground-muted font-medium">{row.marked_by}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-success/10 text-success font-semibold text-[11px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
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
