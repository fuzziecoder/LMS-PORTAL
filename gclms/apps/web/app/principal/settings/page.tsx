'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Building2, Save, Bell, Shield, Sliders, CheckCircle2 } from 'lucide-react';

export default function PrincipalSettingsPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: 'Chennai Innovation Academy',
    code: 'CIA-TN',
    city: 'Chennai',
    state: 'Tamil Nadu',
    academicTerm: 'Term 2 (Spring 2026)',
    attendanceThreshold: 75,
    assignmentWeight: 50,
    quizzesWeight: 25,
    attendanceWeight: 25,
    notifyParentsAbsence: true,
    allowStudentProjectSubmissions: true,
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
          <h1 className="text-2xl font-bold text-foreground-strong">School Profile & Institutional Settings</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Configure academic terms, evaluation policy formulas, alert thresholds, and institution details.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 bg-success/10 border border-success/20 rounded-xl text-success font-semibold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            School configurations updated and synchronized with the platform.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Institutional Info */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-600" /> Institution Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">Official School Name</label>
                <input
                  type="text"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">Institutional Code</label>
                <input
                  type="text"
                  disabled
                  value={settings.code}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle/50 border border-border text-foreground-subtle cursor-not-allowed font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">City</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">State / Province</label>
                <input
                  type="text"
                  value={settings.state}
                  onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
            </div>
          </div>

          {/* Academic Term & Weights */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary-600" /> Academic Term & Evaluation Formula
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">Current Active Term</label>
                <input
                  type="text"
                  value={settings.academicTerm}
                  onChange={(e) => setSettings({ ...settings, academicTerm: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground-muted block mb-1">Minimum Attendance Threshold (%)</label>
                <input
                  type="number"
                  value={settings.attendanceThreshold}
                  onChange={(e) => setSettings({ ...settings, attendanceThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="font-semibold text-foreground-muted block mb-2 text-xs">
                Grade Formula Weights (Assignments 50% + Quizzes 25% + Attendance 25%)
              </label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-surface-subtle border border-border rounded-lg">
                  <div className="text-foreground-muted font-medium">Assignments Weight</div>
                  <div className="text-base font-bold text-foreground-strong mt-0.5">{settings.assignmentWeight}%</div>
                </div>
                <div className="p-3 bg-surface-subtle border border-border rounded-lg">
                  <div className="text-foreground-muted font-medium">Quizzes Weight</div>
                  <div className="text-base font-bold text-foreground-strong mt-0.5">{settings.quizzesWeight}%</div>
                </div>
                <div className="p-3 bg-surface-subtle border border-border rounded-lg">
                  <div className="text-foreground-muted font-medium">Attendance Weight</div>
                  <div className="text-base font-bold text-foreground-strong mt-0.5">{settings.attendanceWeight}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy & Toggles */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-3 text-xs">
            <h2 className="text-sm font-bold text-foreground-strong flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary-600" /> Notifications & Policies
            </h2>
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={settings.notifyParentsAbsence}
                onChange={(e) => setSettings({ ...settings, notifyParentsAbsence: e.target.checked })}
                className="rounded border-border text-primary-600"
              />
              <span className="font-medium text-foreground-strong">
                Automatically dispatch SMS / Email notifications to parents for unexcused absences
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowStudentProjectSubmissions}
                onChange={(e) => setSettings({ ...settings, allowStudentProjectSubmissions: e.target.checked })}
                className="rounded border-border text-primary-600"
              />
              <span className="font-medium text-foreground-strong">
                Allow students to submit open innovation projects for showcase review
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4" /> Save Institutional Settings
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
