import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const GRID = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3';

/** Скелет сетки видео. Общий для route-loading и клиентской загрузки списка. */
export function VideosSkeleton() {
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

/** Скелет страницы видео. Общий для route-loading и клиентской загрузки. */
export function VideoDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-5 w-24" />
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <Skeleton className="aspect-video w-full rounded-[var(--radius-card)]" />
        <div className="space-y-3">
          <Skeleton className="h-9 w-full rounded-full" />
          <Skeleton className="h-9 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
