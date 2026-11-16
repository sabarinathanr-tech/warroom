import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, LogOut, User as UserIcon, Settings as SettingsIcon, CheckCircle2, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  title?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  title,
  searchQuery,
  onSearchChange,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-4 md:px-8 bg-white dark:bg-zinc-900 border-b border-[#E8EAF0] dark:border-zinc-800 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 md:hidden text-[#737987] hover:text-[#171923] dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-base font-semibold text-[#171923] dark:text-zinc-100 truncate">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Search input (if enabled on page) */}
        {onSearchChange !== undefined && (
          <div className="relative hidden sm:block w-56 md:w-64">
            <Search className="w-4 h-4 text-[#737987] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-[#171923] dark:text-zinc-200 placeholder:text-[#737987] focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 focus:border-[#5B5CE2] transition"
            />
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#737987] hover:text-[#171923] dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition relative"
            aria-label="View notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5B5CE2] ring-2 ring-white dark:ring-zinc-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 px-2 border-b border-[#E8EAF0] dark:border-zinc-800">
                <span className="text-xs font-semibold text-[#171923] dark:text-zinc-200">
                  Room Activity Notifications
                </span>
                <span className="text-[10px] text-[#5B5CE2] font-semibold bg-[#EEF0FF] dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  2 Unread
                </span>
              </div>
              <div className="py-2 space-y-1.5">
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/rooms/room-hackathon-2026');
                  }}
                  className="p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl cursor-pointer transition flex items-start gap-2.5"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#171923] dark:text-zinc-200">
                      Task milestone completed
                    </p>
                    <p className="text-[11px] text-[#737987] dark:text-zinc-400 mt-0.5 truncate">
                      "Finalize UI tokens" in Hackathon 2026
                    </p>
                    <span className="text-[10px] text-zinc-400 mt-1 block">15m ago</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/rooms/room-product-dev');
                  }}
                  className="p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl cursor-pointer transition flex items-start gap-2.5"
                >
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#5B5CE2] mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#171923] dark:text-zinc-200">
                      New resource pinned
                    </p>
                    <p className="text-[11px] text-[#737987] dark:text-zinc-400 mt-0.5 truncate">
                      WarRoom_REST_Specs.yaml in Product Dev
                    </p>
                    <span className="text-[10px] text-zinc-400 mt-1 block">1h ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="User account menu"
          >
            <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
            <ChevronDown className="w-3.5 h-3.5 text-[#737987] hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-[#E8EAF0] dark:border-zinc-800">
                <p className="text-xs font-semibold text-[#171923] dark:text-zinc-100 truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-[#737987] dark:text-zinc-500 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#737987] hover:text-[#171923] hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#737987] hover:text-[#171923] hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
