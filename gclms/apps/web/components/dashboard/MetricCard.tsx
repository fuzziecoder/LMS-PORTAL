import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'blue' | 'violet' | 'cyan' | 'green' | 'amber';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'blue',
}: MetricCardProps) {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'violet':
        return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'cyan':
        return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'green':
        return 'bg-success-50 text-success-600 border-success-100';
      case 'amber':
        return 'bg-warning-50 text-warning-600 border-warning-100';
      case 'blue':
      default:
        return 'bg-primary-50 text-primary-600 border-primary-100';
    }
  };

  return (
    <div className="bg-surface p-5 sm:p-6 rounded-xl border border-border shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-lg border ${getAccentStyles()}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold text-foreground-strong tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-2">
          {subtitle && <span className="text-xs text-foreground-subtle">{subtitle}</span>}
          {trend && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend.isPositive ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
              }`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
