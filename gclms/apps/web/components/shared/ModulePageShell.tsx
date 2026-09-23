import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { getServerSession, Role } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sparkles, Layers } from 'lucide-react';

interface ModulePageShellProps {
  title: string;
  description: string;
  allowedRole?: Role;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ModulePageShell({
  title,
  description,
  allowedRole,
  actions,
  children,
}: ModulePageShellProps) {
  const session = getServerSession();

  if (!session) {
    redirect('/login');
  }

  if (allowedRole && session.role !== allowedRole && session.role !== 'FOUNDER') {
    redirect('/forbidden');
  }

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" /> GCLMS Domain Module
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground-strong tracking-tight">{title}</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">{description}</p>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        {/* Module Content */}
        {children ? (
          children
        ) : (
          <div className="bg-surface rounded-xl border border-border shadow-card p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground-strong">{title} Module Active</h3>
            <p className="text-xs text-foreground-muted max-w-md mx-auto">
              This domain module interface is ready for API & database integration in Phase 3+.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
