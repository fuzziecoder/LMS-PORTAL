'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Megaphone, PlusCircle, Pin, Users, Calendar, Trash2, X } from 'lucide-react';

export default function PrincipalAnnouncementsPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Upcoming National STEM AI & Robotics Hackathon 2026',
      content: 'All Grade 10 to 12 students are invited to register their 3-member project teams before Friday 5:00 PM.',
      audience: 'ALL',
      author_name: 'Prof. Ananya Raman',
      created_at: '2026-03-22',
      pinned: true,
    },
    {
      id: 'ann-2',
      title: 'Term 2 Faculty Grading & Midterm Score Submission Deadline',
      content: 'Instructors are reminded to finalize all assignment mark overrides in the teacher portal by March 28.',
      audience: 'TEACHERS',
      author_name: 'Prof. Ananya Raman',
      created_at: '2026-03-20',
      pinned: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', audience: 'ALL', pinned: false });

  const handleCreate = () => {
    if (!newPost.title) return;
    setAnnouncements([
      {
        id: `ann-${Date.now()}`,
        title: newPost.title,
        content: newPost.content,
        audience: newPost.audience as any,
        author_name: session.name,
        created_at: '2026-03-23',
        pinned: newPost.pinned,
      },
      ...announcements,
    ]);
    setShowModal(false);
    setNewPost({ title: '', content: '', audience: 'ALL', pinned: false });
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">School Announcements & Circulars</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Broadcast official institutional updates, notifications, and alerts to teachers, students, or platform-wide.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Publish Announcement
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className={`bg-surface rounded-xl border p-5 shadow-card transition-all ${
                item.pinned ? 'border-primary-300 bg-primary-50/20' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {item.pinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-100 text-primary-700 font-bold text-[10px]">
                      <Pin className="w-3 h-3" /> PINNED CIRCULAR
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-foreground-muted font-semibold text-[10px]">
                    Audience: {item.audience}
                  </span>
                </div>
                <div className="text-[11px] text-foreground-subtle flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {item.created_at}
                </div>
              </div>

              <h3 className="font-bold text-base text-foreground-strong mt-2">{item.title}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed mt-1.5">{item.content}</p>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60 text-xs text-foreground-subtle">
                <span>Published by {item.author_name}</span>
                <button
                  onClick={() => setAnnouncements(announcements.filter((a) => a.id !== item.id))}
                  className="text-error hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: New Announcement */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base text-foreground-strong">Create New Announcement</h3>
                <button onClick={() => setShowModal(false)} className="text-foreground-muted hover:text-foreground-strong">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Headline / Subject</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="e.g. Science Fair Registration"
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Audience Target</label>
                  <select
                    value={newPost.audience}
                    onChange={(e) => setNewPost({ ...newPost, audience: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  >
                    <option value="ALL">All (Teachers & Students)</option>
                    <option value="TEACHERS">Faculty Only</option>
                    <option value="STUDENTS">Students Only</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground-muted block mb-1">Announcement Body</label>
                  <textarea
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Enter message details here..."
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pin-post"
                    checked={newPost.pinned}
                    onChange={(e) => setNewPost({ ...newPost, pinned: e.target.checked })}
                    className="rounded border-border text-primary-600"
                  />
                  <label htmlFor="pin-post" className="font-medium text-foreground-strong cursor-pointer">
                    Pin this circular to top of portal
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                >
                  Broadcast Announcement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
