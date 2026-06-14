import { cn } from '@/lib/cn';
import type { StatusMeta } from '@/lib/status';
import { StatusDot } from './status-dot';

/** Точка статуса + mono-лейбл стадии. */
export function StatusBadge({
  meta,
  className,
  onDark = false,
}: {
  meta: StatusMeta;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em]',
        onDark ? 'text-white/80' : 'text-ink2',
        className,
      )}
    >
      <StatusDot tone={meta.tone} active={meta.active} />
      {meta.label}
    </span>
  );
}
