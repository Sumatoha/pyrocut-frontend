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
};

/** Шаг 3 — формат + пресет монтажа + опц. бриф. */
export function StepFormat({
  onBack,
  onGenerate,
  generating,
}: {
  onBack: () => void;
  onGenerate: (format: Format, preset: Preset, prompt: string) => void;
  generating: boolean;
}) {
  const [format, setFormat] = useState<Format>('16:9');
  const [preset, setPreset] = useState<Preset>('dolly');
  const [prompt, setPrompt] = useState('');

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
                    ? 'border-ember bg-ember-soft/40'
                    : 'border-hair hover:border-hair-strong',
                )}
              >
                <span className="grid h-[100px] w-[120px] shrink-0 place-items-center">
                  <span
                    className={cn(
                      'rounded-[6px] border-2 transition-colors',
                      info.box,
                      sel ? 'border-ember bg-win' : 'border-hair-strong bg-wash',
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

      {/* preset */}
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
                    ? 'border-ember bg-ember-soft/40'
                    : 'border-hair hover:border-hair-strong',
                )}
              >
                <span className="win-surface flex h-16 items-end gap-1.5 rounded-[12px] p-3">
                  {info.bars.map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        'flex-1 rounded-sm',
                        sel ? 'ember-grad' : 'bg-white/25',
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

      <label className="block">
        <span className="microlabel">extra direction for this cut — optional</span>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          placeholder="e.g. ‘open on the pricing page, end on the cta’"
          className="mt-1.5 w-full resize-none rounded-[var(--radius-win)] border border-hair-strong bg-paper p-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-ember"
        />
      </label>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" /> back
        </Button>
        <Button
          loading={generating}
          onClick={() => onGenerate(format, preset, prompt.trim())}
        >
          <Sparkles className="size-4" /> generate video
        </Button>
      </div>
    </div>
  );
}
