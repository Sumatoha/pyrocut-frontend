import { cn } from '@/lib/cn';

/** Скелетон загрузки. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'skeleton-sweep animate-[var(--animate-skeleton)] rounded-[10px]',
        className,
      )}
      {...props}
    />
  );
}
