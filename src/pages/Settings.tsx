import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import {
  Bell,
  Sun,
  Moon,
  Lock,
  LogOut,
  Sliders,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { preferences, updatePreferences, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', { type: 'error' });
      return;
    }
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    showToast('Password updated successfully (Demo)', { type: 'success' });
  };

  const handleSignOut = () => {
    logout();
    showToast('Signed out of WarRoom', { type: 'info' });
    navigate('/login');
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923] dark:text-zinc-100">
            Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#737987] dark:text-zinc-400 mt-1">
            Customize notifications, visual themes, and account security.
          </p>
        </div>

        {/* 1. Account Section */}
        <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#E8EAF0] dark:border-zinc-800">
            <Lock className="w-4 h-4 text-[#5B5CE2]" />
            <h2 className="text-base font-semibold text-[#171923] dark:text-zinc-100">
              Account Security
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <p className="text-sm font-medium text-[#171923] dark:text-zinc-200">
                Account Password
              </p>
              <p className="text-xs text-[#737987] dark:text-zinc-400 mt-0.5">
                Set a unique password to safeguard access to your rooms and documents.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* 2. Preferences Section */}
        <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#E8EAF0] dark:border-zinc-800">
            <Bell className="w-4 h-4 text-[#5B5CE2]" />
            <h2 className="text-base font-semibold text-[#171923] dark:text-zinc-100">
              Notification Preferences
            </h2>
          </div>

          {/* Email toggle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#171923] dark:text-zinc-200">
                Email Notifications
              </p>
              <p className="text-xs text-[#737987] dark:text-zinc-400 mt-0.5">
                Receive weekly milestone summaries and major room announcements.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => {
                  updatePreferences({ emailNotifications: e.target.checked });
                  showToast(
                    `Email notifications ${e.target.checked ? 'enabled' : 'disabled'}`
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B5CE2]"></div>
            </label>
          </div>

          {/* Activity toggle */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-sm font-medium text-[#171923] dark:text-zinc-200">
                Room Activity Notifications
              </p>
              <p className="text-xs text-[#737987] dark:text-zinc-400 mt-0.5">
                Get notified when teammates pin new links, documents, or complete tasks.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.roomActivityNotifications}
                onChange={(e) => {
                  updatePreferences({ roomActivityNotifications: e.target.checked });
                  showToast(
                    `Activity alerts ${e.target.checked ? 'enabled' : 'disabled'}`
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B5CE2]"></div>
            </label>
          </div>
        </div>

        {/* 3. Appearance Section */}
        <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#E8EAF0] dark:border-zinc-800">
            <Sliders className="w-4 h-4 text-[#5B5CE2]" />
            <h2 className="text-base font-semibold text-[#171923] dark:text-zinc-100">
              Appearance
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                updatePreferences({ theme: 'light' });
                showToast('Switched to Light Theme');
              }}
              className={`p-4 rounded-xl border flex items-center gap-3 transition ${
                preferences.theme === 'light'
                  ? 'border-[#5B5CE2] bg-[#EEF0FF]/50 text-[#5B5CE2]'
                  : 'border-[#E8EAF0] dark:border-zinc-800 text-[#737987] hover:bg-zinc-50'
              }`}
            >
              <Sun className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-[#171923] dark:text-zinc-100">
                  Light Theme
                </p>
                <p className="text-[11px] text-[#737987]">Clean high-contrast palette</p>
              </div>
            </button>

            <button
              onClick={() => {
                updatePreferences({ theme: 'dark' });
                showToast('Switched to Dark Theme');
              }}
              className={`p-4 rounded-xl border flex items-center gap-3 transition ${
                preferences.theme === 'dark'
                  ? 'border-[#5B5CE2] bg-zinc-800 text-white'
                  : 'border-[#E8EAF0] dark:border-zinc-800 text-[#737987] hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Moon className="w-5 h-5 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-[#171923] dark:text-zinc-100">
                  Dark Theme
                </p>
                <p className="text-[11px] text-[#737987]">Comfortable low-glare mode</p>
              </div>
            </button>
          </div>
        </div>

        {/* 4. Session Section */}
        <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#E8EAF0] dark:border-zinc-800">
            <LogOut className="w-4 h-4 text-rose-500" />
            <h2 className="text-base font-semibold text-[#171923] dark:text-zinc-100">
              Active Session
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <p className="text-sm font-medium text-[#171923] dark:text-zinc-200">
                Sign Out of Workspace
              </p>
              <p className="text-xs text-[#737987] dark:text-zinc-400 mt-0.5">
                End your local session and return to the login screen.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        description="Demo interaction: enter your new credentials below."
        maxWidth="sm"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E8EAF0] dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
};
