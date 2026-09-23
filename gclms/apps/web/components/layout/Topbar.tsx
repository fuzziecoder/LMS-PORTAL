'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Menu, LogOut, User, ChevronDown, Calendar } from 'lucide-react';
import { UserSession } from '@/lib/auth';

interface TopbarProps {
  session: UserSession;
  onOpenMobileMenu?: () => void;
}

export default function Topbar({ session, onOpenMobileMenu }: TopbarProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount] = useState(3);

  const handleLogout = () => {
    document.cookie = 'gclms_dev_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'gclms_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'FOUNDER':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'PRINCIPAL':
        return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'TEACHER':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'STUDENT':
      default:
        return 'bg-success-50 text-success-700 border-success-200';
    }
  };

  return (
    <header className="h-16 bg-surface border-b border-border sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
      {/* Mobile Menu Button + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses, assignments, students, projects..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600 focus:bg-surface transition-all placeholder:text-foreground-subtle"
          />
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3">
        {/* Academic Year Selector */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border text-xs font-medium text-foreground-muted">
          <Calendar className="w-3.5 h-3.5 text-foreground-subtle" />
          <span>AY 2026–2027</span>
        </div>

        {/* Role Badge */}
        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getRoleBadgeStyle(session.role)}`}>
          {session.role}
        </span>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-foreground-muted hover:text-foreground-strong hover:bg-surface-hover transition-colors"
          aria-label="View notifications"
          onClick={() => router.push(session.role === 'STUDENT' ? '/student/notifications' : '#')}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-600 ring-2 ring-surface" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center border border-primary-200">
              {session.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground-strong leading-tight">{session.name}</span>
              <span className="text-[10px] text-foreground-subtle truncate max-w-[120px]">{session.email}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-foreground-subtle hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-modal py-1 z-50 text-xs">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-foreground-strong">{session.name}</p>
                <p className="text-[11px] text-foreground-subtle truncate">{session.email}</p>
                {session.schoolName && (
                  <p className="text-[10px] text-primary-600 font-semibold mt-1">{session.schoolName}</p>
                )}
              </div>

              {session.role === 'STUDENT' && (
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push('/student/profile');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface-hover text-foreground flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-foreground-subtle" /> My Profile
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-danger-50 text-danger-600 font-medium flex items-center gap-2 border-t border-border mt-1"
              >
                <LogOut className="w-4 h-4 text-danger-500" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
