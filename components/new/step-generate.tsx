'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import type { Format, Plan } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { useVideo } from '@/lib/client/use-video';
import { videoStatusMeta, videoProgress } from '@/lib/status';
import { Scrubber } from '@/components/ui/scrubber';
import { Button } from '@/components/ui/button';
import { RecTimer } from '@/components/motion/rec-timer';
import { stageGradient } from '@/lib/thumb';

const STAGE_COPY: Record<string, string> = {
  queued: 'queued — waiting for a render slot',
  generating: 'generating — composing scenes from your brand',
  rendering: 'rendering — encoding the mp4',
  ready: 'done — opening your video',
  failed: 'render failed',
};

/** Шаг 4 — генерация + live-стадии. */
export function StepGenerate({
  videoId,
  format,
  plan,
  onRetry,
}: {
  videoId: string | null;
  format: Format;
  plan: Plan;
  onRetry: () => void;
}) {
  const router = useRouter();
  const { video, error } = useVideo(videoId);
  const status = video?.status ?? 'queued';
  const meta = videoStatusMeta(status);
  const aspect = format === '9:16' ? 'aspect-[9/16] max-w-[300px]' : 'aspect-video';

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
          'win-surface relative mx-auto overflow-hidden rounded-[var(--radius-card)] shadow-win',
          aspect,
        )}
        style={{ background: stageGradient(videoId ?? 'pending') }}
      >
        <RecTimer time="00:00:00" className="absolute left-4 top-4" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-[family-name:var(--font-mono)] text-[13px] text-white/70">
            {meta.label}
          </span>
        </div>
        <div className="absolute inset-x-5 bottom-5">
          <Scrubber value={videoProgress(status)} active onDark />
        </div>
      </div>

      <h2 className="display mt-7 text-2xl text-ink">{STAGE_COPY[status]}</h2>
      <p className="mt-2 text-sm text-muted">
        you’ll jump to your video the moment it’s ready — no need to wait here.
      </p>

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
