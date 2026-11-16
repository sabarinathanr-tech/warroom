import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Layers,
  LayoutDashboard,
  FolderKanban,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { cn } from '../../utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (target: string) => {
    onClose();
    if (target === 'rooms') {
      if (location.pathname === '/dashboard') {
        const el = document.getElementById('rooms');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/dashboard#rooms');
      }
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-150"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-[#E8EAF0] dark:border-zinc-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 shrink-0 select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top brand */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#E8EAF0] dark:border-zinc-800">
            <button
              onClick={() => {
                navigate('/dashboard');
                onClose();
              }}
              className="flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-[#5B5CE2] flex items-center justify-center text-white shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-[#171923] dark:text-zinc-100">
                WarRoom
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1 md:hidden text-[#737987] hover:text-[#171923] rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#737987]/80 dark:text-zinc-500">
              Workspace
            </div>

            <NavLink
              to="/dashboard"
              end
              onClick={() => onClose()}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive && !location.hash.includes('rooms')
                    ? 'bg-[#EEF0FF] text-[#5B5CE2] dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-[#737987] hover:text-[#171923] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-zinc-200'
                )
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </NavLink>

            <button
              onClick={() => handleNavClick('rooms')}
              className={cn(
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                location.pathname === '/dashboard' && location.hash.includes('rooms')
                  ? 'bg-[#EEF0FF] text-[#5B5CE2] dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-[#737987] hover:text-[#171923] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-zinc-200'
              )}
            >
              <FolderKanban className="w-4 h-4" />
              <span>My Rooms</span>
            </button>
          </div>
        </div>

        {/* Bottom user profile & settings */}
        <div className="p-4 border-t border-[#E8EAF0] dark:border-zinc-800 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#737987]/80 dark:text-zinc-500">
            Account
          </div>

          <NavLink
            to="/profile"
            onClick={() => onClose()}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#EEF0FF] text-[#5B5CE2] dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-[#737987] hover:text-[#171923] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-zinc-200'
              )
            }
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => onClose()}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#EEF0FF] text-[#5B5CE2] dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-[#737987] hover:text-[#171923] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-zinc-200'
              )
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          {/* User mini banner - clickable to profile */}
          {user && (
            <div
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
              className="pt-2 mt-2 border-t border-[#E8EAF0]/60 dark:border-zinc-800/60 flex items-center gap-2.5 px-2 py-1 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition"
            >
              <Avatar name={user.name} src={user.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#171923] dark:text-zinc-100 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-[#737987] dark:text-zinc-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
