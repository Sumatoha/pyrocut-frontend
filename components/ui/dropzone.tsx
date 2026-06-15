'use client';

import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Дропзона под скрины/лого. Нативный drag + file input, без доп-зависимостей. */
export function Dropzone({
  onFiles,
  accept = 'image/*',
  multiple = true,
  hint = 'drop images or click to upload',
  className,
  disabled = false,
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  hint?: string;
  className?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function handle(list: FileList | null) {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!disabled) handle(e.dataTransfer.files);
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-win)] border border-dashed px-6 py-8 text-center transition-colors',
        over ? 'border-violet bg-violet-soft/50' : 'border-hair-strong bg-wash',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <UploadCloud
        className={cn('size-6', over ? 'text-violet' : 'text-muted')}
      />
      <p className="text-[13px] text-ink2">{hint}</p>
      <p className="microlabel">png · jpg · svg</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
