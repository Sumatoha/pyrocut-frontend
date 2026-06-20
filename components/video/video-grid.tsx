'use client';

import Link from 'next/link';
import { AlertTriangle, Plus } from 'lucide-react';
import { useVideos } from '@/lib/client/use-videos';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { VideoCard } from './video-card';
import { EmptyState } from './empty-state';
import { VideosSkeleton } from './skeletons';

const GRID = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';

export function VideoGrid() {
  const { videos, loading, error, demo, reload, removeLocal } = useVideos();

  if (loading) return <VideosSkeleton />;

  if (error) {
    return (
      <Card className="mx-auto max-w-[460px] p-8 text-center">
        <AlertTriangle className="mx-auto size-7 text-ember" />
        <h2 className="mt-4 text-lg text-ink">couldn’t load your videos</h2>
        <p className="mt-2 text-[13px] text-muted">{error}</p>
        <Button variant="outline" className="mt-5" onClick={() => reload()}>
          try again
        </Button>
      </Card>
    );
  }

  if (!videos || videos.length === 0) return <EmptyState />;

  return (
    <div className="space-y-7">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="display text-3xl text-ink">your videos</h1>
          <span className="rounded-full border border-hair px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.04em] text-muted">
            {videos.length}
          </span>
          {demo && <Chip tone="ember">demo</Chip>}
        </div>
        <Link
          href="/app/new"
          className="hidden items-center gap-1.5 font-[family-name:var(--font-mono)] text-[13px] text-muted transition-colors hover:text-ink sm:inline-flex"
        >
          <Plus className="size-4" /> new
        </Link>
      </div>

      <div className={GRID}>
        {videos.map((v, i) => (
          <VideoCard key={v.id} video={v} index={i} onDeleted={removeLocal} />
        ))}
      </div>
    </div>
  );
}
