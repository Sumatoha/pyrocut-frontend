'use client';

import { Play } from 'lucide-react';
import type { Video } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { stageGradient } from '@/lib/thumb';
import { videoStatusMeta, videoProgress } from '@/lib/status';
import { useSignedUrl, BUCKET_RENDERS } from '@/lib/client/storage';
import { useElapsed } from '@/lib/client/use-elapsed';
import { Scrubber } from '@/components/ui/scrubber';
import { StatusBadge } from '@/components/ui/status-badge';
import { RecTimer } from '@/components/motion/rec-timer';
import { RenderStage } from '@/components/motion/render-stage';

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
  const elapsed = useElapsed(video.createdAt, meta.active);
  const rendering = meta.active && !thumbUrl;

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
          className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        />
      )}

      {/* идёт рендер (нет кадра) → живой кинематографичный бэкдроп */}
      {rendering && <RenderStage label={meta.label} compact />}

      {/* лёгкая зернистость/точки как на лендинге */}
      {!rendering && (
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      )}

      {/* нижний скрим — читаемость статуса/скраббера поверх любого кадра */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent opacity-80" />

      {/* диагональный блик при наведении */}
      <span className="sheen -translate-x-[130%] transition-transform duration-[850ms] ease-[var(--ease-out-soft)] group-hover:translate-x-[130%]" />

      {/* верх: статус / REC */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
        <StatusBadge meta={meta} onDark />
        {meta.active && <RecTimer time={elapsed} />}
      </div>

      {/* центр: play для готового */}
      {video.status === 'ready' && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid size-12 place-items-center rounded-full bg-white/15 text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] ring-1 ring-white/25 backdrop-blur-md transition-all duration-300 ease-[var(--ease-spring)] group-hover:scale-110 group-hover:bg-white/25">
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
