'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Megaphone, PlusCircle, Pin, Search } from 'lucide-react';
import { FIXTURE_ANNOUNCEMENTS } from '@/lib/fixtures/projects';

export default function FounderAnnouncementsPage() {
  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Platform Broadcasts & Announcements</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Issue platform-wide notices, exam schedules, and curriculum updates across all participating schools.
            </p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700"
          >
            <PlusCircle className="w-4 h-4" /> {isCreating ? 'Close Form' : 'New Platform Announcement'}
          </button>
        </div>

        {isCreating && (
          <div className="bg-surface rounded-xl border border-primary-200 shadow-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground-strong">Compose Broadcast</h2>
            <div>
              <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                Announcement Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Capstone Project Submission Deadline Extended"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                Announcement Body
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write message to all schools, principals, teachers, and students..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Announcement broadcast simulated in development fixture mode.');
                  setIsCreating(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold"
              >
                Publish Broadcast
              </button>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {FIXTURE_ANNOUNCEMENTS.map((ann) => (
            <div key={ann.id} className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {ann.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700 border border-primary-100">
                      <Pin className="w-3 h-3" /> PINNED
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-subtle text-foreground-muted uppercase">
                    Audience: {ann.audience}
                  </span>
                </div>
                <span className="text-xs text-foreground-subtle">{new Date(ann.created_at).toLocaleDateString()}</span>
              </div>

              <h3 className="font-bold text-base text-foreground-strong">{ann.title}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">{ann.content}</p>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-foreground-subtle">
                <span>Published by <strong>{ann.author_name}</strong> ({ann.author_role})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
