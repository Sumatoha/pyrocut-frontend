import { cn } from '@/lib/cn';

/** Скелетон загрузки. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-[var(--animate-skeleton)] rounded-[10px] bg-black/[0.06]',
        className,
      )}
      {...props}
    />
  );
}
