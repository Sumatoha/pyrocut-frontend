'use client';

import { useEffect, useState } from 'react';

/**
 * Live-preview композиции до готового mp4. Качаем HTML по signed URL и рендерим
 * через `srcDoc`, а НЕ через `src`: Supabase отдаёт пользовательский HTML как
 * `text/plain` (+`X-Content-Type-Options: nosniff`), и в iframe виден исходный
 * код вместо анимации. srcDoc всегда парсится как HTML, независимо от content-type.
 */
export function CompositionPreview({ url }: { url: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    setFailed(false);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((t) => !cancelled && setHtml(t))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (failed || html === null)
    return (
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-white/70">
          {failed ? 'preview unavailable' : 'composing preview…'}
        </span>
      </div>
    );

  return (
    <iframe
      srcDoc={html}
      sandbox="allow-scripts"
      title="live composition preview"
      className="absolute inset-0 size-full border-0"
    />
  );
}
