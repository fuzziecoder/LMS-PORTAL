'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { FileText, Download, Calendar, BarChart2, CheckCircle2, Users } from 'lucide-react';

export default function PrincipalReportsPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    {
      id: 'rep-1',
      title: 'Term 2 Cumulative School Academic Performance Report',
      description: 'Full breakdown of grades, weighted 50/25/25 standings, and distinction rankings for all enrolled students.',
      format: 'PDF / CSV',
      generated: '2026-03-23 09:00 AM',
      size: '2.4 MB',
    },
    {
      id: 'rep-2',
      title: 'Monthly Attendance & Roll Call Compliance Audit',
      description: 'Detailed daily present/absent logs, unexcused absence counters, and parental notification records.',
      format: 'CSV / Excel',
      generated: '2026-03-20 04:30 PM',
      size: '840 KB',
    },
    {
      id: 'rep-3',
      title: 'Faculty Teaching Load & Course Completion Ledger',
      description: 'Instructor-wise active course statistics, assignment grading turnarounds, and student feedback scores.',
      format: 'PDF',
      generated: '2026-03-15 11:00 AM',
      size: '1.1 MB',
    },
    {
      id: 'rep-4',
      title: 'Student Innovation Project & Hackathon Endorsement Registry',
      description: 'Comprehensive registry of all submitted and approved hardware, AI, and full-stack software projects.',
      format: 'PDF',
      generated: '2026-03-10 02:15 PM',
      size: '3.8 MB',
    },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert(`Report generated: ${title}`);
    }, 800);
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">School Analytics & Compliance Reports</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Generate and export official school transcripts, attendance registers, faculty workloads, and board audit documents.
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((r) => (
            <div key={r.id} className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-bold border border-primary-100">
                    {r.format}
                  </span>
                  <span className="text-[11px] text-foreground-subtle">{r.size}</span>
                </div>
                <h3 className="font-bold text-sm text-foreground-strong">{r.title}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{r.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                <span className="text-foreground-subtle text-[11px]">Updated: {r.generated}</span>
                <button
                  onClick={() => handleDownload(r.id, r.title)}
                  disabled={downloading === r.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg text-primary-600 font-semibold hover:bg-surface-hover shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading === r.id ? 'Generating...' : 'Export File'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
