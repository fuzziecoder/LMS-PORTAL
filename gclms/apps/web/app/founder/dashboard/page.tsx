import React from 'react';
import AppShell from '@/components/layout/AppShell';
import MetricCard from '@/components/dashboard/MetricCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Building2,
  GraduationCap,
  UserCheck,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  FolderGit2,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export default function FounderDashboardPage() {
  const session = getServerSession();

  if (!session || session.role !== 'FOUNDER') {
    redirect('/login');
  }

  const schools = [
    { id: '1', name: 'Chennai Innovation Academy', students: 380, teachers: 18, courses: 8, completion: '82%', attendance: '95.4%', status: 'ACTIVE' },
    { id: '2', name: 'Bengaluru STEM School', students: 410, teachers: 20, courses: 9, completion: '79%', attendance: '94.1%', status: 'ACTIVE' },
    { id: '3', name: 'Hyderabad Future School', students: 290, teachers: 14, courses: 7, completion: '76%', attendance: '93.8%', status: 'ACTIVE' },
    { id: '4', name: 'Kochi Robotics Academy', students: 210, teachers: 10, courses: 6, completion: '84%', attendance: '96.2%', status: 'ACTIVE' },
    { id: '5', name: 'Pune Digital Learning School', students: 160, teachers: 8, courses: 5, completion: '72%', attendance: '91.5%', status: 'ACTIVE' },
  ];

  const recentProjects = [
    { title: 'AI Attendance System using OpenCV', student: 'Kavya R.', school: 'Chennai Innovation Academy', tech: 'Python, OpenCV, PyTorch', status: 'APPROVED' },
    { title: 'Autonomous Obstacle Avoiding Rover', student: 'Aditya M.', school: 'Kochi Robotics Academy', tech: 'Arduino, C++, Electronics', status: 'APPROVED' },
    { title: 'IoT Greenhouse Monitoring Unit', student: 'Siddharth P.', school: 'Bengaluru STEM School', tech: 'ESP32, Python, MQTT', status: 'SUBMITTED' },
  ];

  return (
    <AppShell session={session}>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground-strong tracking-tight">
              Platform Executive Overview
            </h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Cross-school performance metrics, institutional analytics, and system audit logs.
            </p>
          </div>

          {/* Global Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-foreground-muted shadow-card">
              <Filter className="w-3.5 h-3.5" /> All 5 Schools
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold shadow-card">
              Academic Year 2026–27
            </div>
          </div>
        </div>

        {/* Top KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Schools"
            value="5"
            subtitle="All active multi-tenant institutions"
            icon={<Building2 className="w-5 h-5" />}
            trend={{ value: '100% active', isPositive: true }}
            accentColor="violet"
          />
          <MetricCard
            title="Active Students"
            value="1,450"
            subtitle="Enrolled across all 5 schools"
            icon={<GraduationCap className="w-5 h-5" />}
            trend={{ value: '12% this term', isPositive: true }}
            accentColor="blue"
          />
          <MetricCard
            title="Teaching Staff"
            value="70"
            subtitle="Assigned STEM & Coding educators"
            icon={<UserCheck className="w-5 h-5" />}
            accentColor="cyan"
          />
          <MetricCard
            title="Overall Attendance"
            value="94.2%"
            subtitle="Platform-wide weighted attendance"
            icon={<CalendarCheck className="w-5 h-5" />}
            trend={{ value: '1.4%', isPositive: true }}
            accentColor="green"
          />
        </div>

        {/* Schools Overview Table / Cards */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground-strong">Participating Schools</h2>
              <p className="text-xs text-foreground-muted">Multi-tenant school metrics and course progress rates.</p>
            </div>
            <a href="/founder/schools" className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1">
              Manage Schools <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">School Name</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Teachers</th>
                  <th className="py-3 px-4">Active Courses</th>
                  <th className="py-3 px-4">Avg Completion</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">
                        {school.name[0]}
                      </div>
                      {school.name}
                    </td>
                    <td className="py-3.5 px-4 text-foreground-strong font-medium">{school.students}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{school.teachers}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{school.courses}</td>
                    <td className="py-3.5 px-4 font-semibold text-primary-600">{school.completion}</td>
                    <td className="py-3.5 px-4 font-semibold text-success-600">{school.attendance}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={school.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Split Section: Recent Student Projects & System Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Student Projects (2 cols) */}
          <div className="lg:col-span-2 bg-surface rounded-xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-violet-600" />
                <h2 className="text-base font-bold text-foreground-strong">Cross-School Student Project Showcase</h2>
              </div>
              <a href="/founder/projects" className="text-xs font-semibold text-primary-600 hover:underline">
                View All Projects
              </a>
            </div>

            <div className="space-y-3">
              {recentProjects.map((project, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-surface-subtle border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-foreground-strong">{project.title}</h3>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      By <span className="font-semibold text-foreground-strong">{project.student}</span> • {project.school}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-foreground-subtle">
                      {project.tech}
                    </span>
                  </div>
                  <div>
                    <StatusBadge status={project.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System & Audit Alerts (1 col) */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-warning-600" />
                <h2 className="text-base font-bold text-foreground-strong">Security & Audit Status</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-success-50 border border-success-100 text-success-700 font-medium">
                  ✅ Multi-tenant data isolation verified across all 5 school databases.
                </div>
                <div className="p-3 rounded-lg bg-surface-subtle border border-border text-foreground-muted">
                  🔒 Argon2id password hashing active for all user sessions.
                </div>
                <div className="p-3 rounded-lg bg-surface-subtle border border-border text-foreground-muted">
                  📁 Presigned file uploads enforced for MinIO object storage.
                </div>
              </div>
            </div>

            <a
              href="/founder/audit-logs"
              className="mt-6 text-xs font-semibold text-primary-600 hover:underline block text-center pt-4 border-t border-border"
            >
              Inspect Audit Logs
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
