'use client';

import React from 'react';
import { isDevDataMode } from '@/lib/feature-flags';
import { AlertCircle } from 'lucide-react';

export default function DevPreviewBanner() {
  if (!isDevDataMode()) {
    return null;
  }

  return (
    <div className="bg-primary-50 border-b border-primary-100 px-4 py-1.5 text-xs text-primary-800 flex items-center justify-between font-medium">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
        <span className="font-bold">Development Mode:</span>
        <span>Displaying typed preview fixtures. Real FastAPI database connection activates in Phase 2+.</span>
      </div>
      <span className="text-[11px] px-2 py-0.5 rounded bg-primary-100 text-primary-800 font-mono">
        NEXT_PUBLIC_DEV_DATA_MODE=true
      </span>
    </div>
  );
}
