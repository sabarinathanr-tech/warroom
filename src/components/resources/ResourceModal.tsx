import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ResourceType } from '../../types';
import { Link2, FileText, StickyNote, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: ResourceType;
    description?: string;
    url?: string;
    fileName?: string;
    fileSize?: string;
    content?: string;
  }) => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { showToast } = useToast();
  const [type, setType] = useState<ResourceType>('link');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [errors, setErrors] = useState<{ title?: string; url?: string; file?: string }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeText = file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${sizeMB} MB`;
      setSelectedFile({
        name: file.name,
        size: sizeText,
      });
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Resource title is required';
    }

    if (type === 'link' && !url.trim()) {
      newErrors.url = 'URL is required';
    }

    if (type === 'document' && !selectedFile) {
      newErrors.file = 'Please select a local document';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      type,
      description: description.trim(),
      url: type === 'link' ? url.trim() : undefined,
      fileName: type === 'document' ? selectedFile?.name : undefined,
      fileSize: type === 'document' ? selectedFile?.size : undefined,
      content: type === 'note' ? content.trim() : undefined,
    });

    showToast('Resource shared to room', { type: 'success' });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setContent('');
    setSelectedFile(null);
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Share Resource"
      description="Pin links, documentation, or notes directly to this room."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resource Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setType('link')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border gap-1.5 transition ${
              type === 'link'
                ? 'border-[#5B5CE2] bg-[#EEF0FF]/50 dark:bg-zinc-800 text-[#5B5CE2]'
                : 'border-[#E8EAF0] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-[#737987]'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span className="text-xs font-semibold">Link / URL</span>
          </button>

          <button
            type="button"
            onClick={() => setType('document')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border gap-1.5 transition ${
              type === 'document'
                ? 'border-[#5B5CE2] bg-[#EEF0FF]/50 dark:bg-zinc-800 text-[#5B5CE2]'
                : 'border-[#E8EAF0] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-[#737987]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs font-semibold">Document</span>
          </button>

          <button
            type="button"
            onClick={() => setType('note')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border gap-1.5 transition ${
              type === 'note'
                ? 'border-[#5B5CE2] bg-[#EEF0FF]/50 dark:bg-zinc-800 text-[#5B5CE2]'
                : 'border-[#E8EAF0] dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-[#737987]'
            }`}
          >
            <StickyNote className="w-4 h-4" />
            <span className="text-xs font-semibold">Note</span>
          </button>
        </div>

        <Input
          label="Title"
          placeholder={
            type === 'link'
              ? 'e.g. Production API Spec'
              : type === 'document'
              ? 'e.g. Sprint Architecture Deck'
              : 'e.g. Standup Sync Notes'
          }
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          error={errors.title}
          required
        />

        {type === 'link' && (
          <Input
            label="URL Address"
            placeholder="https://..."
            leftIcon={<Link2 className="w-4 h-4" />}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
            }}
            error={errors.url}
            required
          />
        )}

        {type === 'document' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171923] dark:text-zinc-300">
              Select Document
            </label>
            <div className="border border-dashed border-[#E8EAF0] dark:border-zinc-800 rounded-xl p-4 text-center hover:border-[#5B5CE2]/50 transition bg-zinc-50/50 dark:bg-zinc-900/50">
              <input
                type="file"
                id="resource-file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resource-file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 border border-[#E8EAF0] dark:border-zinc-700 flex items-center justify-center text-[#5B5CE2]">
                  <Upload className="w-4 h-4" />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="text-xs font-semibold text-[#171923] dark:text-zinc-200">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-[#737987]">{selectedFile.size} (ready to pin)</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium text-[#171923] dark:text-zinc-200">
                      Click to choose local document
                    </p>
                    <p className="text-[11px] text-[#737987] dark:text-zinc-500">
                      PDF, DOCX, YAML, Markdown, JSON
                    </p>
                  </div>
                )}
              </label>
            </div>
            {errors.file && <p className="text-xs text-rose-500">{errors.file}</p>}
          </div>
        )}

        {type === 'note' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171923] dark:text-zinc-300">
              Note Content
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write concise team notes, instructions, or meeting points..."
              className="w-full text-sm bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl px-3.5 py-2 text-[#171923] dark:text-zinc-100 placeholder:text-[#737987]/70 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 focus:border-[#5B5CE2] transition"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#171923] dark:text-zinc-300">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Context or instructions for room members"
            className="w-full text-sm bg-white dark:bg-zinc-900 border border-[#E8EAF0] dark:border-zinc-800 rounded-xl px-3.5 py-2 text-[#171923] dark:text-zinc-100 placeholder:text-[#737987]/70 focus:outline-none focus:ring-2 focus:ring-[#5B5CE2]/20 focus:border-[#5B5CE2] transition"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8EAF0] dark:border-zinc-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Share Resource
          </Button>
        </div>
      </form>
    </Modal>
  );
};
