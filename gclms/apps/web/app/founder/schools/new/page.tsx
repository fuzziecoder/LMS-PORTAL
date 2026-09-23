'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { getServerSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Building2, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { isDevDataMode } from '@/lib/feature-flags';

export default function CreateSchoolPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalEmail, setPrincipalEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock session for UI
  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      router.push('/founder/schools');
    }, 1500);
  };

  return (
    <AppShell session={session}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/founder/schools')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground-strong"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Schools Directory
          </button>
        </div>

        <div className="bg-surface rounded-xl border border-border shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground-strong">Register New School Institution</h1>
              <p className="text-xs text-foreground-muted">Configure multi-tenant boundary, institution code, and assign Principal.</p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-success-600 mx-auto" />
              <h2 className="text-lg font-bold text-foreground-strong">School Registered Successfully</h2>
              <p className="text-xs text-foreground-muted">
                {isDevDataMode() ? 'Preview institution created. Redirecting to directory...' : 'Database record committed.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Coimbatore STEM Academy"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                    Institution Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CSA-06"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                    Assigned Principal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    placeholder="e.g. Dr. K. Meenakshi"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                    Principal Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={principalEmail}
                    onChange={(e) => setPrincipalEmail(e.target.value)}
                    placeholder="e.g. principal.coimbatore@gclms.local"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Coimbatore"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/founder/schools')}
                  className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-foreground-muted hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold shadow-card hover:bg-primary-700"
                >
                  Create School Record
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}
