'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Search, PlusCircle, UserCheck, BookOpen, Clock, Mail, Award, X } from 'lucide-react';
import { FIXTURE_USERS } from '@/lib/fixtures/users';

export default function PrincipalTeachersPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ name: '', email: '', subject: 'Computer Science & AI' });

  const teachers = FIXTURE_USERS.filter((u) => u.role === 'TEACHER').map((t, idx) => ({
    ...t,
    department: idx === 0 ? 'Computer Science' : idx === 1 ? 'Artificial Intelligence' : 'Robotics & Hardware',
    active_courses: idx === 0 ? 3 : 2,
    active_students: idx === 0 ? 54 : 42,
    avg_student_rating: (4.7 + idx * 0.1).toFixed(1),
    weekly_hours: 18 + idx * 2,
  }));

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Teaching Faculty & Instructors</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Oversee faculty assignments, course workload, subject department leads, and teaching performance.
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Appoint Faculty Member
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="text-xs font-semibold text-foreground-muted">Total Teaching Staff</div>
            <div className="text-2xl font-bold text-foreground-strong mt-1">{teachers.length}</div>
            <div className="text-[11px] text-success font-medium mt-0.5">100% STEM Certified</div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="text-xs font-semibold text-foreground-muted">Student to Teacher Ratio</div>
            <div className="text-2xl font-bold text-foreground-strong mt-1">16:1</div>
            <div className="text-[11px] text-primary-600 font-medium mt-0.5">Optimal Learning Threshold</div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="text-xs font-semibold text-foreground-muted">Average Faculty Rating</div>
            <div className="text-2xl font-bold text-foreground-strong mt-1">4.8 / 5.0</div>
            <div className="text-[11px] text-success font-medium mt-0.5">Based on Student Term Feedback</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name, department, or email..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {filtered.map((t) => (
              <div key={t.id} className="bg-surface-subtle border border-border rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm border border-primary-200">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-foreground-strong">{t.name}</div>
                      <div className="text-[11px] text-primary-600 font-medium">{t.department}</div>
                    </div>
                  </div>
                  <StatusBadge status={t.status} />
                </div>

                <div className="text-xs text-foreground-muted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-foreground-subtle" />
                  <span className="truncate">{t.email}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-surface rounded-lg border border-border">
                  <div>
                    <div className="text-[10px] text-foreground-muted font-medium">Courses</div>
                    <div className="font-bold text-foreground-strong mt-0.5">{t.active_courses}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-foreground-muted font-medium">Students</div>
                    <div className="font-bold text-foreground-strong mt-0.5">{t.active_students}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-foreground-muted font-medium">Hours/Wk</div>
                    <div className="font-bold text-foreground-strong mt-0.5">{t.weekly_hours}h</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-foreground-subtle">Active in School: CIA</span>
                  <button className="text-primary-600 font-semibold hover:underline">Manage Workload</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Invite Faculty */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-foreground-strong">Appoint New Faculty</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-foreground-muted hover:text-foreground-strong">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    placeholder="e.g. Dr. K. Sundar"
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Institutional Email</label>
                  <input
                    type="email"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    placeholder="e.g. teacher.sundar@gclms.local"
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Department Specialization</label>
                  <select
                    value={newFaculty.subject}
                    onChange={(e) => setNewFaculty({ ...newFaculty, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  >
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Robotics & Microcontrollers">Robotics & Microcontrollers</option>
                    <option value="Web & Cloud Technologies">Web & Cloud Technologies</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Invitation sent to ${newFaculty.email || 'faculty'}!`);
                    setShowInviteModal(false);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                >
                  Send Faculty Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
