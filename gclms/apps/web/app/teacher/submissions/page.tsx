'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { CheckCircle2, Code2, FileText, Send, Eye, X, Award, ChevronRight } from 'lucide-react';

export default function TeacherSubmissionsPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [submissions, setSubmissions] = useState([
    {
      id: 'sub-1',
      student_name: 'Tharun V.',
      assignment_title: 'Assignment 1: Logic Gates & Arithmetic ALU',
      submitted_at: '2026-03-22 14:30',
      status: 'SUBMITTED',
      code_content: `def bitwise_alu(a: int, b: int, op: str) -> int:
    """Simulates basic ALU operations with bitwise masking."""
    if op == "AND":
        return a & b
    elif op == "OR":
        return a | b
    elif op == "XOR":
        return a ^ b
    elif op == "ADD":
        return (a + b) & 0xFFFFFFFF
    raise ValueError(f"Unsupported ALU operation: {op}")`,
      score: 95,
      feedback: 'Excellent modular structure and proper mask handling for 32-bit overflows.',
      graded: false,
    },
    {
      id: 'sub-2',
      student_name: 'Harini S.',
      assignment_title: 'Assignment 1: Logic Gates & Arithmetic ALU',
      submitted_at: '2026-03-22 16:15',
      status: 'SUBMITTED',
      code_content: `def bitwise_alu(a, b, op):
    match op:
        case "AND": return a & b
        case "OR": return a | b
        case "XOR": return a ^ b
        case "ADD": return a + b`,
      score: 90,
      feedback: 'Great use of Python 3.10 match/case syntax.',
      graded: true,
    },
  ]);

  const [activeSubmission, setActiveSubmission] = useState<typeof submissions[0] | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(95);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');

  const handleOpenGrade = (sub: typeof submissions[0]) => {
    setActiveSubmission(sub);
    setCurrentScore(sub.score);
    setCurrentFeedback(sub.feedback);
  };

  const handleSaveGrade = () => {
    if (!activeSubmission) return;
    setSubmissions(
      submissions.map((s) =>
        s.id === activeSubmission.id
          ? { ...s, score: currentScore, feedback: currentFeedback, graded: true, status: 'GRADED' }
          : s
      )
    );
    alert(`Grade for ${activeSubmission.student_name} submitted successfully!`);
    setActiveSubmission(null);
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">Interactive Assignment Grading Queue</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Review student code submissions side-by-side, assign test scores, and write personalized feedback.
          </p>
        </div>

        {/* Submissions List */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Assignment</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Recorded Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{sub.student_name}</td>
                    <td className="py-3.5 px-4 text-foreground-strong font-medium">{sub.assignment_title}</td>
                    <td className="py-3.5 px-4 text-foreground-subtle">{sub.submitted_at}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.graded ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {sub.graded ? 'GRADED' : 'PENDING REVIEW'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{sub.graded ? `${sub.score} / 100` : '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenGrade(sub)}
                        className="px-3 py-1.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 inline-flex items-center gap-1 text-[11px]"
                      >
                        <Code2 className="w-3.5 h-3.5" /> Grade Submission
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grading Modal */}
        {activeSubmission && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-3xl p-6 space-y-5">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground-strong">
                    Grading: {activeSubmission.student_name}
                  </h3>
                  <div className="text-xs text-foreground-muted">{activeSubmission.assignment_title}</div>
                </div>
                <button onClick={() => setActiveSubmission(null)} className="text-foreground-muted hover:text-foreground-strong">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Code Viewer */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-foreground-muted font-semibold">
                  <span>Student Python Code Submission:</span>
                  <span className="font-mono text-[11px]">Python 3.11</span>
                </div>
                <pre className="p-4 bg-surface-subtle border border-border rounded-xl font-mono text-xs text-foreground-strong overflow-x-auto leading-relaxed">
                  {activeSubmission.code_content}
                </pre>
              </div>

              {/* Grading Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                <div>
                  <label className="font-bold text-foreground-strong block mb-1">Score (Out of 100)</label>
                  <input
                    type="number"
                    value={currentScore}
                    onChange={(e) => setCurrentScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-bold text-foreground-strong block mb-1">Teacher Feedback & Rubric Notes</label>
                  <textarea
                    rows={2}
                    value={currentFeedback}
                    onChange={(e) => setCurrentFeedback(e.target.value)}
                    placeholder="Enter actionable remarks on architecture, code quality, and style..."
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setActiveSubmission(null)}
                  className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                >
                  <CheckCircle2 className="w-4 h-4" /> Finalize & Return Grade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
