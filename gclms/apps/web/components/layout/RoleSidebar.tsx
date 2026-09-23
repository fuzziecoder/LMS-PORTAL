'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  FileBarChart,
  FolderGit2,
  Megaphone,
  ShieldCheck,
  Settings,
  GraduationCap,
  UserCheck,
  School,
  CalendarCheck,
  TrendingUp,
  FileText,
  ClipboardList,
  CheckSquare,
  HelpCircle,
  Award,
  Bell,
  User,
  BookMarked,
  X,
} from 'lucide-react';
import { Role } from '@/lib/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface RoleSidebarProps {
  role: Role;
  schoolName?: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function RoleSidebar({
  role,
  schoolName,
  mobileOpen = false,
  onCloseMobile,
}: RoleSidebarProps) {
  const pathname = usePathname();

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'FOUNDER':
        return [
          { label: 'Overview', href: '/founder/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Schools', href: '/founder/schools', icon: <Building2 className="w-4 h-4" /> },
          { label: 'Users', href: '/founder/users', icon: <Users className="w-4 h-4" /> },
          { label: 'Courses', href: '/founder/courses', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Reports', href: '/founder/reports', icon: <FileBarChart className="w-4 h-4" /> },
          { label: 'Projects', href: '/founder/projects', icon: <FolderGit2 className="w-4 h-4" /> },
          { label: 'Announcements', href: '/founder/announcements', icon: <Megaphone className="w-4 h-4" /> },
          { label: 'Audit Logs', href: '/founder/audit-logs', icon: <ShieldCheck className="w-4 h-4" /> },
          { label: 'Platform Settings', href: '/founder/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      case 'PRINCIPAL':
        return [
          { label: 'Overview', href: '/principal/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Students', href: '/principal/students', icon: <GraduationCap className="w-4 h-4" /> },
          { label: 'Teachers', href: '/principal/teachers', icon: <UserCheck className="w-4 h-4" /> },
          { label: 'Classes & Sections', href: '/principal/classes', icon: <School className="w-4 h-4" /> },
          { label: 'Courses', href: '/principal/courses', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Attendance', href: '/principal/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { label: 'Progress', href: '/principal/progress', icon: <TrendingUp className="w-4 h-4" /> },
          { label: 'Projects', href: '/principal/projects', icon: <FolderGit2 className="w-4 h-4" /> },
          { label: 'Announcements', href: '/principal/announcements', icon: <Megaphone className="w-4 h-4" /> },
          { label: 'Reports', href: '/principal/reports', icon: <FileBarChart className="w-4 h-4" /> },
          { label: 'School Settings', href: '/principal/settings', icon: <Settings className="w-4 h-4" /> },
        ];
      case 'TEACHER':
        return [
          { label: 'Overview', href: '/teacher/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'My Classes', href: '/teacher/classes', icon: <School className="w-4 h-4" /> },
          { label: 'Courses', href: '/teacher/courses', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Lessons', href: '/teacher/lessons', icon: <BookMarked className="w-4 h-4" /> },
          { label: 'Assignments', href: '/teacher/assignments', icon: <FileText className="w-4 h-4" /> },
          { label: 'Submissions', href: '/teacher/submissions', icon: <ClipboardList className="w-4 h-4" /> },
          { label: 'Quizzes', href: '/teacher/quizzes', icon: <HelpCircle className="w-4 h-4" /> },
          { label: 'Attendance', href: '/teacher/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { label: 'Grades', href: '/teacher/grades', icon: <Award className="w-4 h-4" /> },
          { label: 'Students', href: '/teacher/students', icon: <GraduationCap className="w-4 h-4" /> },
          { label: 'Projects', href: '/teacher/projects', icon: <FolderGit2 className="w-4 h-4" /> },
        ];
      case 'STUDENT':
      default:
        return [
          { label: 'Home', href: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'My Courses', href: '/student/courses', icon: <BookOpen className="w-4 h-4" /> },
          { label: 'Assignments', href: '/student/assignments', icon: <FileText className="w-4 h-4" /> },
          { label: 'Quizzes', href: '/student/quizzes', icon: <HelpCircle className="w-4 h-4" /> },
          { label: 'Grades', href: '/student/grades', icon: <Award className="w-4 h-4" /> },
          { label: 'Attendance', href: '/student/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { label: 'Progress', href: '/student/progress', icon: <TrendingUp className="w-4 h-4" /> },
          { label: 'My Projects', href: '/student/projects', icon: <FolderGit2 className="w-4 h-4" /> },
          { label: 'Notifications', href: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
          { label: 'Profile', href: '/student/profile', icon: <User className="w-4 h-4" /> },
        ];
    }
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border w-64 select-none">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-card">
            G
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-foreground-strong">GCLMS</span>
            <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider">{role} PORTAL</span>
          </div>
        </div>
        {mobileOpen && (
          <button onClick={onCloseMobile} className="p-1 rounded-md text-foreground-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* School Badge Context */}
      {schoolName && (
        <div className="mx-4 mt-4 p-2.5 rounded-lg bg-surface-subtle border border-border">
          <span className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wider block">School Context</span>
          <span className="text-xs font-semibold text-foreground-strong truncate block">{schoolName}</span>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href.split('/').length > 2);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-600 border border-primary-100 shadow-card'
                  : 'text-foreground-muted hover:text-foreground-strong hover:bg-surface-hover'
              }`}
            >
              <span className={isActive ? 'text-primary-600' : 'text-foreground-subtle'}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border text-center">
        <div className="text-[11px] text-foreground-subtle">
          GCLMS v0.1.0 • Academic Portal
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-foreground-strong/40 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
