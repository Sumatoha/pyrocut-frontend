import { cn } from '@/lib/cn';

/** Бренд-марка pyrocut (flame), как на лендинге. */
export function LogoMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="8" fill="#0D0C11" />
      <path
        d="M9.5 21.5 C 9 16 10.5 13 13.5 11 L 20 5.5 L 18 12.5 C 20.5 13.5 21.5 16.2 21.5 18.4 C 21.5 21 19 23.2 15.5 23.2 C 13 23.2 11 22.6 9.5 21.5 Z"
        fill="#FF5A1F"
      />
      <circle cx="20" cy="5.5" r="1.6" fill="#FF8C3C" />
    </svg>
  );
}

/** Лого + вордмарк. */
export function Wordmark({
  size = 26,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark size={size} />
      <span
        className="text-[18px] font-semibold tracking-[-0.02em] text-ink"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        pyrocut
      </span>
    </span>
  );
}
