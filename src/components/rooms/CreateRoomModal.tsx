import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useRoom } from '../../context/RoomContext';
import { useToast } from '../../context/ToastContext';
import { Lock, KeyRound } from 'lucide-react';
import { RoomVisibility } from '../../types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { createRoom } = useRoom();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<RoomVisibility>('invite');
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Room name is required' });
      return;
    }

    setIsSubmitting(true);
    try {
      const newRoom = createRoom(name, description, visibility);
      showToast('Room created successfully', {
        type: 'success',
        message: `Welcome to ${newRoom.name}!`,
      });
      onClose();
      setName('');
      setDescription('');
      navigate(`/rooms/${newRoom.id}`);
    } catch {
      showToast('Error creating room', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Room"
      description="Set up a dedicated workspace for resources, progress, and tasks."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Room Name"
          placeholder="e.g. Mobile Redesign, Q3 Security Audit"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({});
          }}
          error={errors.name}
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
            placeholder="What is this room coordinating?"
            className="w-full text-sm bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl px-3.5 py-2 text-[#171923] dark:text-zinc-100 placeholder:text-[#737987]/70 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 focus:border-[#5B5CE2] transition resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#171923] dark:text-zinc-300">
            Room Visibility
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setVisibility('invite')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                visibility === 'invite'
                  ? 'border-[#5B5CE2] bg-[#EEF0FF]/50 dark:bg-zinc-800/80 text-[#5B5CE2]'
                  : 'border-[#E8EAF0] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-[#737987]'
              }`}
            >
              <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#171923] dark:text-zinc-200">
                  Invite Only
                </p>
                <p className="text-[11px] text-[#737987] dark:text-zinc-400 mt-0.5">
                  Join via room invite code
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('private')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                visibility === 'private'
                  ? 'border-[#5B5CE2] bg-[#EEF0FF]/50 dark:bg-zinc-800/80 text-[#5B5CE2]'
                  : 'border-[#E8EAF0] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-[#737987]'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#171923] dark:text-zinc-200">
                  Private
                </p>
                <p className="text-[11px] text-[#737987] dark:text-zinc-400 mt-0.5">
                  Restricted to invited members
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E8EAF0] dark:border-zinc-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={isSubmitting}>
            Create Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
