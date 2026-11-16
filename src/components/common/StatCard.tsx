import React from 'react';
import { cn } from '../../utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, subtitle }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-5 shadow-2xs hover:border-[#5B5CE2]/30 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#737987] dark:text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] dark:bg-zinc-800 text-[#5B5CE2] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-[#171923] dark:text-zinc-100 tracking-tight tabular-nums">
          {value}
        </h3>
        {subtitle && (
          <span className="text-xs text-[#737987] dark:text-zinc-400">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
