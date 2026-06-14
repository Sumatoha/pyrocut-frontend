import { cn } from '@/lib/cn';

/** Белая карточка с хайрлайн-бордером и мягкой длинной тенью (§3). */
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-hair bg-paper shadow-lift',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
