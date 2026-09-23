'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Award, TrendingUp, CheckCircle, HelpCircle, FileText } from 'lucide-react';

export default function StudentGradesPage() {
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };

  const gradeRecords = [
    { title: 'Assignment 3: Python Data Types, Lists & Loops', course: 'Python Programming', type: 'ASSIGNMENT', score: '95 / 100', percentage: '95%', feedback: 'Excellent code readability and efficient loop iteration!', teacher: 'Rajesh Kumar', date: '2026-09-20' },
    { title: 'Quiz 1: Python Syntax & Operators', course: 'Python Programming', type: 'QUIZ', score: '18 / 20', percentage: '90%', feedback: 'Solid grasp of operators.', teacher: 'Rajesh Kumar', date: '2026-09-18' },
    { title: 'Assignment 1: Introduction to Machine Learning', course: 'Artificial Intelligence', type: 'ASSIGNMENT', score: '44 / 50', percentage: '88%', feedback: 'Good data preprocessing pipeline.', teacher: 'Anita Desai', date: '2026-09-15' },
    { title: 'Quiz 1: Microcontroller Pinouts & PWM', course: 'Robotics & Hardware', type: 'QUIZ', score: '17 / 20', percentage: '85%', feedback: 'Accurate pin assignment.', teacher: 'Dr. Suresh V.', date: '2026-09-12' },
  ];

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">My Academic Gradebook & Feedback</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Official scores for coursework assignments, practical exams, and quiz assessments.
            </p>
          </div>
        </div>

        {/* Overall GPA / Score Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <span className="text-xs font-bold text-foreground-muted uppercase">Cumulative Grade Average</span>
            <div className="text-3xl font-bold text-primary-600 mt-2">89.5%</div>
            <span className="text-xs text-success-700 font-semibold mt-1 block">Grade: A (Distinction)</span>
          </div>
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <span className="text-xs font-bold text-foreground-muted uppercase">Evaluated Assignments</span>
            <div className="text-3xl font-bold text-foreground-strong mt-2">2 Completed</div>
            <span className="text-xs text-foreground-subtle mt-1 block">Average: 91.5%</span>
          </div>
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <span className="text-xs font-bold text-foreground-muted uppercase">Quiz Assessments</span>
            <div className="text-3xl font-bold text-foreground-strong mt-2">2 Attempted</div>
            <span className="text-xs text-foreground-subtle mt-1 block">Average: 87.5%</span>
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground-strong">Evaluation Ledger</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Assessment Title</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Teacher Feedback</th>
                  <th className="py-3 px-4 text-right">Evaluator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {gradeRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-surface-hover">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{rec.title}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{rec.course}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-subtle border border-border">
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-success-700">{rec.score} ({rec.percentage})</td>
                    <td className="py-3.5 px-4 text-foreground-muted italic max-w-xs truncate">{rec.feedback}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-foreground-strong">{rec.teacher}</td>
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
