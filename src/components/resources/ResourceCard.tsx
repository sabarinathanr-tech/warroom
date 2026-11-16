import React, { useState } from 'react';
import { Resource } from '../../types';
import { Link2, FileText, StickyNote, ExternalLink, Trash2, Copy, Eye } from 'lucide-react';
import { formatDate } from '../../utils';
import { Avatar } from '../common/Avatar';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';

interface ResourceCardProps {
  resource: Resource;
  currentUserId: string;
  onDelete: (id: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  currentUserId,
  onDelete,
}) => {
  const { showToast } = useToast();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);

  const isOwner = resource.sharedBy.id === currentUserId;

  const handleOpenResource = () => {
    if (resource.type === 'link' && resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else if (resource.type === 'note') {
      setShowNoteView(true);
    } else if (resource.type === 'document') {
      showToast(`Demo: Opened file "${resource.fileName}"`, {
        type: 'info',
        message: 'Local prototype simulates instantaneous document view.',
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', { type: 'success' });
  };

  const renderIcon = () => {
    switch (resource.type) {
      case 'link':
        return <Link2 className="w-4 h-4 text-[#5B5CE2]" />;
      case 'document':
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'note':
        return <StickyNote className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-2xl p-4.5 hover:border-[#5B5CE2]/30 transition-all duration-150 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-[#E8EAF0] dark:border-zinc-700/60 flex items-center justify-center shrink-0">
                {renderIcon()}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-[#171923] dark:text-zinc-100 truncate">
                  {resource.title}
                </h4>
                <span className="text-[11px] uppercase tracking-wider text-[#737987] font-medium">
                  {resource.type}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {resource.type === 'link' && resource.url && (
                <button
                  onClick={() => handleCopy(resource.url!)}
                  title="Copy Link"
                  className="p-1.5 text-[#737987] hover:text-[#171923] dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}

              {isOwner && (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  title="Delete resource"
                  className="p-1.5 text-[#737987] hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Body Content */}
          {resource.description && (
            <p className="text-xs text-[#737987] dark:text-zinc-400 mb-3 line-clamp-2 leading-relaxed">
              {resource.description}
            </p>
          )}

          {resource.type === 'document' && (
            <div className="mb-3 p-2 bg-zinc-50 dark:bg-zinc-800/60 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">
                {resource.fileName}
              </span>
              <span className="text-[11px] text-[#737987] font-medium shrink-0 ml-2">
                {resource.fileSize}
              </span>
            </div>
          )}

          {resource.type === 'note' && (
            <div
              onClick={() => setShowNoteView(true)}
              className="mb-3 p-2.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/40 rounded-xl cursor-pointer hover:border-amber-400/60 transition"
            >
              <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2 italic">
                "{resource.content}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E8EAF0] dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-[#737987] dark:text-zinc-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar name={resource.sharedBy.name} src={resource.sharedBy.avatar} size="xs" />
            <span className="truncate">{resource.sharedBy.name}</span>
            <span>•</span>
            <span className="shrink-0">{formatDate(resource.createdAt)}</span>
          </div>

          <button
            onClick={handleOpenResource}
            className="flex items-center gap-1 font-medium text-[#5B5CE2] hover:text-[#4F50D0] transition shrink-0 ml-2"
          >
            {resource.type === 'link' ? (
              <>
                <span>Open</span>
                <ExternalLink className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>View</span>
                <Eye className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Note view modal */}
      {showNoteView && (
        <Modal
          isOpen={showNoteView}
          onClose={() => setShowNoteView(false)}
          title={resource.title}
          description={`Shared by ${resource.sharedBy.name} on ${formatDate(resource.createdAt)}`}
          maxWidth="md"
        >
          <div className="bg-zinc-50 dark:bg-zinc-800/70 p-4 rounded-xl border border-[#E8EAF0] dark:border-zinc-800 font-sans text-sm text-[#171923] dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {resource.content}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleCopy(resource.content || '')}
              className="text-xs font-medium text-[#5B5CE2] hover:underline flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Note Text</span>
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => onDelete(resource.id)}
        title="Delete Resource"
        message={`Are you sure you want to remove "${resource.title}" from this room? This action cannot be undone.`}
        confirmLabel="Delete Resource"
      />
    </>
  );
};
