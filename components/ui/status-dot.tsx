import { cn } from '@/lib/cn';
import type { StatusTone } from '@/lib/status';

const colorFor: Record<StatusTone, string> = {
  idle: 'text-faint',
  active: 'text-ember',
  ready: 'text-ember',
  failed: 'text-muted',
};

/**
 * Статус-точка. При active=true — ember pulse (фирменный приём).
 * `currentColor` управляет цветом точки и pulse-ringom.
 */
export function StatusDot({
  tone,
  active,
  className,
}: {
  tone: StatusTone;
  active: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block size-2 rounded-full bg-current',
        colorFor[tone],
        active && 'animate-[var(--animate-statuspulse)]',
        tone === 'failed' && 'bg-transparent ring-1 ring-current',
        className,
      )}
      aria-hidden="true"
    />
  );
}
