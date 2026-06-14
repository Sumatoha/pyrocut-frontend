import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

const STEPS = ['url', 'brand', 'format', 'render'] as const;

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="mx-auto flex max-w-[460px] items-center gap-2">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-medium transition-colors',
                done && 'ember-grad border-transparent text-white',
                active && 'border-ember text-ember',
                !done && !active && 'border-hair-strong text-faint',
              )}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                'microlabel',
                active ? 'text-ink' : done ? 'text-ink2' : 'text-faint',
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  'ml-1 h-px flex-1',
                  done ? 'bg-ember' : 'bg-hair',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
