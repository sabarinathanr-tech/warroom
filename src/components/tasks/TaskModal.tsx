import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useRoom } from '../../context/RoomContext';
import { useToast } from '../../context/ToastContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onSubmit: (data: {
    roomId: string;
    title: string;
    description?: string;
    dueDate?: string;
    assignedTo?: { id: string; name: string; avatar?: string };
  }) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  roomId,
  onSubmit,
}) => {
  const { users } = useRoom();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedUserId, setAssignedUserId] = useState<string>('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    const assignedUser = users.find((u) => u.id === assignedUserId);

    onSubmit({
      roomId,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      assignedTo: assignedUser
        ? { id: assignedUser.id, name: assignedUser.name, avatar: assignedUser.avatar }
        : undefined,
    });

    showToast('Task added to room', { type: 'success' });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setAssignedUserId('');
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Add Room Task"
      description="Create an actionable milestone. Completed tasks update the room's progress."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g. Audit responsive layout on mobile viewports"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({});
          }}
          error={errors.title}
          required
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#171923] dark:text-zinc-300">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details or deliverables for this task..."
            className="w-full text-sm bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl px-3.5 py-2 text-[#171923] dark:text-zinc-100 placeholder:text-[#737987]/70 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 focus:border-[#5B5CE2] transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171923] dark:text-zinc-300">
              Assignee
            </label>
            <select
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="w-full text-sm bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl px-3.5 py-2 text-[#171923] dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 focus:border-[#5B5CE2] transition"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8EAF0] dark:border-zinc-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Add Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
