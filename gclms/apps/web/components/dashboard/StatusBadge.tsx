import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'ACTIVE':
      case 'PUBLISHED':
      case 'APPROVED':
      case 'PRESENT':
      case 'COMPLETED':
        return 'bg-success-50 text-success-700 border-success-200';

      case 'DRAFT':
      case 'IDEA':
      case 'IN_PROGRESS':
      case 'LATE':
      case 'PENDING':
        return 'bg-warning-50 text-warning-700 border-warning-200';

      case 'SUSPENDED':
      case 'CLOSED':
      case 'REJECTED':
      case 'ABSENT':
      case 'EXPIRED':
        return 'bg-danger-50 text-danger-700 border-danger-200';

      case 'EXCUSED':
      case 'ARCHIVED':
      default:
        return 'bg-surface-muted text-foreground-muted border-border';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${getBadgeStyle(status)}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}
