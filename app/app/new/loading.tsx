import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-[820px] space-y-6">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-[420px] w-full rounded-[var(--radius-card)]" />
    </div>
  );
}
