'use client';

import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Format, Preset } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

const FORMAT_INFO: Record<Format, { title: string; blurb: string; box: string }> =
  {
    '16:9': {
      title: 'launch teaser',
      blurb: 'landing · demo · pitch',
      box: 'w-28 h-16',
    },
    '9:16': {
      title: 'social reel',
      blurb: 'reels · product hunt · stories',
      box: 'w-12 h-[88px]',
    },
  };

const PRESET_INFO: Record<
  Preset,
  { title: string; blurb: string; bars: number[] }
> = {
  dolly: {
    title: 'dolly',
    blurb: 'smooth camera tour — glides between beats',
    bars: [30, 55, 80, 95, 70],
  },
  snapcut: {
    title: 'snapcut',
    blurb: 'hard beat-cuts, punchy and sexy',
    bars: [90, 20, 95, 35, 88],
  },
  editorial: {
    title: 'editorial',
    blurb: 'quiet, lots of air — lets it breathe',
    bars: [40, 45, 42, 48, 44],
  },
  neon: {
    title: 'neon',
    blurb: 'glow, contrast, retro-future pulse',
    bars: [85, 40, 95, 60, 90],
  },
  kinetic: {
    title: 'kinetic',
    blurb: 'kinetic type — words snap and fly',
    bars: [95, 30, 85, 45, 100],
  },
  glass: {
    title: 'glass',
    blurb: 'frosted, soft depth, gentle drift',
    bars: [50, 60, 55, 66, 58],
  },
  terminal: {
    title: 'terminal',
    blurb: 'mono, type-on, dev-tool energy',
    bars: [100, 100, 30, 100, 30],
  },
  liquid: {
    title: 'liquid',
    blurb: 'fluid morphs, organic easing',
    bars: [40, 72, 54, 82, 48],
  },
};

/** Сколько вариаций за раз. 1 = точный одиночный пресет; 2-6 = батч с авто-разнообразием. */
const COUNTS = [1, 2, 3, 4, 5, 6] as const;

/** Шаг 3 — формат + кол-во вариаций (+ пресет для одиночной) + опц. бриф. */
export function StepFormat({
  onBack,
  onGenerate,
  generating,
}: {
  onBack: () => void;
  onGenerate: (
    format: Format,
    count: number,
    preset: Preset,
    prompt: string,
  ) => void;
  generating: boolean;
}) {
  const [format, setFormat] = useState<Format>('16:9');
  const [count, setCount] = useState<number>(3);
  const [preset, setPreset] = useState<Preset>('dolly');
  const [prompt, setPrompt] = useState('');

  const single = count === 1;

  return (
    <div className="mx-auto max-w-[760px] space-y-8">
      <div className="text-center">
        <h2 className="display text-3xl text-ink">pick the cut</h2>
        <p className="mx-auto mt-2 max-w-[420px] text-sm text-muted">
          same brand, different feel. you can make more variations later.
        </p>
      </div>

      {/* format */}
      <fieldset>
        <legend className="microlabel mb-3">format</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(FORMAT_INFO) as Format[]).map((f) => {
            const info = FORMAT_INFO[f];
            const sel = format === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                aria-pressed={sel}
                className={cn(
                  'flex items-center gap-4 rounded-[var(--radius-card)] border p-5 text-left transition-colors',
                  sel
                    ? 'border-violet bg-violet-soft/50'
                    : 'border-hair hover:border-hair-strong',
                )}
              >
                <span className="grid h-[100px] w-[120px] shrink-0 place-items-center">
                  <span
                    className={cn(
                      'rounded-[6px] border-2 transition-colors',
                      info.box,
                      sel ? 'border-violet bg-win' : 'border-hair-strong bg-wash',
                    )}
                  />
                </span>
                <span>
                  <span className="block font-[family-name:var(--font-mono)] text-sm text-ink">
                    {f}
                  </span>
                  <span className="mt-0.5 block text-[15px] text-ink">
                    {info.title}
                  </span>
                  <span className="microlabel mt-1 block">{info.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* how many variations */}
      <fieldset>
        <legend className="microlabel mb-3">how many variations</legend>
        <div className="flex flex-wrap gap-2">
          {COUNTS.map((n) => {
            const sel = count === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                aria-pressed={sel}
                className={cn(
                  'h-11 w-11 rounded-[12px] border font-[family-name:var(--font-mono)] text-sm transition-colors',
                  sel
                    ? 'border-violet bg-violet-soft/50 text-violet'
                    : 'border-hair text-ink2 hover:border-hair-strong',
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[12px] leading-snug text-muted">
          {single
            ? 'one cut — you pick the exact style below.'
            : `we’ll auto-pick ${count} distinct cuts — different styles & structures, all on your brand.`}
        </p>
      </fieldset>

      {/* preset — только для одиночной генерации; батч сам подбирает разнообразие */}
      {single && (
      <fieldset>
        <legend className="microlabel mb-3">edit preset</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {(Object.keys(PRESET_INFO) as Preset[]).map((p) => {
            const info = PRESET_INFO[p];
            const sel = preset === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPreset(p)}
                aria-pressed={sel}
                className={cn(
                  'flex flex-col gap-3 rounded-[var(--radius-card)] border p-4 text-left transition-colors',
                  sel
                    ? 'border-violet bg-violet-soft/50'
                    : 'border-hair hover:border-hair-strong',
                )}
              >
                <span className="win-surface flex h-16 items-end gap-1.5 rounded-[12px] p-3">
                  {info.bars.map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        'flex-1 rounded-sm',
                        sel ? 'brand-grad' : 'bg-white/25',
                      )}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </span>
                <span>
                  <span className="block font-[family-name:var(--font-mono)] text-sm text-ink">
                    {info.title}
                  </span>
                  <span className="mt-1 block text-[12px] leading-snug text-muted">
                    {info.blurb}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      )}

      <label className="block">
        <span className="microlabel">extra direction for this cut — optional</span>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          placeholder="e.g. ‘open on the pricing page, end on the cta’"
          className="mt-1.5 w-full resize-none rounded-[var(--radius-win)] border border-hair-strong bg-paper p-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-violet"
        />
      </label>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" /> back
        </Button>
        <Button
          loading={generating}
          onClick={() => onGenerate(format, count, preset, prompt.trim())}
        >
          <Sparkles className="size-4" />{' '}
          {single ? 'generate video' : `generate ${count} variations`}
        </Button>
      </div>
    </div>
  );
}
