'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { fetchGradebookLedger } from '@/lib/api/teacher';
import { Award, CheckCircle2, Download, Save, Search } from 'lucide-react';

export default function TeacherGradesPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchGradebookLedger()
      .then((data) => setGrades(data))
      .finally(() => setLoading(false));
  }, []);

  const handleOverride = (id: string, field: string, val: number) => {
    setGrades(grades.map((g) => (g.id === id ? { ...g, [field]: val } : g)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Official Class Gradebook Ledger</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Assessment marks evaluated purely from practical assignments and quizzes. Course progress and attendance are tracked separately.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700"
            >
              <Save className="w-4 h-4" /> Save Mark Adjustments
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 bg-success/10 border border-success/20 rounded-xl text-success font-semibold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Gradebook marks saved and updated in academic records.
          </div>
        )}

        {/* Gradebook Table */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          {loading ? (
            <div className="py-8 text-center text-xs text-foreground-muted">Loading class gradebook ledger...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Assignments Average Marks</th>
                    <th className="py-3 px-4">Quizzes Average Marks</th>
                    <th className="py-3 px-4">Calculated Academic Grade</th>
                    <th className="py-3 px-4">Attendance Rate (Context Only)</th>
                    <th className="py-3 px-4 text-right">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {grades.map((g) => {
                    const finalScore = Number(((g.assignmentAvg * 0.6) + (g.quizAvg * 0.4)).toFixed(1));
                    const letter = finalScore >= 90 ? 'A+' : finalScore >= 80 ? 'A' : finalScore >= 70 ? 'B' : 'C';

                    return (
                      <tr key={g.id} className="hover:bg-surface-hover transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-foreground-strong">{g.name}</div>
                          <div className="text-[11px] text-foreground-muted">{g.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            value={g.assignmentAvg}
                            onChange={(e) => handleOverride(g.id, 'assignmentAvg', Number(e.target.value))}
                            className="w-20 px-2.5 py-1 bg-surface-subtle border border-border rounded text-foreground-strong font-semibold"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            value={g.quizAvg}
                            onChange={(e) => handleOverride(g.id, 'quizAvg', Number(e.target.value))}
                            className="w-20 px-2.5 py-1 bg-surface-subtle border border-border rounded text-foreground-strong font-semibold"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-primary-600 text-sm">{finalScore}%</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-foreground-muted">{g.attendanceRate}%</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2.5 py-1 rounded bg-primary-50 text-primary-700 font-bold text-xs border border-primary-100">
                            {letter}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
