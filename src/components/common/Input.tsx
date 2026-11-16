import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#171923] dark:text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#737987] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full text-sm bg-white dark:bg-zinc-900 border rounded-xl px-3.5 py-2 text-[#171923] dark:text-zinc-100 placeholder:text-[#737987]/70 dark:placeholder:text-zinc-500 transition focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200/40'
                : 'border-[#E8EAF0] dark:border-zinc-800 focus:border-[#5B5CE2]',
              leftIcon && 'pl-9.5',
              rightIcon && 'pr-9.5',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#737987] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#737987] dark:text-zinc-400 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
