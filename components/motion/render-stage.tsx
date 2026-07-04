'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { RecTimer } from './rec-timer';

/**
 * Живой счётчик кадров (60fps-эквивалент от монтирования) — «машина реально
 * работает». Обновляем текст ~8 раз/с: дёшево, но цифры ощутимо бегут.
 */
function useFrameCounter(): string {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(start);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 125);
    return () => clearInterval(t);
  }, []);
  const frames = Math.floor(((now - start) / 1000) * 60) % 1_000_000;
  return String(frames).padStart(6, '0');
}

/** Уголки видоискателя: позиция + какие стороны рамки рисуем. */
const CORNERS = [
  'left-0 top-0 border-l border-t',
  'right-0 top-0 border-r border-t',
  'left-0 bottom-0 border-l border-b',
  'right-0 bottom-0 border-r border-b',
];

/** SVG-зерно плёнки (статичное, без анимации) — текстура, а не шум движения. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

/**
 * Бэкдроп идущего рендера: «камера на записи». Видоискатель (уголки рамки),
 * кольцо-объектив с бегущей ember-дугой, стадия + живой счётчик кадров, тонкое
 * плёночное зерно и медленно дышащее свечение снизу. Каждое движение осмысленно:
 * дуга = «работаю», счётчик = «кадры идут», дыхание = «живой». Чисто
 * презентационный (inset-0), под чипы статуса/скраббер родителя.
 * prefers-reduced-motion гасит CSS-анимации глобально (globals.css).
 */
export function RenderStage({
  label,
  time,
  compact = false,
  className,
}: {
  label: string;
  /** elapsed-таймер → REC-индикатор в HUD видоискателя (только полный вариант) */
  time?: string;
  /** мелкий вариант для thumbnail в гриде (без рамки/счётчика — там свой HUD) */
  compact?: boolean;
  className?: string;
}) {
  const frames = useFrameCounter();

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* дышащее ember-свечение у нижней кромки — единственный цветовой акцент фона */}
      <div
        className="absolute inset-x-[-20%] bottom-[-45%] aspect-[2/1] animate-[var(--animate-breathe)]"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,90,31,0.16), transparent 70%)',
        }}
      />

      {/* виньетка: мягко затемняем края — центр композиции держит фокус */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(115% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* плёночное зерно (статичное) */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* уголки видоискателя + REC в HUD (компакт несёт свой HUD в гриде) */}
      {!compact && (
        <>
          <div className="absolute inset-4">
            {CORNERS.map((c) => (
              <span key={c} className={cn('absolute size-4 border-white/25', c)} />
            ))}
          </div>
          {time !== undefined && (
            <RecTimer time={time} className="absolute left-7 top-6" />
          )}
        </>
      )}

      {/* центр: кольцо-объектив + стадия + счётчик кадров */}
      <div
        className={cn(
          'absolute inset-0 grid place-content-center justify-items-center',
          compact ? 'gap-2.5' : 'gap-4',
        )}
      >
        <div className={cn('relative', compact ? 'size-9' : 'size-16')}>
          {/* трек кольца */}
          <div className="absolute inset-0 rounded-full border border-white/12" />
          {/* бегущая ember-дуга (conic + radial-маска до тонкого кольца) */}
          <div
            className="absolute inset-[-1px] rounded-full animate-[var(--animate-lens)]"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0 72%, rgba(255,90,31,0.35) 80%, #FF5A1F 92%, #FF8C3C 100%)',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
              WebkitMask:
                'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))',
            }}
          />
          {/* зрачок объектива */}
          <div className="absolute inset-[34%] rounded-full bg-white/[0.07]" />
        </div>

        <div className="grid justify-items-center gap-1.5">
          <span
            className={cn(
              'font-[family-name:var(--font-mono)] tracking-[0.16em] text-white/80',
              compact ? 'text-[10px]' : 'text-[12px]',
            )}
          >
            {label}
          </span>
          {!compact && (
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-white/35 tabular-nums">
              fr {frames} · 60fps
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
