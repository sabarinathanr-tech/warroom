import React from 'react';
import { cn } from '../../utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  size = 'md',
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  }[size];

  return (
    <div className={cn('w-full flex items-center gap-3', className)}>
      <div className={cn('w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden', heights)}>
        <div
          className="h-full bg-[#5B5CE2] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-[#171923] dark:text-zinc-200 tabular-nums shrink-0">
          {clamped}%
        </span>
      )}
    </div>
  );
};
