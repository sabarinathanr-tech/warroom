import React, { useState } from 'react';
import { Task } from '../../types';
import { Check, Trash2, Calendar, User as UserIcon } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { cn } from '../../utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const isCompleted = task.status === 'completed';

  return (
    <>
      <div
        className={cn(
          'group flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all duration-150',
          isCompleted
            ? 'bg-zinc-50/70 dark:bg-zinc-900/40 border-[#E8EAF0]/60 dark:border-zinc-800/60 opacity-80'
            : 'bg-white dark:bg-zinc-900 border-[#E8EAF0] dark:border-zinc-800 hover:border-[#5B5CE2]/30'
        )}
      >
        {/* Completion Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            'w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 mt-0.5 cursor-pointer',
            isCompleted
              ? 'bg-[#5B5CE2] border-[#5B5CE2] text-white'
              : 'border-[#E8EAF0] dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-[#5B5CE2]'
          )}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'text-sm font-semibold transition-colors',
                isCompleted
                  ? 'line-through text-[#737987] dark:text-zinc-500'
                  : 'text-[#171923] dark:text-zinc-100'
              )}
            >
              {task.title}
            </h4>

            <button
              onClick={() => setShowConfirmDelete(true)}
              className="opacity-0 group-hover:opacity-100 p-1 text-[#737987] hover:text-rose-500 rounded-lg transition"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {task.description && (
            <p
              className={cn(
                'text-xs mt-1 leading-relaxed',
                isCompleted ? 'text-zinc-400 dark:text-zinc-600' : 'text-[#737987] dark:text-zinc-400'
              )}
            >
              {task.description}
            </p>
          )}

          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-1 text-[11px] text-[#737987] dark:text-zinc-400">
            {task.assignedTo ? (
              <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-[#E8EAF0] dark:border-zinc-700/60">
                <Avatar name={task.assignedTo.name} src={task.assignedTo.avatar} size="xs" />
                <span className="font-medium text-[#171923] dark:text-zinc-200">
                  {task.assignedTo.name}
                </span>
              </div>
            ) : (
              <span className="flex items-center gap-1">
                <UserIcon className="w-3 h-3" />
                <span>Unassigned</span>
              </span>
            )}

            {task.dueDate && (
              <span className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-[#E8EAF0] dark:border-zinc-700/60">
                <Calendar className="w-3 h-3 text-[#737987]" />
                <span>Due {task.dueDate}</span>
              </span>
            )}

            <span
              className={cn(
                'font-medium uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded',
                isCompleted
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
              )}
            >
              {task.status}
            </span>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => onDelete(task.id)}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
        confirmLabel="Delete Task"
      />
    </>
  );
};
