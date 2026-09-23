'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Settings, Shield, HardDrive, Bell, Lock, Database, AlertTriangle } from 'lucide-react';

export default function FounderSettingsPage() {
  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Platform Infrastructure Settings</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Configure multi-tenant security thresholds, session timeouts, S3 storage, and system environment flags.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security & Authentication Settings */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground-strong flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600" /> Authentication & Password Policies
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-subtle border border-border">
                <div>
                  <span className="font-bold text-foreground-strong block">Hashing Algorithm</span>
                  <span className="text-foreground-muted">Argon2id with memory cost 65536</span>
                </div>
                <span className="text-success-700 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-subtle border border-border">
                <div>
                  <span className="font-bold text-foreground-strong block">Session Access Token Life</span>
                  <span className="text-foreground-muted">15 minutes (HTTP-only cookie)</span>
                </div>
                <span className="text-foreground-strong font-mono">15m</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-subtle border border-border">
                <div>
                  <span className="font-bold text-foreground-strong block">Refresh Token Rotation</span>
                  <span className="text-foreground-muted">30 days single-use rotation</span>
                </div>
                <span className="text-success-700 font-bold">Enabled</span>
              </div>
            </div>
          </div>

          {/* S3 Object Storage Settings */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground-strong flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-600" /> S3 Storage & Upload Limits
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                <div>
                  <span className="font-bold text-foreground-strong block">S3 Bucket Endpoint</span>
                  <span className="text-foreground-muted">MinIO / AWS S3 (gclms-files)</span>
                </div>
                <span className="text-primary-600 font-mono">Ready</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                <div>
                  <span className="font-bold text-foreground-strong block">Project Zip Archive Limit</span>
                  <span className="text-foreground-muted">Maximum 50 MB per submission</span>
                </div>
                <span className="font-mono font-bold">50 MB</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-subtle border border-border flex justify-between">
                <div>
                  <span className="font-bold text-foreground-strong block">Document Attachment Limit</span>
                  <span className="text-foreground-muted">PDF / DOCX up to 25 MB</span>
                </div>
                <span className="font-mono font-bold">25 MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Diagnostics / Environment Banner */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6">
          <h2 className="text-base font-bold text-foreground-strong mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-violet-600" /> Database & Redis Cache Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-surface-subtle border border-border">
              <span className="text-foreground-subtle block">Primary Database</span>
              <strong className="text-foreground-strong">PostgreSQL 16 (Async SQLAlchemy)</strong>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border">
              <span className="text-foreground-subtle block">Cache & Task Broker</span>
              <strong className="text-foreground-strong">Redis 7 (Standalone / Cluster ready)</strong>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border">
              <span className="text-foreground-subtle block">Background Worker</span>
              <strong className="text-foreground-strong">Celery v5 (2 Concurrent Workers)</strong>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
