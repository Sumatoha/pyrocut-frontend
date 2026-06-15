'use client';

import { useState } from 'react';
import { ArrowRight, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Шаг 1 — URL лендинга + опц. бриф. */
export function StepUrl({
  onSubmit,
  loading,
}: {
  onSubmit: (url: string, brief: string) => void;
  loading: boolean;
}) {
  const [url, setUrl] = useState('');
  const [brief, setBrief] = useState('');

  function normalize(raw: string): string {
    const t = raw.trim();
    if (!t) return t;
    return /^https?:\/\//i.test(t) ? t : `https://${t}`;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(normalize(url), brief.trim());
      }}
      className="mx-auto max-w-[560px] space-y-6"
    >
      <div className="text-center">
        <h1 className="display text-4xl text-ink">paste your landing url</h1>
        <p className="mx-auto mt-3 max-w-[420px] text-sm text-muted">
          pyrocut reads your brand — colors, fonts, headline — and turns it into
          a launch video.
        </p>
      </div>

      <label className="block">
        <span className="microlabel">landing url</span>
        <div className="relative mt-1.5">
          <Link2 className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-faint" />
          <input
            type="text"
            inputMode="url"
            required
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="acme.dev"
            className="h-14 w-full rounded-[var(--radius-win)] border border-hair-strong bg-paper pl-11 pr-4 text-base text-ink outline-none transition-colors placeholder:text-faint focus:border-violet"
          />
        </div>
      </label>

      <label className="block">
        <span className="microlabel">brief — optional</span>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={3}
          placeholder="what should the video emphasize? e.g. ‘speed and the live dashboard’"
          className="mt-1.5 w-full resize-none rounded-[var(--radius-win)] border border-hair-strong bg-paper p-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-violet"
        />
      </label>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={loading}
        disabled={!url.trim()}
      >
        read my brand
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
