import { cn } from '@/lib/cn';

/**
 * Ember-каретка — сигнатурный жест pyrocut (paste url → watch it render).
 * Размеры в em → масштабируется вместе с font-size вордмарка. Мигает (steps).
 */
function Caret({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'ml-[0.1em] inline-block h-[0.86em] w-[0.085em] translate-y-[0.02em] rounded-[1px] bg-ember',
        'animate-[var(--animate-caret)]',
        className,
      )}
    />
  );
}

/**
 * Вордмарк pyrocut — JetBrains Mono/SF Mono, lowercase, та же гарнитура, что и UI,
 * + мигающая ember-каретка. size = font-size в px.
 */
export function Wordmark({
  size = 20,
  weight = 600,
  className,
}: {
  size?: number;
  weight?: number;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-flex items-baseline leading-none lowercase text-ink', className)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: size,
        fontWeight: weight,
        letterSpacing: '-0.015em',
      }}
    >
      pyrocut
      <Caret />
    </span>
  );
}

/**
 * Квадратная марка-иконка (app icon / inline): «p» + ember-каретка, монохром.
 * size = сторона в px. dark — тёмная плитка (по умолчанию), иначе светлая.
 */
export function LogoMark({
  size = 28,
  dark = true,
  className,
}: {
  size?: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-grid shrink-0 place-items-center overflow-hidden', className)}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: dark ? '#0B0814' : '#FFFFFF',
        border: dark ? undefined : '1px solid var(--color-hair)',
      }}
    >
      <span
        className="inline-flex items-center leading-none lowercase"
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          fontSize: size * 0.48,
          letterSpacing: '-0.02em',
          color: dark ? '#F4F2FA' : 'var(--color-ink)',
          transform: 'translateY(-0.04em)',
        }}
      >
        p
        <span
          aria-hidden="true"
          className="bg-ember"
          style={{
            marginLeft: size * 0.04,
            width: Math.max(2, size * 0.06),
            height: size * 0.3,
            borderRadius: 1,
          }}
        />
      </span>
    </span>
  );
}
