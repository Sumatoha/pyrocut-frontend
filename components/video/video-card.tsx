'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Share2, Trash2 } from 'lucide-react';
import type { Video } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { api, ApiError } from '@/lib/client/api';
import { DEMO_MODE } from '@/lib/client/demo';
import { useSignedUrl, BUCKET_RENDERS } from '@/lib/client/storage';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { VideoThumb } from './video-thumb';

export function VideoCard({
  video,
  onDeleted,
  index = 0,
}: {
  video: Video;
  onDeleted: (id: string) => void;
  /** позиция в гриде — для каскадного появления (stagger). */
  index?: number;
}) {
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();
  const mp4Url = useSignedUrl(BUCKET_RENDERS, video.mp4Path);

  async function handleDelete() {
    setDeleting(true);
    if (DEMO_MODE) {
      onDeleted(video.id);
      toast.toast('video deleted (demo)');
      setConfirm(false);
      setDeleting(false);
      return;
    }
    try {
      await api.deleteVideo(video.id);
      onDeleted(video.id);
      toast.success('video deleted');
    } catch (e) {
      toast.error(
        'could not delete',
        e instanceof ApiError ? e.message : undefined,
      );
    } finally {
      setDeleting(false);
      setConfirm(false);
    }
  }

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/app/v/${video.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('link copied', url);
    } catch {
      toast.error('could not copy link');
    }
  }

  return (
    <>
      {/* каскад короткий: хвост грида не должен ждать >200мс до появления */}
      <div
        className="rise-in"
        style={{ animationDelay: `${Math.min(index, 7) * 30}ms` }}
      >
      <Card className="lift group relative overflow-hidden border-hair p-2.5 hover:-translate-y-1 hover:border-hair-strong hover:shadow-float">
        {/* ember click-ring акцент на hover */}
        <span className="pointer-events-none absolute right-5 top-5 z-10 size-2 rounded-full bg-ember opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:animate-[var(--animate-clickring)]" />

        <Link
          href={`/app/v/${video.id}`}
          aria-label={`open video ${video.id}`}
          className="block overflow-hidden rounded-[var(--radius-win)]"
        >
          <VideoThumb video={video} />
        </Link>

        {video.variationTitle && (
          <p className="truncate px-2 pt-2.5 text-[13px] text-ink">
            {video.variationTitle}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-3">
          <div className="flex flex-wrap gap-1.5">
            <Chip>{video.format}</Chip>
            <Chip tone="ember">{video.preset}</Chip>
            {video.recipe && <Chip>{video.recipe}</Chip>}
          </div>

          <div className="flex translate-y-1 items-center gap-0.5 opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)] focus-within:translate-y-0 focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
            {mp4Url && (
              <a
                href={mp4Url}
                download
                onClick={(e) => e.stopPropagation()}
                aria-label="download mp4"
                className={cn(
                  'grid size-8 place-items-center rounded-full text-ink2',
                  'transition-[background-color,color,transform] duration-200 hover:bg-black/[0.05] hover:text-ink active:scale-90',
                )}
              >
                <Download className="size-4" />
              </a>
            )}
            <button
              onClick={handleShare}
              aria-label="copy share link"
              className="grid size-8 place-items-center rounded-full text-ink2 transition-[background-color,color,transform] duration-200 hover:bg-black/[0.05] hover:text-ink active:scale-90"
            >
              <Share2 className="size-4" />
            </button>
            <button
              onClick={() => setConfirm(true)}
              aria-label="delete video"
              className="grid size-8 place-items-center rounded-full text-ink2 transition-[background-color,color,transform] duration-200 hover:bg-ember-soft hover:text-ember active:scale-90"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </Card>
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
    </>
  );
}
