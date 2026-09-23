'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { User, Mail, Shield, Key, Bell, CheckCircle2, Save } from 'lucide-react';

export default function StudentProfilePage() {
  const session = {
    id: 'user-s1',
    name: 'Tharun V.',
    email: 'student.tharun.chennai@gclms.local',
    role: 'STUDENT' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Tharun V.',
    email: 'student.tharun.chennai@gclms.local',
    rollNo: 'CIA-2026-104',
    gradeClass: 'Grade 10 - Section A',
    bio: 'Passionate about embedded systems, robotics, and Python full-stack software development.',
    notifyEmail: true,
    notifyGrades: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">My Student Profile & Account</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Manage your student credentials, bio, contact details, and notification preferences.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 bg-success/10 border border-success/20 rounded-xl text-success font-semibold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Profile changes successfully updated.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity Card */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-5">
            <div className="flex items-center gap-4 border-b border-border pb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-card">
                T
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground-strong">{profile.name}</h2>
                  <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-bold border border-primary-100 text-[10px]">
                    STUDENT
                  </span>
                </div>
                <div className="text-xs text-foreground-muted mt-0.5">
                  Roll ID: <span className="font-mono font-bold text-primary-600">{profile.rollNo}</span> • {session.schoolName}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Institutional Email</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle/50 border border-border text-foreground-subtle cursor-not-allowed font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Assigned Class & Section</label>
                <input
                  type="text"
                  disabled
                  value={profile.gradeClass}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle/50 border border-border text-foreground-subtle cursor-not-allowed"
                />
              </div>
              <div>
                <label className="font-bold text-foreground-strong block mb-1">Academic Standing</label>
                <div className="px-3 py-2 rounded-lg bg-surface-subtle border border-border font-bold text-success">
                  Distinction (Cumulative GPA: 3.88)
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="font-bold text-foreground-strong block mb-1">Student Biography & Research Interests</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-3 text-xs">
            <h3 className="font-bold text-foreground-strong flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary-600" /> Notification Preferences
            </h3>
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={profile.notifyEmail}
                onChange={(e) => setProfile({ ...profile, notifyEmail: e.target.checked })}
                className="rounded border-border text-primary-600"
              />
              <span className="font-medium text-foreground-strong">
                Receive instant email alerts for new circulars and announcements
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.notifyGrades}
                onChange={(e) => setProfile({ ...profile, notifyGrades: e.target.checked })}
                className="rounded border-border text-primary-600"
              />
              <span className="font-medium text-foreground-strong">
                Send push notification when a teacher grades an assignment or quiz
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
