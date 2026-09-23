import React from 'react';
import AppShell from '@/components/layout/AppShell';
import MetricCard from '@/components/dashboard/MetricCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  School,
  GraduationCap,
  ClipboardList,
  CalendarCheck,
  PlusCircle,
  FileText,
  HelpCircle,
  BookMarked,
  Award,
} from 'lucide-react';

export default function TeacherDashboardPage() {
  const session = getServerSession();

  if (!session || (session.role !== 'TEACHER' && session.role !== 'FOUNDER' && session.role !== 'PRINCIPAL')) {
    redirect('/login');
  }

  const assignedClasses = [
    { id: 'c1', name: 'Grade 8 — Section A', subject: 'Python Programming', students: 32, pendingSubmissions: 3, attendanceTaken: true },
    { id: 'c2', name: 'Grade 8 — Section B', subject: 'Python Programming', students: 30, pendingSubmissions: 2, attendanceTaken: false },
  ];

  const pendingSubmissions = [
    { student: 'Tharun V.', assignment: 'Assignment 3: Python Data Types & Loops', submittedAt: 'Today, 2:15 PM', status: 'SUBMITTED' },
    { student: 'Harini S.', assignment: 'Assignment 3: Python Data Types & Loops', submittedAt: 'Today, 1:40 PM', status: 'SUBMITTED' },
    { student: 'Aravind K.', assignment: 'Assignment 3: Python Data Types & Loops', submittedAt: 'Yesterday', status: 'LATE' },
  ];

  return (
    <AppShell session={session}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground-strong tracking-tight">
              Teacher Workspace — {session.name}
            </h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Assigned classes, pending assignment evaluations, quiz results, and class attendance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href="/teacher/attendance"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
            >
              <CalendarCheck className="w-4 h-4" /> Mark Attendance
            </a>
            <a
              href="/teacher/assignments/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-border text-foreground-strong text-xs font-semibold shadow-card hover:bg-surface-hover transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-violet-600" /> Create Assignment
            </a>
            <a
              href="/teacher/quizzes/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-border text-foreground-strong text-xs font-semibold shadow-card hover:bg-surface-hover transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-cyan-600" /> Create Quiz
            </a>
          </div>
        </div>

        {/* Teacher KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="My Assigned Classes"
            value="2"
            subtitle="Grade 8 (Sec A & B)"
            icon={<School className="w-5 h-5" />}
            accentColor="blue"
          />
          <MetricCard
            title="Assigned Students"
            value="62"
            subtitle="Total active enrolled students"
            icon={<GraduationCap className="w-5 h-5" />}
            accentColor="cyan"
          />
          <MetricCard
            title="Pending Evaluation"
            value="5"
            subtitle="Submissions requiring grading"
            icon={<ClipboardList className="w-5 h-5" />}
            trend={{ value: 'Action Needed', isPositive: false }}
            accentColor="amber"
          />
          <MetricCard
            title="Today's Attendance"
            value="1 / 2"
            subtitle="Classes marked today"
            icon={<CalendarCheck className="w-5 h-5" />}
            accentColor="green"
          />
        </div>

        {/* Assigned Classes Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground-strong">Assigned Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignedClasses.map((cls) => (
              <div key={cls.id} className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 font-bold text-xs">
                      {cls.subject}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls.attendanceTaken ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}`}>
                      {cls.attendanceTaken ? '✓ Attendance Marked' : '⚠️ Attendance Pending'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground-strong">{cls.name}</h3>
                  <p className="text-xs text-foreground-muted mt-1">{cls.students} Enrolled Students</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="font-semibold text-warning-700">{cls.pendingSubmissions} pending submissions</span>
                  <a href={`/teacher/classes/${cls.id}`} className="font-semibold text-primary-600 hover:underline">
                    Manage Class →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Submissions Grading Table */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground-strong">Submissions Awaiting Grading</h2>
              <p className="text-xs text-foreground-muted">Review student submissions and provide grade feedback.</p>
            </div>
            <a href="/teacher/submissions" className="text-xs font-semibold text-primary-600 hover:underline">
              View All Submissions
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Assignment Title</th>
                  <th className="py-3 px-4">Submitted Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingSubmissions.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{sub.student}</td>
                    <td className="py-3.5 px-4 text-foreground-strong">{sub.assignment}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{sub.submittedAt}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a href="/teacher/submissions" className="inline-flex items-center gap-1 px-3 py-1 rounded bg-primary-50 text-primary-700 font-semibold hover:bg-primary-100">
                        <Award className="w-3.5 h-3.5" /> Grade & Feedback
                      </a>
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
