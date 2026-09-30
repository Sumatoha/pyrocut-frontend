'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import type { ProjectStatus } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { RecTimer } from '@/components/motion/rec-timer';
import { StatusDot } from '@/components/ui/status-dot';

export type ScanStageState = 'done' | 'active' | 'pending';

export interface ScanStage {
  key: string;
  label: string;
  hint: string;
  state: ScanStageState;
}

/** Стадии скрейпа и секунда, с которой стадия обычно начинается (по логам воркера). */
const STAGES = [
  { key: 'open', label: 'opening the page', hint: 'real browser, real viewport', at: 0 },
  { key: 'shot', label: 'screenshot captured', hint: 'hero + full page', at: 12 },
  { key: 'palette', label: 'extracting palette & fonts', hint: 'from css and pixels', at: 16 },
  { key: 'copy', label: 'reading the copy', hint: 'headline, cta, sections', at: 22 },
  { key: 'visuals', label: 'finding real product shots', hint: 'dashboards, screens, charts', at: 34 },
  { key: 'brief', label: 'writing the creative brief', hint: 'mood, motion, story beats', at: 48 },
] as const;

const TYPICAL_SECONDS = '45–90 s';
/** После этого порога честно говорим, что страница тяжёлая. */
const SLOW_AFTER_SECONDS = 150;
const TIP_INTERVAL_MS = 7000;

const TIPS = [
  'next up: you confirm colors, headline and cta — takes ten seconds',
  'real product shots get cropped from your page and animated in the video',
  'five looks to pick from: dolly · snapcut · editorial · kinetic · terminal',
  'generate up to 6 variations at once — each with its own structure',
];

/**
 * Стадия k «done», когда прошла отметка следующей стадии; скриншот — ещё и когда
 * он реально пришёл (частичный brand от воркера). Последняя стадия закрывается
 * только сменой status → ready (родитель переключает экран).
 */
export function scanStages(elapsedSec: number, hasShot: boolean): ScanStage[] {
  const doneAt = (i: number) =>
    i < STAGES.length - 1 && elapsedSec >= STAGES[i + 1]!.at;
  const isDone = (i: number) =>
    STAGES[i]!.key === 'shot' ? hasShot || doneAt(i) : doneAt(i);

  const doneFlags = STAGES.map((_, i) => isDone(i));
  const activeIndex = doneFlags.findIndex((d) => !d);

  return STAGES.map((s, i) => ({
    key: s.key,
    label: s.label,
    hint: s.hint,
    state: doneFlags[i] ? 'done' : i === activeIndex ? 'active' : 'pending',
  }));
}

function useSeconds(startIso: string | undefined): number {
  const [mountedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const start = startIso ? new Date(startIso).getTime() : mountedAt;
  return Math.max(0, Math.floor((now - (Number.isFinite(start) ? start : mountedAt)) / 1000));
}

function fmtClock(sec: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:${pad(Math.floor(sec / 60) % 60)}:${pad(sec % 60)}`;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

const CORNERS = [
  'left-2 top-2 border-l border-t',
  'right-2 top-2 border-r border-t',
  'left-2 bottom-2 border-l border-b',
  'right-2 bottom-2 border-r border-b',
];

/** Каркас лендинга, пока скрина ещё нет: nav, заголовок, cta, три карточки. */
function Wireframe() {
  return (
    <div className="absolute inset-0 p-[7%]" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="h-2 w-[14%] rounded-full bg-white/15" />
        <span className="flex gap-2">
          <span className="h-2 w-8 rounded-full bg-white/10" />
          <span className="h-2 w-8 rounded-full bg-white/10" />
          <span className="h-2 w-8 rounded-full bg-white/10" />
        </span>
      </div>
      <div className="mt-[11%] space-y-2.5">
        <span className="block h-4 w-[62%] rounded-md bg-white/20" />
        <span className="block h-4 w-[44%] rounded-md bg-white/20" />
        <span className="mt-4 block h-2 w-[52%] rounded-full bg-white/10" />
        <span className="mt-4 block h-6 w-[18%] rounded-md bg-ember/50" />
      </div>
      <div className="mt-[10%] grid grid-cols-3 gap-3">
        <span className="aspect-[4/3] rounded-lg bg-white/[0.07]" />
        <span className="aspect-[4/3] rounded-lg bg-white/[0.07]" />
        <span className="aspect-[4/3] rounded-lg bg-white/[0.07]" />
      </div>
    </div>
  );
}

/**
 * Экран ожидания анализа бренда. Держит внимание: живой «сканер» над страницей
 * (реальный скрин появляется, как только воркер его снял), стадии с таймингом,
 * REC-таймер, ротация подсказок о следующем шаге. Всё — по мотивам дизайна:
 * тёмная поверхность-герой, ember дозированно, mono для статусов.
 */
export function BrandScan({
  url,
  status,
  screenshotUrl,
  startedAt,
  onBack,
}: {
  url: string;
  status: ProjectStatus;
  screenshotUrl: string | null;
  startedAt?: string;
  onBack: () => void;
}) {
  const seconds = useSeconds(startedAt);
  const [shotLoaded, setShotLoaded] = useState(false);
  const shotRef = useRef<HTMLImageElement>(null);
  // Картинка из кеша может загрузиться до гидрации — onLoad тогда не стреляет.
  useEffect(() => {
    setShotLoaded(false);
    const img = shotRef.current;
    if (img && img.complete && img.naturalWidth > 0) setShotLoaded(true);
  }, [screenshotUrl]);
  const stages = scanStages(seconds, shotLoaded);
  const tip = TIPS[Math.floor((seconds * 1000) / TIP_INTERVAL_MS) % TIPS.length];
  const slow = seconds > SLOW_AFTER_SECONDS;
  const queued = status === 'pending';

  return (
    <div className="mx-auto max-w-[640px]">
      <div className="text-center">
        <h2 className="display text-3xl text-ink">reading your brand…</h2>
        <p className="mx-auto mt-2 max-w-[420px] text-sm text-muted">
          {shotLoaded
            ? 'got your page — now reading colors, copy and product shots.'
            : 'opening the page in a real browser and taking it apart.'}
        </p>
      </div>

      {/* окно сканера */}
      <div className="win-surface relative mx-auto mt-7 aspect-[16/10] w-full max-w-[560px] overflow-hidden rounded-[var(--radius-card)] shadow-win">
        <div className="flex h-8 items-center gap-2 border-b border-winline px-3">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
          </span>
          <span className="mx-auto max-w-[70%] truncate rounded-full bg-white/[0.06] px-3 py-0.5 font-[family-name:var(--font-mono)] text-[11px] text-white/70">
            {hostOf(url)}
          </span>
        </div>

        <div className="relative h-[calc(100%-2rem)]">
          {!shotLoaded && <Wireframe />}
          {screenshotUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={shotRef}
              src={screenshotUrl}
              alt=""
              onLoad={() => setShotLoaded(true)}
              className={cn(
                'absolute inset-0 size-full object-cover object-top transition-opacity duration-700',
                shotLoaded ? 'opacity-100' : 'opacity-0',
              )}
            />
          )}

          {/* ember-луч сканера */}
          <div
            className="pointer-events-none absolute inset-x-0 h-[22%] animate-[var(--animate-scan)]"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(255,90,31,0.10) 60%, rgba(255,140,60,0.55) 97%, rgba(255,200,150,0.95) 100%)',
            }}
            aria-hidden="true"
          />

          {/* видоискатель */}
          {CORNERS.map((c) => (
            <span
              key={c}
              className={cn('pointer-events-none absolute size-4 border-white/35', c)}
              aria-hidden="true"
            />
          ))}

          {/* HUD */}
          <RecTimer
            label={queued ? 'QUEUE' : 'SCAN'}
            time={fmtClock(seconds)}
            className="absolute left-4 top-4 drop-shadow"
          />
          <span className="absolute right-4 top-4 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em] text-white/70">
            {queued ? 'waiting for a slot' : 'analyzing'}
          </span>
        </div>
      </div>

      {/* стадии */}
      <ol className="mx-auto mt-6 max-w-[440px] space-y-2">
        {stages.map((s) => (
          <li
            key={s.key}
            className={cn(
              'flex items-center gap-3 text-[14px] transition-colors duration-300',
              s.state === 'pending' ? 'text-faint' : 'text-ink',
            )}
          >
            <span className="grid size-5 shrink-0 place-items-center">
              {s.state === 'done' && (
                <span className="grid size-[18px] place-items-center rounded-full bg-violet text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
              {s.state === 'active' && <StatusDot tone="active" active />}
              {s.state === 'pending' && (
                <span className="size-2 rounded-full ring-1 ring-hair-strong" />
              )}
            </span>
            <span className={cn(s.state === 'done' && 'text-ink2')}>{s.label}</span>
            {s.state === 'active' && (
              <span className="ml-auto font-[family-name:var(--font-mono)] text-[11px] text-muted">
                {s.hint}
              </span>
            )}
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-6 max-w-[440px] text-center text-[12px] leading-relaxed text-muted">
        {slow
          ? 'taking longer than usual — heavy page or a slow host. still working.'
          : `usually ${TYPICAL_SECONDS}. keep this tab open — it switches to your brand the moment it’s ready.`}
      </p>
      <p
        key={tip}
        className="rise-in mx-auto mt-2 max-w-[440px] text-center text-[12px] text-faint"
      >
        {tip}
      </p>

      <div className="mt-6 flex justify-center">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" /> another url
        </Button>
      </div>
    </div>
  );
}
