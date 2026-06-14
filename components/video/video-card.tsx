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
}: {
  video: Video;
  onDeleted: (id: string) => void;
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
    const url = `${window.location.origin}/v/${video.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('link copied', url);
    } catch {
      toast.error('could not copy link');
    }
  }

  return (
    <>
      <Card className="group relative overflow-hidden p-2.5 transition-shadow hover:shadow-pop">
        {/* ember click-ring акцент на hover */}
        <span className="pointer-events-none absolute right-5 top-5 z-10 size-2 rounded-full bg-ember opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:animate-[var(--animate-clickring)]" />

        <Link href={`/v/${video.id}`} aria-label={`open video ${video.id}`}>
          <VideoThumb video={video} />
        </Link>

        <div className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-3">
          <div className="flex flex-wrap gap-1.5">
            <Chip>{video.format}</Chip>
            <Chip tone="ember">{video.preset}</Chip>
          </div>

          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {mp4Url && (
              <a
                href={mp4Url}
                download
                onClick={(e) => e.stopPropagation()}
                aria-label="download mp4"
                className={cn(
                  'grid size-8 place-items-center rounded-full text-ink2',
                  'transition-colors hover:bg-black/[0.05] hover:text-ink',
                )}
              >
                <Download className="size-4" />
              </a>
            )}
            <button
              onClick={handleShare}
              aria-label="copy share link"
              className="grid size-8 place-items-center rounded-full text-ink2 transition-colors hover:bg-black/[0.05] hover:text-ink"
            >
              <Share2 className="size-4" />
            </button>
            <button
              onClick={() => setConfirm(true)}
              aria-label="delete video"
              className="grid size-8 place-items-center rounded-full text-ink2 transition-colors hover:bg-ember-soft hover:text-ember"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </Card>

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
