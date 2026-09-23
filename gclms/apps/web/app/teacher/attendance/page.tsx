'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { CheckCircle2, UserCheck, Calendar, Clock, Save, ArrowRight } from 'lucide-react';
import { FIXTURE_USERS } from '@/lib/fixtures/users';

export default function TeacherAttendancePage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [date, setDate] = useState('2026-03-23');
  const [selectedClass, setSelectedClass] = useState('Grade 10 - Section A');
  const [records, setRecords] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>>({
    'user-s1': 'PRESENT',
    'user-s2': 'PRESENT',
    'user-s3': 'PRESENT',
    'user-s4': 'PRESENT',
    'user-s5': 'LATE',
    'user-s6': 'ABSENT',
  });
  const [saved, setSaved] = useState(false);

  const students = FIXTURE_USERS.filter((u) => u.role === 'STUDENT');

  const setStatus = (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setRecords((prev) => ({ ...prev, [id]: status }));
  };

  const markAllPresent = () => {
    const updated: Record<string, 'PRESENT'> = {};
    students.forEach((s) => {
      updated[s.id] = 'PRESENT';
    });
    setRecords(updated);
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
            <h1 className="text-2xl font-bold text-foreground-strong">Class Roll Call & Daily Attendance</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Mark individual student statuses (Present, Absent, Late, Excused) and automatically synchronize with school records.
            </p>
          </div>
          <button
            onClick={markAllPresent}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-700 font-bold border border-primary-200 rounded-lg text-xs hover:bg-primary-100 transition-colors self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark All Present
          </button>
        </div>

        {saved && (
          <div className="p-3.5 bg-success/10 border border-success/20 rounded-xl text-success font-semibold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Attendance roll call verified and logged successfully for {selectedClass}.
          </div>
        )}

        {/* Controls Strip */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="font-semibold text-foreground-muted block mb-1">Class Cohort</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-foreground-strong font-medium"
              >
                <option value="Grade 10 - Section A">Grade 10 - Section A (28 Students)</option>
                <option value="Grade 11 - AI Specialized">Grade 11 - AI Specialized (22 Students)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-foreground-muted block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-foreground-strong font-medium"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 shadow-card self-end sm:self-auto"
          >
            <Save className="w-4 h-4" /> Finalize Roll Call
          </button>
        </div>

        {/* Attendance Roster Table */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Institutional Email</th>
                  <th className="py-3 px-4 text-center">Present (P)</th>
                  <th className="py-3 px-4 text-center">Absent (A)</th>
                  <th className="py-3 px-4 text-center">Late (L)</th>
                  <th className="py-3 px-4 text-center">Excused (E)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => {
                  const currentStatus = records[s.id] || 'PRESENT';
                  return (
                    <tr key={s.id} className="hover:bg-surface-hover transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground-strong">{s.name}</td>
                      <td className="py-3.5 px-4 text-foreground-muted">{s.email}</td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setStatus(s.id, 'PRESENT')}
                          className={`px-3 py-1 rounded font-bold transition-all ${
                            currentStatus === 'PRESENT'
                              ? 'bg-success text-white shadow-sm'
                              : 'bg-surface-subtle text-foreground-muted hover:bg-surface-hover'
                          }`}
                        >
                          P
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setStatus(s.id, 'ABSENT')}
                          className={`px-3 py-1 rounded font-bold transition-all ${
                            currentStatus === 'ABSENT'
                              ? 'bg-error text-white shadow-sm'
                              : 'bg-surface-subtle text-foreground-muted hover:bg-surface-hover'
                          }`}
                        >
                          A
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setStatus(s.id, 'LATE')}
                          className={`px-3 py-1 rounded font-bold transition-all ${
                            currentStatus === 'LATE'
                              ? 'bg-warning text-white shadow-sm'
                              : 'bg-surface-subtle text-foreground-muted hover:bg-surface-hover'
                          }`}
                        >
                          L
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setStatus(s.id, 'EXCUSED')}
                          className={`px-3 py-1 rounded font-bold transition-all ${
                            currentStatus === 'EXCUSED'
                              ? 'bg-primary-600 text-white shadow-sm'
                              : 'bg-surface-subtle text-foreground-muted hover:bg-surface-hover'
                          }`}
                        >
                          E
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
