'use client';

import { AlertTriangle } from 'lucide-react';
import { useVideos } from '@/lib/client/use-videos';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { VideoCard } from './video-card';
import { EmptyState } from './empty-state';

const GRID = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';

export function VideoGrid() {
  const { videos, loading, error, demo, reload, removeLocal } = useVideos();

  if (loading) return <GridSkeleton />;

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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="display text-2xl text-ink">your videos</h1>
        <span className="microlabel">{videos.length} cuts</span>
        {demo && <Chip tone="ember">demo</Chip>}
      </div>

      <div className={GRID}>
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} onDeleted={removeLocal} />
        ))}
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-40" />
      <div className={GRID}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="space-y-3 p-2.5">
            <Skeleton className="aspect-video w-full rounded-[var(--radius-win)]" />
            <div className="flex gap-2 px-1.5 pb-1">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
