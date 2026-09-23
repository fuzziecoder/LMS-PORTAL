import React from 'react';
import AppShell from '@/components/layout/AppShell';
import MetricCard from '@/components/dashboard/MetricCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  GraduationCap,
  UserCheck,
  School,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  PlusCircle,
  Megaphone,
  FileBarChart,
  FolderGit2,
} from 'lucide-react';

export default function PrincipalDashboardPage() {
  const session = getServerSession();

  if (!session || (session.role !== 'PRINCIPAL' && session.role !== 'FOUNDER')) {
    redirect('/login');
  }

  const classes = [
    { name: 'Grade 8 — Section A', teacher: 'Rajesh Kumar', students: 32, course: 'Python Programming', completion: '88%', attendance: '96.5%' },
    { name: 'Grade 8 — Section B', teacher: 'Priya Sharma', students: 30, course: 'Python Programming', completion: '84%', attendance: '95.0%' },
    { name: 'Grade 9 — Section A', teacher: 'Dr. Suresh V.', students: 28, course: 'Robotics Fundamentals', completion: '78%', attendance: '94.2%' },
    { name: 'Grade 10 — Section A', teacher: 'Anita Desai', students: 35, course: 'Artificial Intelligence', completion: '82%', attendance: '96.0%' },
  ];

  return (
    <AppShell session={session}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground-strong tracking-tight">
              School Overview — {session.schoolName || 'Chennai Innovation Academy'}
            </h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Academic operations, teacher assignments, class attendance, and student progress metrics.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href="/principal/students"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Student
            </a>
            <a
              href="/principal/announcements"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-foreground-strong text-xs font-semibold shadow-card hover:bg-surface-hover transition-colors"
            >
              <Megaphone className="w-4 h-4 text-violet-600" /> Announcement
            </a>
            <a
              href="/principal/reports"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-foreground-strong text-xs font-semibold shadow-card hover:bg-surface-hover transition-colors"
            >
              <FileBarChart className="w-4 h-4 text-cyan-600" /> School Report
            </a>
          </div>
        </div>

        {/* School KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Students"
            value="380"
            subtitle="Enrolled in school classes"
            icon={<GraduationCap className="w-5 h-5" />}
            trend={{ value: '4 new this month', isPositive: true }}
            accentColor="blue"
          />
          <MetricCard
            title="Teaching Staff"
            value="18"
            subtitle="Assigned STEM teachers"
            icon={<UserCheck className="w-5 h-5" />}
            accentColor="cyan"
          />
          <MetricCard
            title="Active Classes"
            value="12"
            subtitle="Across Grades 6–10"
            icon={<School className="w-5 h-5" />}
            accentColor="violet"
          />
          <MetricCard
            title="School Attendance"
            value="95.4%"
            subtitle="Weighted term attendance"
            icon={<CalendarCheck className="w-5 h-5" />}
            trend={{ value: '0.8%', isPositive: true }}
            accentColor="green"
          />
        </div>

        {/* Class Performance Table */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground-strong">Class & Section Academic Performance</h2>
              <p className="text-xs text-foreground-muted">Live course completion and class attendance tracking.</p>
            </div>
            <a href="/principal/classes" className="text-xs font-semibold text-primary-600 hover:underline">
              View All Classes
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Class Teacher</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Primary Subject</th>
                  <th className="py-3 px-4">Course Completion</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {classes.map((cls, idx) => (
                  <tr key={idx} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{cls.name}</td>
                    <td className="py-3.5 px-4 text-foreground-strong font-medium">{cls.teacher}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{cls.students}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{cls.course}</td>
                    <td className="py-3.5 px-4 font-semibold text-primary-600">{cls.completion}</td>
                    <td className="py-3.5 px-4 font-semibold text-success-600">{cls.attendance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Cards: Student Projects & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground-strong flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-violet-600" /> School Student Projects
              </h2>
              <a href="/principal/projects" className="text-xs font-semibold text-primary-600 hover:underline">
                Review Projects
              </a>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-surface-subtle border border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-foreground-strong">AI Attendance System</h3>
                  <p className="text-[11px] text-foreground-muted">By Tharun V. • Grade 8-A</p>
                </div>
                <StatusBadge status="APPROVED" />
              </div>
              <div className="p-3.5 rounded-lg bg-surface-subtle border border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-foreground-strong">Smart Irrigation Controller</h3>
                  <p className="text-[11px] text-foreground-muted">By Harini S. • Grade 9-A</p>
                </div>
                <StatusBadge status="SUBMITTED" />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground-strong flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary-600" /> Recent School Announcements
              </h2>
              <a href="/principal/announcements" className="text-xs font-semibold text-primary-600 hover:underline">
                Create New
              </a>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg bg-primary-50 border border-primary-100 text-primary-900">
                <p className="font-bold text-primary-900">Annual Science & Robotics Exhibition 2026</p>
                <p className="text-[11px] text-primary-700 mt-1">Submissions open for all Grade 8-10 innovation projects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
