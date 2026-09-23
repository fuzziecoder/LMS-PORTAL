'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Users, Search, PlusCircle, Filter, Mail, Shield } from 'lucide-react';
import { UserRole } from '@/lib/api/types';

export default function FounderUsersPage() {
  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const users = [
    { id: '1', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER', school: 'Platform Wide', status: 'ACTIVE', lastLogin: '10 mins ago' },
    { id: '2', name: 'Prof. Ananya Raman', email: 'principal.chennai@gclms.local', role: 'PRINCIPAL', school: 'Chennai Innovation Academy', status: 'ACTIVE', lastLogin: '1 hour ago' },
    { id: '3', name: 'Dr. Ramesh Babu', email: 'principal.bengaluru@gclms.local', role: 'PRINCIPAL', school: 'Bengaluru STEM School', status: 'ACTIVE', lastLogin: 'Yesterday' },
    { id: '4', name: 'Rajesh Kumar', email: 'teacher.python.chennai@gclms.local', role: 'TEACHER', school: 'Chennai Innovation Academy', status: 'ACTIVE', lastLogin: '3 hours ago' },
    { id: '5', name: 'Anita Desai', email: 'teacher.ai.chennai@gclms.local', role: 'TEACHER', school: 'Chennai Innovation Academy', status: 'ACTIVE', lastLogin: 'Today' },
    { id: '6', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT', school: 'Chennai Innovation Academy', status: 'ACTIVE', lastLogin: 'Just now' },
    { id: '7', name: 'Harini S.', email: 'student.harini.chennai@gclms.local', role: 'STUDENT', school: 'Chennai Innovation Academy', status: 'ACTIVE', lastLogin: '2 days ago' },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Cross-School User Directory</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Manage accounts, invite faculty, verify role permissions, and audit access credentials.
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700">
            <PlusCircle className="w-4 h-4" /> Invite New User
          </button>
        </div>

        <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground-muted">Role:</span>
              {['ALL', 'FOUNDER', 'PRINCIPAL', 'TEACHER', 'STUDENT'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${roleFilter === r ? 'bg-primary-600 text-white shadow-card' : 'bg-surface-subtle text-foreground-muted hover:bg-surface-hover'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">School Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground-strong">{u.name}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-semibold border border-primary-100 text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-foreground-strong font-medium">{u.school}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={u.status} /></td>
                    <td className="py-3.5 px-4 text-foreground-subtle">{u.lastLogin}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-primary-600 font-semibold hover:underline">Edit</button>
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
