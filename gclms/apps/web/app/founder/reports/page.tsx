'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { FileBarChart, Download, Calendar, Filter, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function FounderReportsPage() {
  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };
  const [downloading, setDownloading] = useState<string | null>(null);

  const reportCategories = [
    { id: 'rep-1', title: 'Platform Executive Overview', description: 'Cross-school enrollments, average attendance, and course completion metrics.', format: 'CSV / PDF' },
    { id: 'rep-2', title: 'Institutional Attendance Ledger', description: 'Daily weighted attendance records across Chennai, Bengaluru, Hyderabad, Kochi, Pune.', format: 'CSV' },
    { id: 'rep-3', title: 'Student Academic Performance & Grades', description: 'Assignment mark distributions, quiz attempts, and pass percentage analytics.', format: 'CSV' },
    { id: 'rep-4', title: 'Student Innovation Capstone Participation', description: 'STEM, Robotics, and AI project submissions and approval tallies by school.', format: 'CSV' },
  ];

  const exportHistory = [
    { report: 'Platform_Overview_AY2026_Q1.csv', requestedBy: 'Dr. Vikram Sarabhai', date: '2026-09-20 10:15 AM', size: '240 KB', status: 'COMPLETED' },
    { report: 'School_Attendance_September_2026.csv', requestedBy: 'Dr. Vikram Sarabhai', date: '2026-09-22 03:40 PM', size: '185 KB', status: 'COMPLETED' },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloading(id);
    setTimeout(() => {
      // Create simulated CSV download file for dev mode
      const csvContent = "data:text/csv;charset=utf-8,School,Students,Teachers,Attendance,Completion\nChennai Innovation Academy,380,18,95.4%,82%\nBengaluru STEM School,410,20,94.1%,79.5%\nHyderabad Future School,290,14,93.8%,76%\nKochi Robotics Academy,210,10,96.2%,84%\nPune Digital Learning School,160,8,91.5%,72%";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${title.replace(/\s+/g, '_')}_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(null);
    }, 600);
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Platform Analytics & Report Generator</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Export verified institutional metrics, attendance registers, and academic progress reports.
            </p>
          </div>
        </div>

        {/* Available Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reportCategories.map((rep) => (
            <div key={rep.id} className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                    <FileBarChart className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-subtle border border-border text-foreground-muted">
                    {rep.format}
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground-strong">{rep.title}</h3>
                <p className="text-xs text-foreground-muted mt-1.5 leading-relaxed">{rep.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-foreground-subtle">AY 2026–2027 Dataset</span>
                <button
                  onClick={() => handleDownload(rep.id, rep.title)}
                  disabled={downloading === rep.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-xs font-semibold shadow-card transition-all disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading === rep.id ? 'Generating...' : 'Export CSV'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Export History Ledger */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6">
          <h2 className="text-base font-bold text-foreground-strong mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-success-600" /> Recent Generated Export Files
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Report File Name</th>
                  <th className="py-3 px-4">Requested By</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {exportHistory.map((exp, idx) => (
                  <tr key={idx} className="hover:bg-surface-hover">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{exp.report}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{exp.requestedBy}</td>
                    <td className="py-3.5 px-4 text-foreground-subtle">{exp.date}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{exp.size}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-success-50 text-success-700 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Ready
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
