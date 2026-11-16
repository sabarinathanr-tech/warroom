import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ArrowUpRight, Lock, KeyRound } from 'lucide-react';
import { Room } from '../../types';
import { useRoom } from '../../context/RoomContext';
import { ProgressBar } from '../common/ProgressBar';
import { formatDate, getInitials } from '../../utils';

interface RoomCardProps {
  room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();
  const { getRoomProgress, getRoomResources } = useRoom();

  const progress = getRoomProgress(room.id);
  const resources = getRoomResources(room.id);

  return (
    <div
      onClick={() => navigate(`/rooms/${room.id}`)}
      className="group relative bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-5 hover:border-[#5B5CE2]/40 hover:shadow-md hover:shadow-[#5B5CE2]/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF0FF] dark:bg-zinc-800 text-[#5B5CE2] dark:text-zinc-200 font-bold flex items-center justify-center text-sm uppercase">
              {getInitials(room.name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-[#171923] dark:text-zinc-100 group-hover:text-[#5B5CE2] transition-colors">
                  {room.name}
                </h3>
                {room.visibility === 'invite' ? (
                  <span title="Invite only" className="text-[#737987]">
                    <KeyRound className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span title="Private" className="text-[#737987]">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#737987] dark:text-zinc-400">
                Updated {formatDate(room.updatedAt)}
              </p>
            </div>
          </div>

          <div className="text-[#737987] group-hover:text-[#5B5CE2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#737987] dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {room.description || 'No description provided.'}
        </p>
      </div>

      {/* Progress & metrics */}
      <div className="pt-3 border-t border-[#E8EAF0] dark:border-zinc-800/80 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-medium text-[#737987] dark:text-zinc-400">
              Room Progress
            </span>
            <span className="text-xs font-semibold text-[#171923] dark:text-zinc-100 tabular-nums">
              {progress.percentage}%
            </span>
          </div>
          <ProgressBar value={progress.percentage} size="sm" />
        </div>

        <div className="flex items-center justify-between text-xs text-[#737987] dark:text-zinc-400 pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#737987]" />
              <span>{room.memberIds.length} members</span>
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#737987]" />
              <span>{resources.length} resources</span>
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#5B5CE2]">
            {progress.completedTasks}/{progress.totalTasks} tasks
          </span>
        </div>
      </div>
    </div>
  );
};
