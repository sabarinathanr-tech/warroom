import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useRoom } from '../../context/RoomContext';
import { useToast } from '../../context/ToastContext';
import { KeyRound, Sparkles } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { joinRoom } = useRoom();
  const { showToast } = useToast();

  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = joinRoom(inviteCode);
      setLoading(false);

      if (result.success && result.room) {
        showToast(result.message, { type: 'success' });
        onClose();
        setInviteCode('');
        navigate(`/rooms/${result.room.id}`);
      } else {
        setError(result.message);
        showToast(result.message, { type: 'error' });
      }
    }, 300);
  };

  const handleQuickCode = (code: string) => {
    setInviteCode(code);
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join a WarRoom"
      description="Enter the invite code provided by a room owner or teammate."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Invite Code"
          placeholder="e.g. WR-HACK"
          leftIcon={<KeyRound className="w-4 h-4" />}
          value={inviteCode}
          onChange={(e) => {
            setInviteCode(e.target.value.toUpperCase());
            if (error) setError('');
          }}
          error={error}
          autoFocus
          required
        />

        {/* Demo codes shortcut for judges & users */}
        <div className="bg-[#EEF0FF]/60 dark:bg-zinc-800/60 p-3 rounded-xl border border-[#5B5CE2]/20">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B5CE2] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Seed Invite Codes</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['WR-HACK', 'WR-PROD', 'WR-RSRCH'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleQuickCode(code)}
                className="text-[11px] font-mono font-medium px-2 py-1 bg-white dark:bg-zinc-900 border border-[#5B5CE2]/30 rounded-lg text-[#171923] dark:text-zinc-200 hover:border-[#5B5CE2] transition cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8EAF0] dark:border-zinc-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading}>
            Join Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
