import { cn } from '@/lib/cn';

/**
 * Ember-скраббер — фирменный индикатор прогресса рендера (вместо спиннера).
 * value: 0..1. active=true добавляет бегущий shimmer и playhead-точку.
 */
export function Scrubber({
  value,
  active = false,
  onDark = false,
  className,
}: {
  value: number;
  active?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full', className)}
      style={{ background: onDark ? 'var(--color-winline)' : 'var(--color-hair)' }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute inset-y-0 left-0 brand-grad rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
      {active && (
        <>
          {/* бегущий блик */}
          <div
            className="absolute inset-y-0 w-1/3 animate-[var(--animate-shimmer)]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
            }}
          />
          {/* playhead */}
          <div
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet shadow-[0_0_0_4px_rgba(109,74,255,0.2)] transition-[left] duration-700 ease-out"
            style={{ left: `${pct}%` }}
          />
        </>
      )}
    </div>
  );
}
