import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from '../components/common/Avatar';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils';
import { Camera, Calendar, ShieldCheck } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
        avatar: avatar.trim() || undefined,
      });
      setSaving(false);
      showToast('Profile updated successfully', { type: 'success' });
    }, 300);
  };

  const handleAvatarPrompt = () => {
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    ];
    const nextIdx = (avatars.indexOf(avatar) + 1) % avatars.length;
    setAvatar(avatars[nextIdx]);
    showToast('Avatar updated', { type: 'info' });
  };

  return (
    <AppLayout title="User Profile">
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923] dark:text-zinc-100">
            Profile Details
          </h1>
          <p className="text-xs sm:text-sm text-[#737987] dark:text-zinc-400 mt-1">
            Manage your personal identity and workspace representation.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar name={name || 'User'} src={avatar} size="xl" />
              <button
                type="button"
                onClick={handleAvatarPrompt}
                className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150"
                title="Change Avatar"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#171923] dark:text-zinc-100">
                {name || 'Teammate'}
              </h3>
              <p className="text-xs text-[#737987] dark:text-zinc-400">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarPrompt}
                  icon={<Camera className="w-3.5 h-3.5" />}
                >
                  Change Avatar
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8EAF0] dark:border-zinc-800">
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#171923] dark:text-zinc-300">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief bio or team role..."
                  className="w-full text-sm bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl px-3.5 py-2 text-[#171923] dark:text-zinc-100 placeholder:text-[#737987]/70 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 focus:border-[#5B5CE2] transition resize-none"
                />
              </div>

              {/* Readonly info */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#737987]">
                <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-[#E8EAF0] dark:border-zinc-800">
                  <Calendar className="w-4 h-4 text-[#737987]" />
                  <div>
                    <span className="block font-medium text-[#171923] dark:text-zinc-200">
                      Member Since
                    </span>
                    <span>{formatDate(user?.createdAt || new Date().toISOString())}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-[#E8EAF0] dark:border-zinc-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="block font-medium text-[#171923] dark:text-zinc-200">
                      Account Status
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified Active</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary" size="md" type="submit" loading={saving}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
