'use client';

import { Play } from 'lucide-react';
import type { Video } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { stageGradient } from '@/lib/thumb';
import { videoStatusMeta, videoProgress } from '@/lib/status';
import { useSignedUrl, BUCKET_RENDERS } from '@/lib/client/storage';
import { Scrubber } from '@/components/ui/scrubber';
import { StatusBadge } from '@/components/ui/status-badge';
import { RecTimer } from '@/components/motion/rec-timer';

/**
 * Тёмный thumbnail-герой. Реальный thumbPath → signed URL → <img>; иначе
 * кинематографичный backdrop. Снизу — ember-скраббер для идущих стадий.
 */
export function VideoThumb({
  video,
  className,
}: {
  video: Video;
  className?: string;
}) {
  const meta = videoStatusMeta(video.status);
  const aspect = video.format === '9:16' ? 'aspect-[9/16]' : 'aspect-video';
  const thumbUrl = useSignedUrl(BUCKET_RENDERS, video.thumbPath);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-win)] border border-winline',
        aspect,
        className,
      )}
      style={
        thumbUrl ? undefined : { background: stageGradient(video.id) }
      }
    >
      {thumbUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {/* лёгкая зернистость/точки как на лендинге */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* верх: статус / REC */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
        <StatusBadge meta={meta} onDark />
        {meta.active && <RecTimer time="00:00:00" />}
      </div>

      {/* центр: play для готового */}
      {video.status === 'ready' && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid size-12 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
            <Play className="size-5 translate-x-px fill-white" />
          </span>
        </div>
      )}

      {/* низ: скраббер прогресса для идущих стадий */}
      {meta.active && (
        <div className="absolute inset-x-3 bottom-3">
          <Scrubber value={videoProgress(video.status)} active onDark />
        </div>
      )}

      {video.status === 'failed' && (
        <div className="absolute inset-x-3 bottom-3 text-[11px] text-white/70">
          {video.error ?? 'render failed'}
        </div>
      )}
    </div>
  );
}
