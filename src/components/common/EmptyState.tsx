import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-zinc-900 border border-dashed border-[#E8EAF0] dark:border-zinc-800 rounded-2xl my-2">
      <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] dark:bg-zinc-800 text-[#5B5CE2] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-base font-semibold text-[#171923] dark:text-zinc-100">{title}</h4>
      <p className="text-xs text-[#737987] dark:text-zinc-400 max-w-sm mt-1.5 mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
