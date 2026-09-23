'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Bell, CheckCircle2, Clock, Megaphone, Award, Trash2 } from 'lucide-react';

export default function StudentNotificationsPage() {
  const session = {
    id: 'user-s1',
    name: 'Tharun V.',
    email: 'student.tharun.chennai@gclms.local',
    role: 'STUDENT' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Assignment Graded: Logic Gates & Arithmetic ALU',
      message: 'Rajesh Kumar graded your code submission. Score: 95/100 ("Excellent modular structure").',
      type: 'GRADE',
      time: '15 mins ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'School Circular: STEM AI & Robotics Hackathon 2026',
      message: 'Prof. Ananya Raman announced registration details for the upcoming national hackathon.',
      type: 'CIRCULAR',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Upcoming Due Date: Quiz 2 Data Structures',
      message: 'Quiz 2 in Python & Computational Thinking closes tomorrow at 11:59 PM.',
      type: 'REMINDER',
      time: 'Yesterday',
      read: true,
    },
    {
      id: 'notif-4',
      title: 'Attendance Verified: Present for Today',
      message: 'Daily roll call marked as Present for Grade 10 - Section A.',
      type: 'ATTENDANCE',
      time: '2 days ago',
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Notifications & Alerts</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Real-time updates on graded coursework, upcoming deadlines, circulars, and attendance logs.
            </p>
          </div>
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border text-foreground-strong rounded-lg text-xs font-semibold hover:bg-surface-hover shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-success" /> Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                !item.read ? 'bg-primary-50/20 border-primary-200' : 'bg-surface border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5 ${
                    item.type === 'GRADE'
                      ? 'bg-success'
                      : item.type === 'CIRCULAR'
                      ? 'bg-primary-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  {item.type === 'GRADE' ? (
                    <Award className="w-4 h-4" />
                  ) : item.type === 'CIRCULAR' ? (
                    <Megaphone className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs sm:text-sm text-foreground-strong">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-primary-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-foreground-muted leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-foreground-subtle block pt-0.5">{item.time}</span>
                </div>
              </div>

              <button
                onClick={() => setNotifications(notifications.filter((n) => n.id !== item.id))}
                className="text-foreground-subtle hover:text-error p-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
