'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ShieldCheck, Search, Filter, Terminal, Code2 } from 'lucide-react';
import { FIXTURE_AUDIT_LOGS } from '@/lib/fixtures/projects';

export default function FounderAuditLogsPage() {
  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };
  const [selectedLog, setSelectedLog] = useState<(typeof FIXTURE_AUDIT_LOGS)[0] | null>(null);

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Security & Operational Audit Trail</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Immutable log ledger recording authentication events, grade modifications, and data access.
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-foreground-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono text-[11px]">
                {FIXTURE_AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-hover">
                    <td className="py-3.5 px-4 text-foreground-muted">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground-strong font-sans">{log.actor_name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-[10px]">
                        {log.actor_role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-primary-600 font-bold">{log.action}</td>
                    <td className="py-3.5 px-4 text-foreground-muted">{log.resource_type} ({log.resource_id})</td>
                    <td className="py-3.5 px-4 text-foreground-subtle">{log.ip_address}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="font-sans font-semibold text-primary-600 hover:underline"
                      >
                        View JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Detail Drawer Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 bg-foreground-strong/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-xl shadow-modal max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-foreground-strong flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary-600" /> Audit Log Event Details ({selectedLog.id})
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-foreground-muted hover:text-foreground-strong text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-foreground-subtle block">Action:</span>
                  <strong className="text-primary-600 font-mono">{selectedLog.action}</strong>
                </div>
                <div>
                  <span className="text-foreground-subtle block">Actor:</span>
                  <strong className="text-foreground-strong">{selectedLog.actor_name} ({selectedLog.actor_role})</strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-foreground-strong block mb-1">Event Payload (Read-Only JSON):</span>
                <pre className="p-3 rounded-lg bg-surface-muted border border-border text-[11px] font-mono overflow-x-auto text-foreground-strong">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>

              <div className="pt-3 border-t border-border flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
