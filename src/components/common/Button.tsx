import React from 'react';
import { cn } from '../../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const variants = {
    primary: 'bg-[#5B5CE2] hover:bg-[#4F50D0] text-white shadow-sm border border-transparent',
    secondary: 'bg-[#EEF0FF] hover:bg-[#E0E3FF] text-[#5B5CE2] border border-transparent dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200',
    outline: 'bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 text-[#171923] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-2xs',
    ghost: 'text-[#737987] hover:text-[#171923] hover:bg-zinc-100 dark:hover:bg-zinc-800/60 dark:text-zinc-400 dark:hover:text-zinc-100',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-9.5',
    lg: 'text-sm font-semibold px-5 py-2.5 gap-2 h-11',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
