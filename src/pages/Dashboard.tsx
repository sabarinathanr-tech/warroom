import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';
import { StatCard } from '../components/common/StatCard';
import { RoomCard } from '../components/rooms/RoomCard';
import { CreateRoomModal } from '../components/rooms/CreateRoomModal';
import { JoinRoomModal } from '../components/rooms/JoinRoomModal';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import {
  FolderKanban,
  Files,
  TrendingUp,
  Plus,
  LogIn,
  Search,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { rooms, getOverallStats } = useRoom();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'invite' | 'private'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const stats = getOverallStats();

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility =
      filterVisibility === 'all' || room.visibility === filterVisibility;
    return matchesSearch && matchesVisibility;
  });

  return (
    <AppLayout
      title="Main Dashboard"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-8 animate-in fade-in duration-150">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#171923] dark:text-zinc-100">
              Good morning, {user?.name || 'Teammate'}
            </h1>
            <p className="text-xs sm:text-sm text-[#737987] dark:text-zinc-400 mt-1">
              Here's what's happening in your workspace.
            </p>
          </div>

          {/* Primary actions */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={<LogIn className="w-4 h-4" />}
              onClick={() => setIsJoinModalOpen(true)}
            >
              Join Room
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Create Room
            </Button>
          </div>
        </div>

        {/* Overview statistics: exactly 3 compact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Active Rooms"
            value={stats.activeRooms}
            icon={<FolderKanban className="w-4 h-4" />}
            subtitle="workspaces active"
          />
          <StatCard
            label="Shared Resources"
            value={stats.sharedResources}
            icon={<Files className="w-4 h-4" />}
            subtitle="files, links & notes"
          />
          <StatCard
            label="Overall Progress"
            value={`${stats.overallProgress}%`}
            icon={<TrendingUp className="w-4 h-4" />}
            subtitle="across all rooms"
          />
        </div>

        {/* My Rooms section */}
        <div id="rooms" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#171923] dark:text-zinc-100">
                My Rooms
              </h2>
              <p className="text-xs text-[#737987] dark:text-zinc-400">
                Dedicated spaces you own or collaborate within.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 p-1 rounded-xl">
              {(['all', 'invite', 'private'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterVisibility(mode)}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition capitalize ${
                    filterVisibility === mode
                      ? 'bg-[#EEF0FF] text-[#5B5CE2] dark:bg-zinc-800 dark:text-zinc-200'
                      : 'text-[#737987] hover:text-[#171923] dark:hover:text-zinc-300'
                  }`}
                >
                  {mode === 'all' ? 'All Rooms' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Grid or Empty State */}
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Search className="w-5 h-5" />}
              title={searchQuery ? 'No rooms match your search' : 'No rooms found'}
              description={
                searchQuery
                  ? `We couldn't find any rooms matching "${searchQuery}". Clear your search or create a new room.`
                  : 'Get started by creating your first team room to share resources and track milestone progress.'
              }
              actionLabel={searchQuery ? 'Clear Search' : '+ Create Your First Room'}
              onAction={() => {
                if (searchQuery) {
                  setSearchQuery('');
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </AppLayout>
  );
};
