'use client';

import React, { useState } from 'react';
import RoleSidebar from './RoleSidebar';
import Topbar from './Topbar';
import DevPreviewBanner from '../shared/DevPreviewBanner';
import { UserSession } from '@/lib/auth';

interface AppShellProps {
  session: UserSession;
  children: React.ReactNode;
}

export default function AppShell({ session, children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DevPreviewBanner />
      <div className="flex-1 flex">
        {/* Sidebar */}
        <RoleSidebar
          role={session.role}
          schoolName={session.schoolName}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            session={session}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
