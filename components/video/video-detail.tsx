'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Shuffle,
  Ratio,
  Play,
  Wand2,
} from 'lucide-react';
import type { Format, Preset } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { api, ApiError } from '@/lib/client/api';
import { DEMO_MODE } from '@/lib/client/demo';
import { useVideo } from '@/lib/client/use-video';
import { useProjectVideos } from '@/lib/client/use-project-videos';
import {
  useSignedUrl,
  BUCKET_RENDERS,
  BUCKET_COMPOSITIONS,
} from '@/lib/client/storage';
import { videoStatusMeta, videoProgress } from '@/lib/status';
import { stageGradient } from '@/lib/thumb';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Modal } from '@/components/ui/modal';
import { Scrubber } from '@/components/ui/scrubber';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/components/ui/toast';
import { RecTimer } from '@/components/motion/rec-timer';
import { RenderStage } from '@/components/motion/render-stage';
import { useElapsed } from '@/lib/client/use-elapsed';
import { VideoThumb } from './video-thumb';
import { VideoDetailSkeleton } from './skeletons';
import { CompositionPreview } from './composition-preview';

const isReal = (p?: string | null): p is string =>
  Boolean(p) && p !== 'about:blank';

/** Сколько вариаций создаёт кнопка remix. */
const REMIX_COUNT = 3;

export function VideoDetail({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const { video, error } = useVideo(id);
  const siblings = useProjectVideos(video?.projectId ?? null, id);

  // storage-пути приватные → подписываем (хуки до ранних return'ов).
  const mp4Url = useSignedUrl(BUCKET_RENDERS, video?.mp4Path);
  const compositionUrl = useSignedUrl(BUCKET_COMPOSITIONS, video?.compositionPath);
  const thumbUrl = useSignedUrl(BUCKET_RENDERS, video?.thumbPath);
  // Отдельная ссылка с ?download= → content-disposition: attachment (иначе Safari
  // открывает mp4 в новой вкладке — <a download> для cross-origin игнорируется).
  const downloadName = `pyrocut-${id.slice(0, 8)}.mp4`;
  const downloadUrl = useSignedUrl(BUCKET_RENDERS, video?.mp4Path, downloadName);

  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [varying, setVarying] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [editing, setEditing] = useState(false);

  const elapsed = useElapsed(
    video?.createdAt,
    !!video && videoStatusMeta(video.status).active,
  );

  if (error) {
    return (
      <div className="py-20 text-center">
        <h1 className="display text-2xl text-ink">video not found</h1>
        <p className="mt-2 text-sm text-muted">{error}</p>
        <Link href="/app" className="mt-6 inline-block text-sm text-violet underline">
          back to videos
        </Link>
      </div>
    );
  }

  if (!video) return <VideoDetailSkeleton />;

  const meta = videoStatusMeta(video.status);
  const aspect =
    video.format === '9:16' ? 'aspect-[9/16] max-w-[360px]' : 'aspect-video';

  async function handleDelete() {
    setDeleting(true);
    if (DEMO_MODE) {
      router.push('/app');
      return;
    }
    try {
      await api.deleteVideo(id);
      router.push('/app');
    } catch (e) {
      setDeleting(false);
      setConfirm(false);
      alert(e instanceof ApiError ? e.message : 'could not delete');
    }
  }

  async function makeVariation(format: Format, preset: Preset) {
    if (!video) return;
    setVarying(true);
    try {
      if (DEMO_MODE) {
        router.push(`/app/v/demo-${format}-${preset}`);
        return;
      }
      const v = await api.createVideo({
        projectId: video.projectId,
        format,
        preset,
      });
      router.push(`/app/v/${v.id}`);
    } catch (e) {
      setVarying(false);
      if (e instanceof ApiError && e.isPaymentRequired) {
        router.push('/app/billing');
        return;
      }
      toast.error(
        'could not create variation',
        e instanceof ApiError ? e.message : undefined,
      );
    }
  }

  // Ремикс: батч N взаимно-различных вариаций (планировщик подбирает стили/рецепты).
  async function makeBatch() {
    if (!video) return;
    setVarying(true);
    try {
      if (DEMO_MODE) {
        router.push('/app');
        return;
      }
      await api.createVideosBatch({
        projectId: video.projectId,
        format: video.format,
        count: REMIX_COUNT,
      });
      toast.success('on it', `composing ${REMIX_COUNT} fresh cuts`);
      router.push('/app');
    } catch (e) {
      setVarying(false);
      if (e instanceof ApiError && e.isPaymentRequired) {
        router.push('/app/billing');
        return;
      }
      toast.error(
        'could not remix',
        e instanceof ApiError ? e.message : undefined,
      );
    }
  }

  // Точечная AI-правка: «исправь вот это». Статус ре-рендера ловит useVideo (realtime/поллинг).
  async function requestEdit() {
    if (!video) return;
    const text = instruction.trim();
    if (text.length < 3) return;
    setEditing(true);
    try {
      if (DEMO_MODE) {
        toast.success('on it', 'applying your fix');
        setInstruction('');
        return;
      }
      await api.editVideo(id, { instruction: text });
      toast.success('on it', 'applying your fix — preview updates live');
      setInstruction('');
    } catch (e) {
      if (e instanceof ApiError && e.isPaymentRequired) {
        router.push('/app/billing');
        return;
      }
      toast.error(
        'could not apply fix',
        e instanceof ApiError ? e.message : undefined,
      );
    } finally {
      setEditing(false);
    }
  }

  const otherFormat: Format = video.format === '16:9' ? '9:16' : '16:9';

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('link copied', window.location.href);
    } catch {
      toast.error('could not copy link');
    }
  }

  return (
    <div className="rise-in space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" /> videos
        </Link>
        <div className="flex items-center gap-2">
          <Chip>{video.format}</Chip>
          <Chip tone="ember">{video.preset}</Chip>
          {video.recipe && <Chip>{video.recipe}</Chip>}
          <StatusBadge meta={meta} className="ml-1" />
        </div>
      </div>

      {/* preview */}
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="mx-auto w-full">
          <div
            className={cn(
              'win-surface relative mx-auto overflow-hidden rounded-[var(--radius-card)] shadow-win',
              aspect,
            )}
            style={
              isReal(thumbUrl) || isReal(compositionUrl)
                ? undefined
                : { background: stageGradient(video.id) }
            }
          >
            {isReal(mp4Url) ? (
              <video
                src={mp4Url ?? undefined}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 size-full bg-black object-contain"
              />
            ) : isReal(compositionUrl) ? (
              <CompositionPreview url={compositionUrl} />
            ) : (
              <>
                {meta.active ? (
                  <RenderStage label={meta.label} />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    {video.status === 'ready' ? (
                      <span className="grid size-14 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                        <Play className="size-6 translate-x-0.5 fill-white" />
                      </span>
                    ) : (
                      <span className="font-[family-name:var(--font-mono)] text-[13px] text-white/70">
                        {meta.label}
                      </span>
                    )}
                  </div>
                )}
                {meta.active && (
                  <>
                    <RecTimer time={elapsed} className="absolute left-4 top-4" />
                    <div className="absolute inset-x-5 bottom-5">
                      <Scrubber value={videoProgress(video.status)} active onDark />
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* live preview note + actions */}
          <div className="mx-auto mt-4 flex max-w-[640px] flex-wrap items-center justify-between gap-3">
            <p className="microlabel">
              {isReal(mp4Url)
                ? 'final mp4'
                : isReal(compositionUrl)
                  ? 'live preview · plays in your browser'
                  : video.status === 'ready'
                    ? 'final mp4'
                    : 'rendering — preview appears as soon as it’s composed'}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={copyShare}>
                <Share2 className="size-4" /> share
              </Button>
              {isReal(downloadUrl) && (
                <a
                  href={downloadUrl ?? undefined}
                  download={downloadName}
                  className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] text-white brand-grad"
                >
                  <Download className="size-4" /> download mp4
                </a>
              )}
            </div>
          </div>
        </div>

        {/* variations */}
        <aside className="space-y-4">
          <h2 className="microlabel">variations · one brand → many cuts</h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              loading={varying}
              onClick={() => makeVariation(otherFormat, video.preset)}
            >
              <Ratio className="size-4" /> make {otherFormat} version
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              loading={varying}
              onClick={makeBatch}
            >
              <Shuffle className="size-4" /> remix · {REMIX_COUNT} fresh cuts
            </Button>
          </div>

          {video.status === 'ready' && (
            <div className="space-y-2 border-t border-hair pt-4">
              <h2 className="microlabel">ask for a fix</h2>
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={3}
                maxLength={600}
                placeholder="e.g. ‘the headline overlaps the logo — move it down’"
                className="w-full resize-none rounded-[var(--radius-win)] border border-hair-strong bg-paper p-3 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-violet"
              />
              <Button
                size="sm"
                className="w-full justify-center"
                loading={editing}
                disabled={instruction.trim().length < 3}
                onClick={requestEdit}
              >
                <Wand2 className="size-4" /> apply fix
              </Button>
              <p className="text-[12px] text-muted">
                first fix free · then 1 credit. keeps the best version.
              </p>
            </div>
          )}

          {siblings.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {siblings.map((s) => (
                <Link key={s.id} href={`/app/v/${s.id}`} className="group block">
                  <VideoThumb video={s} className="!aspect-video" />
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <Chip>{s.format}</Chip>
                    <Chip tone="ember">{s.preset}</Chip>
                    {s.recipe && <Chip>{s.recipe}</Chip>}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <button
            onClick={() => setConfirm(true)}
            className="inline-flex items-center gap-2 pt-2 text-[13px] text-muted transition-colors hover:text-ember"
          >
            <Trash2 className="size-4" /> delete this cut
          </button>
        </aside>
      </div>

      <Modal
        open={confirm}
        onOpenChange={setConfirm}
        title="delete this video?"
        description="this can’t be undone. the source project stays — you can re-cut anytime."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              delete
            </Button>
          </>
        }
      />
    </div>
  );
}

