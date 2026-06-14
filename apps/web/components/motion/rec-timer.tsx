import { cn } from '@/lib/cn';

/** Фирменный REC-индикатор: пульсирующая ember-точка + mono-таймер. */
export function RecTimer({
  label = 'REC',
  time = '00:00:00',
  className,
}: {
  label?: string;
  time?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] text-ember',
        className,
      )}
    >
      <span className="size-[7px] animate-[var(--animate-rec)] rounded-full bg-ember" />
      {label} {time}
    </span>
  );
}
