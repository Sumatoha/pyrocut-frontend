'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import type { Format, Plan } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { useVideo } from '@/lib/client/use-video';
import { useElapsed } from '@/lib/client/use-elapsed';
import { videoStatusMeta, videoProgress } from '@/lib/status';
import { Scrubber } from '@/components/ui/scrubber';
import { Button } from '@/components/ui/button';
import { RenderStage } from '@/components/motion/render-stage';
import { stageGradient } from '@/lib/thumb';

const STAGE_COPY: Record<string, string> = {
  queued: 'queued — waiting for a render slot',
  generating: 'generating — composing scenes from your brand',
  rendering: 'rendering — encoding the mp4',
  ready: 'done — opening your video',
  failed: 'render failed',
};

/**
 * Шаг 4 — генерация + live-стадии. Показывается СРАЗУ по клику generate
 * (videoId ещё null, POST в полёте) — фаза «starting». batchCount ≥ 2 —
 * батч: экран живёт, пока планировщик раскладывает вариации, потом /app.
 */
export function StepGenerate({
  videoId,
  format,
  plan,
  batchCount,
  onRetry,
}: {
  videoId: string | null;
  format: Format;
  plan: Plan;
  batchCount?: number | null;
  onRetry: () => void;
}) {
  const router = useRouter();
  const { video, error } = useVideo(videoId);
  const status = video?.status ?? 'queued';
  const meta = videoStatusMeta(status);
  const aspect = format === '9:16' ? 'aspect-[9/16] max-w-[300px]' : 'aspect-video';

  const batch = (batchCount ?? 0) >= 2;
  const starting = !batch && !videoId;

  // Таймер живой с первого кадра: до появления видео тикаем от монтирования экрана.
  const [mountedAt] = useState(() => new Date().toISOString());
  const elapsed = useElapsed(
    video?.createdAt ?? mountedAt,
    status !== 'ready' && status !== 'failed',
  );

  const stageLabel = batch ? 'planning' : starting ? 'starting' : meta.label;
  const heading = batch
    ? `composing ${batchCount} variations`
    : starting
      ? 'starting — briefing the studio'
      : STAGE_COPY[status];
  const subline = batch
    ? 'the director is picking mutually distinct cuts — you’ll land in your library where they render live.'
    : 'you’ll jump to your video the moment it’s ready — no need to wait here.';

  useEffect(() => {
    if (status === 'ready' && videoId) {
      const t = setTimeout(() => router.push(`/app/v/${videoId}`), 700);
      return () => clearTimeout(t);
    }
  }, [status, videoId, router]);

  if (error || status === 'failed') {
    return (
      <div className="mx-auto max-w-[460px] py-12 text-center">
        <AlertTriangle className="mx-auto size-7 text-ember" />
        <h2 className="display mt-4 text-2xl text-ink">render failed</h2>
        <p className="mt-2 text-sm text-muted">
          {video?.error ?? error ?? 'something went wrong on the render worker.'}
        </p>
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          <ArrowLeft className="size-4" /> tweak & retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] py-6 text-center">
      <div
        className={cn(
          'win-surface stage-in relative mx-auto overflow-hidden rounded-[var(--radius-card)] shadow-win',
          aspect,
        )}
        style={{ background: stageGradient(videoId ?? 'pending') }}
      >
        <RenderStage label={stageLabel} time={elapsed} />
        <div className="absolute inset-x-8 bottom-7">
          <Scrubber value={starting || batch ? 0.04 : videoProgress(status)} active onDark />
        </div>
      </div>

      <h2 className="display mt-7 text-2xl text-ink">{heading}</h2>
      <p className="mt-2 text-sm text-muted">{subline}</p>

      {plan === 'free' && (
        <div className="mx-auto mt-6 max-w-[420px] rounded-[14px] border border-hair bg-wash px-4 py-3 text-[12px] text-ink2">
          on the free plan your video carries a small pyrocut watermark.{' '}
          <a
            href="/app/billing"
            className="text-violet underline underline-offset-2"
          >
            upgrade to remove it →
          </a>
        </div>
      )}
    </div>
  );
}
