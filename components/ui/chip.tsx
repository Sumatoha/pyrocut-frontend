import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'ember' | 'dark' | 'win';

const tones: Record<Tone, string> = {
  neutral: 'bg-black/[0.04] text-ink2 border-hair',
  ember: 'bg-ember-soft text-ember border-transparent',
  dark: 'bg-ink text-white border-transparent',
  win: 'bg-white/10 text-white border-winline',
};

/** Mono-чип/бейдж (формат, пресет, мета). */
export function Chip({
  tone = 'neutral',
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
        'font-[family-name:var(--font-mono)] text-[11px] tracking-[0.04em]',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
