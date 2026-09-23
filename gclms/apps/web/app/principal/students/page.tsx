'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { createStudent, fetchPrincipalStudents } from '@/lib/api/principal';
import { Download, Eye, PlusCircle, Search, X } from 'lucide-react';
import Link from 'next/link';

export default function PrincipalStudentsPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', class_id: 'class-1', section_id: 'sec-1' });

  const loadData = () => {
    setLoading(true);
    fetchPrincipalStudents({ search: search || undefined })
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createStudent({
        name: newStudent.name,
        email: newStudent.email,
        class_id: newStudent.class_id,
        section_id: newStudent.section_id,
      });
      setShowAddModal(false);
      setNewStudent({ name: '', email: '', class_id: 'class-1', section_id: 'sec-1' });
      loadData();
    } catch (err: any) {
      alert(`Enrollment failed: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesClass = classFilter === 'ALL' || s.class_name === classFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesClass && matchesStatus;
  });

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Student Directory & Enrollments</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Manage student rosters, section allocations, academic status, and individual student progress dossiers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/api/v1/principal/students/export"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface border border-border text-foreground-strong rounded-lg text-xs font-semibold hover:bg-surface-hover shadow-sm"
            >
              <Download className="w-4 h-4 text-foreground-muted" /> Export CSV
            </a>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Enroll Student
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-subtle border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-foreground-strong font-medium focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-8 text-center text-xs text-foreground-muted">Loading student directory...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll ID</th>
                    <th className="py-3 px-4">Class & Section</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-hover transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground-strong">{s.name}</div>
                        <div className="text-[11px] text-foreground-muted">{s.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-primary-600">{s.roll_number || '—'}</td>
                      <td className="py-3.5 px-4 text-foreground-strong font-medium">{s.class_name} {s.section_name ? `(${s.section_name})` : ''}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/principal/students/${s.id}`}
                          className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Dossier
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Enroll Student */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-foreground-strong">Enroll New Student</h3>
                <button onClick={() => setShowAddModal(false)} className="text-foreground-muted hover:text-foreground-strong">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleEnroll} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g. Ramesh Krishnan"
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Student Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="e.g. student.ramesh@gclms.local"
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                  >
                    {submitting ? 'Enrolling...' : 'Complete Enrollment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
