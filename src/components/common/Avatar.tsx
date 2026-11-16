import React from 'react';
import { cn, getInitials } from '../../utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-16 h-16 text-base font-semibold',
  }[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white dark:ring-zinc-900 shrink-0', sizes, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-[#EEF0FF] dark:bg-zinc-800 text-[#5B5CE2] dark:text-zinc-200 font-medium flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shrink-0 uppercase select-none',
        sizes,
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

interface AvatarGroupProps {
  users: Array<{ id: string; name: string; avatar?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 3, size = 'sm' }) => {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((u, i) => (
        <Avatar key={u.id || i} name={u.name} src={u.avatar} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full bg-zinc-100 dark:bg-zinc-800 text-[#737987] dark:text-zinc-400 font-medium flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shrink-0 text-xs',
            size === 'xs' ? 'w-6 h-6 text-[10px]' : size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-xs'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
