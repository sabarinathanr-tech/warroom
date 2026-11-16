import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useRoom } from '../context/RoomContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { Avatar, AvatarGroup } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ResourceModal } from '../components/resources/ResourceModal';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskModal } from '../components/tasks/TaskModal';
import { Modal } from '../components/common/Modal';
import {
  Share2,
  CheckSquare,
  Lock,
  KeyRound,
  Copy,
  ChevronLeft,
  Trash2,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';
import { formatDate } from '../utils';

export const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const {
    getRoomById,
    getRoomResources,
    getRoomTasks,
    getRoomProgress,
    addResource,
    deleteResource,
    addTask,
    toggleTaskStatus,
    deleteTask,
    deleteRoom,
    users,
  } = useRoom();

  const room = roomId ? getRoomById(roomId) : undefined;
  const currentUserId = user?.id || 'user-1';

  // Navigation tab state: Overview | Resources | Tasks
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'tasks'>('overview');

  // Modal states
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteRoomConfirmOpen, setIsDeleteRoomConfirmOpen] = useState(false);

  // Filters
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<'all' | 'link' | 'document' | 'note'>('all');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  if (!room) {
    return (
      <AppLayout title="Room Not Found">
        <EmptyState
          icon={<Layers className="w-5 h-5" />}
          title="Room not found"
          description="The requested room does not exist or has been removed."
          actionLabel="Return to Dashboard"
          onAction={() => navigate('/dashboard')}
        />
      </AppLayout>
    );
  }

  const resources = getRoomResources(room.id);
  const tasks = getRoomTasks(room.id);
  const progress = getRoomProgress(room.id);

  // Member details
  const roomMembers = users.filter((u) => room.memberIds.includes(u.id));
  const isOwner = room.ownerId === currentUserId;

  // Filtered resources
  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      (res.description && res.description.toLowerCase().includes(resourceSearch.toLowerCase()));
    const matchesType = resourceTypeFilter === 'all' || res.type === resourceTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'pending') return t.status === 'pending';
    if (taskFilter === 'completed') return t.status === 'completed';
    return true;
  });

  const handleCopyInviteCode = () => {
    if (room.inviteCode) {
      navigator.clipboard.writeText(room.inviteCode);
      showToast('Invite code copied to clipboard', {
        type: 'success',
        message: `Teammates can use "${room.inviteCode}" to join this room.`,
      });
    }
  };

  const handleDeleteRoom = () => {
    deleteRoom(room.id);
    showToast(`Room "${room.name}" deleted`, { type: 'success' });
    navigate('/dashboard');
  };

  return (
    <AppLayout title={room.name}>
      <div className="space-y-6 animate-in fade-in duration-150">
        {/* Back Link */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#737987] hover:text-[#171923] dark:hover:text-zinc-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Room Header */}
        <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-[#171923] dark:text-zinc-100">
                  {room.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF0FF] dark:bg-zinc-800 text-[#5B5CE2]">
                  {room.visibility === 'invite' ? (
                    <>
                      <KeyRound className="w-3 h-3" />
                      <span>Invite Only</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Private</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#737987] dark:text-zinc-400 max-w-2xl leading-relaxed">
                {room.description || 'Dedicated WarRoom for cross-functional execution.'}
              </p>

              {/* Members Row */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <AvatarGroup users={roomMembers} max={4} size="sm" />
                  <span className="text-xs text-[#737987] font-medium">
                    {room.memberIds.length} members
                  </span>
                </div>
                <span className="text-xs text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-xs text-[#737987]">
                  Created {formatDate(room.createdAt)}
                </span>
              </div>
            </div>

            {/* Primary Header Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
              <Button
                variant="outline"
                size="sm"
                icon={<KeyRound className="w-4 h-4" />}
                onClick={() => setIsInviteModalOpen(true)}
              >
                Invite
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Share2 className="w-4 h-4" />}
                onClick={() => setIsResourceModalOpen(true)}
              >
                Share Resource
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<CheckSquare className="w-4 h-4" />}
                onClick={() => setIsTaskModalOpen(true)}
              >
                Add Task
              </Button>
              {isOwner && (
                <button
                  onClick={() => setIsDeleteRoomConfirmOpen(true)}
                  title="Delete Room"
                  className="p-2 text-[#737987] hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-[#E8EAF0] dark:border-zinc-800 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Room Progress Section */}
          <div className="mt-6 pt-6 border-t border-[#E8EAF0] dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#737987]">
                  Room Progress
                </span>
                <p className="text-sm font-bold text-[#171923] dark:text-zinc-100">
                  {progress.percentage}% completed
                </p>
              </div>
              <span className="text-xs font-medium text-[#737987]">
                {progress.completedTasks} of {progress.totalTasks} milestones completed
              </span>
            </div>
            <ProgressBar value={progress.percentage} size="md" />
          </div>
        </div>

        {/* Room Navigation Tabs: Overview, Resources, Tasks */}
        <div className="flex items-center gap-2 border-b border-[#E8EAF0] dark:border-zinc-800">
          {(['overview', 'resources', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-3 text-sm font-semibold capitalize transition-all border-b-2 relative ${
                activeTab === tab
                  ? 'border-[#5B5CE2] text-[#5B5CE2]'
                  : 'border-transparent text-[#737987] hover:text-[#171923] dark:hover:text-zinc-200'
              }`}
            >
              <span>{tab}</span>
              {tab === 'resources' && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[#737987]">
                  {resources.length}
                </span>
              )}
              {tab === 'tasks' && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[#737987]">
                  {tasks.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recent activity & quick updates */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Summary Card */}
              <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[#171923] dark:text-zinc-100">
                  Progress Summary
                </h3>
                <p className="text-xs text-[#737987] leading-relaxed">
                  {progress.totalTasks === 0
                    ? 'No milestones have been added to this room yet. Add tasks to start tracking dynamic progress.'
                    : progress.percentage === 100
                    ? 'All room milestones are completed! Outstanding work.'
                    : `${progress.totalTasks - progress.completedTasks} active milestones pending completion.`}
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl font-medium">
                    {progress.completedTasks} Completed
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl font-medium">
                    {progress.totalTasks - progress.completedTasks} Pending
                  </div>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#171923] dark:text-zinc-100">
                    Recent Task Updates
                  </h3>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs text-[#5B5CE2] font-semibold hover:underline"
                  >
                    View All Tasks
                  </button>
                </div>
                {tasks.length > 0 ? (
                  <div className="space-y-2">
                    {tasks.slice(0, 3).map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTaskStatus}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#737987]">No tasks created yet.</p>
                )}
              </div>

              {/* Recent Resources */}
              <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#171923] dark:text-zinc-100">
                    Recent Shared Resources
                  </h3>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className="text-xs text-[#5B5CE2] font-semibold hover:underline"
                  >
                    View All Resources
                  </button>
                </div>
                {resources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {resources.slice(0, 2).map((res) => (
                      <ResourceCard
                        key={res.id}
                        resource={res}
                        currentUserId={currentUserId}
                        onDelete={deleteResource}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#737987]">No resources shared yet.</p>
                )}
              </div>
            </div>

            {/* Right Column: Room Members & Invite Code */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#171923] dark:text-zinc-100">
                    Room Members
                  </h3>
                  <span className="text-xs text-[#737987] font-medium">
                    {roomMembers.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {roomMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar name={member.name} src={member.avatar} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#171923] dark:text-zinc-200 truncate">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-[#737987] truncate">{member.email}</p>
                        </div>
                      </div>
                      {member.id === room.ownerId && (
                        <span className="text-[10px] font-semibold bg-[#EEF0FF] dark:bg-zinc-800 text-[#5B5CE2] px-2 py-0.5 rounded-full">
                          Owner
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E8EAF0] dark:border-zinc-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon={<KeyRound className="w-4 h-4" />}
                    onClick={() => setIsInviteModalOpen(true)}
                  >
                    Invite Teammates
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-5 space-y-2 text-xs text-[#737987]">
                <h4 className="font-semibold text-[#171923] dark:text-zinc-200">
                  Room Details
                </h4>
                <div className="flex justify-between py-1 border-b border-[#E8EAF0] dark:border-zinc-800">
                  <span>Invite Code</span>
                  <span className="font-mono font-medium text-[#171923] dark:text-zinc-200">
                    {room.inviteCode || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8EAF0] dark:border-zinc-800">
                  <span>Last Activity</span>
                  <span>{formatDate(room.updatedAt)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Milestones Completed</span>
                  <span className="font-semibold text-[#5B5CE2]">
                    {progress.completedTasks} / {progress.totalTasks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: RESOURCES */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#171923] dark:text-zinc-100">
                  Shared Resources
                </h2>
                <p className="text-xs text-[#737987] dark:text-zinc-400">
                  Links, uploaded documents, and team notes pinned to this room.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Share2 className="w-4 h-4" />}
                onClick={() => setIsResourceModalOpen(true)}
              >
                + Share Resource
              </Button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-[#E8EAF0] dark:border-zinc-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#737987] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search shared resources..."
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  className="w-full text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-[#171923] dark:text-zinc-100 placeholder:text-[#737987] focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 focus:border-[#5B5CE2] transition"
                />
              </div>

              <div className="flex items-center gap-1 self-start sm:self-auto bg-zinc-50 dark:bg-zinc-800/80 p-1 rounded-xl">
                {(['all', 'link', 'document', 'note'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setResourceTypeFilter(type)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition capitalize ${
                      resourceTypeFilter === type
                        ? 'bg-white dark:bg-zinc-900 text-[#5B5CE2] shadow-2xs'
                        : 'text-[#737987] hover:text-[#171923]'
                    }`}
                  >
                    {type === 'all' ? 'All' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Resource List */}
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((res) => (
                  <ResourceCard
                    key={res.id}
                    resource={res}
                    currentUserId={currentUserId}
                    onDelete={deleteResource}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Share2 className="w-5 h-5" />}
                title={resourceSearch ? 'No matching resources' : 'No resources shared yet'}
                description={
                  resourceSearch
                    ? `No resources found matching "${resourceSearch}".`
                    : 'Share links, documents, or quick scratchpad notes with all room members.'
                }
                actionLabel="+ Share Resource"
                onAction={() => setIsResourceModalOpen(true)}
              />
            )}
          </div>
        )}

        {/* Tab 3: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#171923] dark:text-zinc-100">
                  Room Tasks & Milestones
                </h2>
                <p className="text-xs text-[#737987] dark:text-zinc-400">
                  Marking tasks complete dynamically updates the room's overall progress bar.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<CheckSquare className="w-4 h-4" />}
                onClick={() => setIsTaskModalOpen(true)}
              >
                + Add Task
              </Button>
            </div>

            {/* Task Filter Pills */}
            <div className="flex items-center gap-1.5 self-start bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 p-1 rounded-xl w-fit">
              {(['all', 'pending', 'completed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTaskFilter(mode)}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition capitalize ${
                    taskFilter === mode
                      ? 'bg-[#EEF0FF] text-[#5B5CE2] dark:bg-zinc-800 dark:text-zinc-200'
                      : 'text-[#737987] hover:text-[#171923]'
                  }`}
                >
                  {mode === 'all'
                    ? `All (${tasks.length})`
                    : mode === 'pending'
                    ? `Pending (${tasks.filter((t) => t.status === 'pending').length})`
                    : `Completed (${tasks.filter((t) => t.status === 'completed').length})`}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length > 0 ? (
              <div className="space-y-2.5">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskStatus}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckSquare className="w-5 h-5" />}
                title={
                  taskFilter === 'completed'
                    ? 'No completed tasks yet'
                    : taskFilter === 'pending'
                    ? 'No pending tasks'
                    : 'No tasks in this room yet'
                }
                description={
                  taskFilter !== 'all'
                    ? 'Switch filters to see tasks in other statuses.'
                    : 'Create your first milestone to track progress toward the room goal.'
                }
                actionLabel="+ Add First Task"
                onAction={() => setIsTaskModalOpen(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Share Resource Modal */}
      <ResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onSubmit={(data) => addResource({ ...data, roomId: room.id })}
      />

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        roomId={room.id}
        onSubmit={addTask}
      />

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Teammates"
        description="Share this unique room code so members can join this WarRoom directly."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="bg-[#EEF0FF]/60 dark:bg-zinc-800/60 p-4 rounded-xl border border-[#5B5CE2]/20 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase text-[#737987] tracking-wider">
                Invite Code
              </p>
              <p className="text-xl font-mono font-bold text-[#5B5CE2] mt-0.5">
                {room.inviteCode || 'WR-WAR'}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              icon={<Copy className="w-3.5 h-3.5" />}
              onClick={handleCopyInviteCode}
            >
              Copy
            </Button>
          </div>

          <p className="text-xs text-[#737987] leading-relaxed">
            Teammates can click <strong className="text-[#171923] dark:text-zinc-200">Join Room</strong> on their dashboard and enter this code to instantly access all resources and tasks.
          </p>

          <div className="flex justify-end pt-2">
            <Button size="sm" variant="primary" onClick={() => setIsInviteModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Room Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteRoomConfirmOpen}
        onClose={() => setIsDeleteRoomConfirmOpen(false)}
        onConfirm={handleDeleteRoom}
        title="Delete Room"
        message={`Are you sure you want to permanently delete "${room.name}"? All pinned resources and tasks will be erased.`}
        confirmLabel="Delete Room"
      />
    </AppLayout>
  );
};
