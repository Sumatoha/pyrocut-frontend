import { cn } from '@/lib/cn';

/** Высота полос эквалайзера + задержки — «кадры собираются». */
const BARS = [0, 0.18, 0.36, 0.12, 0.3, 0.06, 0.24];

/**
 * Кинематографичный «живой» бэкдроп для идущего рендера: дрейфующее ember/violet
 * свечение + плёночная зернистость + сканирующий луч + эквалайзер «композим кадры».
 * Чисто презентационный, кладётся фоном (inset-0) под чипы статуса/скраббер.
 * prefers-reduced-motion гасит анимации глобально (globals.css).
 */
export function RenderStage({
  label,
  compact = false,
  className,
}: {
  label: string;
  /** мелкий вариант для thumbnail в гриде (меньше полосы/лейбл) */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* дрейфующие свечения */}
      <div
        className="absolute -left-1/4 top-[-30%] aspect-square w-2/3 rounded-full blur-3xl animate-[var(--animate-drift)]"
        style={{ background: 'radial-gradient(circle, rgba(255,90,31,0.45), transparent 70%)' }}
      />
      <div
        className="absolute -right-1/4 bottom-[-30%] aspect-square w-2/3 rounded-full blur-3xl animate-[var(--animate-drift)]"
        style={{
          background: 'radial-gradient(circle, rgba(109,74,255,0.4), transparent 70%)',
          animationDelay: '-6s',
        }}
      />

      {/* плёночная зернистость */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* сканирующий луч */}
      <div
        className="absolute inset-x-0 h-1/3 animate-[var(--animate-scanbeam)]"
        style={{
          background:
            'linear-gradient(180deg, transparent, rgba(255,255,255,0.10) 45%, rgba(255,140,60,0.18) 50%, rgba(255,255,255,0.10) 55%, transparent)',
        }}
      />

      {/* центр: эквалайзер «кадры собираются» + лейбл стадии */}
      <div className="absolute inset-0 grid place-content-center justify-items-center gap-3">
        <div
          className={cn(
            'flex items-end',
            compact ? 'h-7 gap-[3px]' : 'h-12 gap-[5px]',
          )}
        >
          {BARS.map((delay, i) => (
            <span
              key={i}
              className={cn(
                'brand-grad rounded-full origin-bottom animate-[var(--animate-eq)]',
                compact ? 'w-[3px]' : 'w-[5px]',
              )}
              style={{ height: '100%', animationDelay: `${-delay - i * 0.06}s` }}
            />
          ))}
        </div>
        <span
          className={cn(
            'font-[family-name:var(--font-mono)] tracking-[0.14em] text-white/75',
            compact ? 'text-[10px]' : 'text-[12px]',
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
