'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Building2, PlusCircle, Search, Users, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FIXTURE_SCHOOLS } from '@/lib/fixtures/schools';

export default function FounderSchoolsPage() {
  const session = {
    id: 'founder',
    name: 'Dr. Vikram Sarabhai',
    email: 'founder@gclms.local',
    role: 'FOUNDER' as const,
  };

  const [search, setSearch] = useState('');
  const schools = FIXTURE_SCHOOLS;

  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.principal_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Institutions & School Networks</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Onboard new school tenants, assign institutional Principals, and monitor multi-tenant system health.
            </p>
          </div>
          <Link
            href="/founder/schools/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Onboard New School
          </Link>
        </div>

        {/* Search */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schools by name, city, or principal..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">School Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Assigned Principal</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Teachers</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((sch) => (
                  <tr key={sch.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary-600" />
                        {sch.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-foreground-muted">{sch.city}, {sch.state}</td>
                    <td className="py-3.5 px-4 text-foreground-strong font-medium">{sch.principal_name}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{sch.student_count}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{sch.teacher_count}</td>
                    <td className="py-3.5 px-4 font-bold text-success">{sch.attendance_rate}%</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={sch.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/founder/schools/${sch.id}`}
                        className="text-primary-600 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Manage <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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
