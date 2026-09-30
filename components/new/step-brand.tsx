'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { Brand, Project } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Dropzone } from '@/components/ui/dropzone';
import { useSignedUrl, BUCKET_ASSETS } from '@/lib/client/storage';
import { BrandScan } from './brand-scan';

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/** Полный brand (не ранний частичный {screenshotPath} от воркера). */
function isCompleteBrand(b: Brand | null | undefined): b is Brand {
  return Boolean(b && Array.isArray(b.colors) && Array.isArray(b.fonts));
}

/** Шаг 2 — извлечённый бренд: подтверждение/правка. */
export function StepBrand({
  project,
  url,
  uploading,
  onUpload,
  onConfirm,
  onBack,
}: {
  project: Project | null;
  url: string;
  uploading: boolean;
  onUpload: (files: File[]) => void;
  onConfirm: (brand: Brand) => void;
  onBack: () => void;
}) {
  const ready = project?.status === 'ready' && isCompleteBrand(project.brand);

  // локальная редактируемая копия бренда
  const [brand, setBrand] = useState<Brand | null>(null);
  useEffect(() => {
    if (isCompleteBrand(project?.brand)) setBrand(project.brand);
  }, [project?.brand]);

  // Скрин: signed URL от API (brand.screenshotUrl); фолбэк — подпись в браузере.
  const signedFallback = useSignedUrl(
    BUCKET_ASSETS,
    brand?.screenshotUrl ? null : brand?.screenshotPath,
  );
  const screenshotUrl = brand?.screenshotUrl ?? signedFallback;

  if (project?.status === 'failed') {
    return (
      <div className="mx-auto max-w-[460px] py-10 text-center">
        <h2 className="display text-2xl text-ink">couldn’t read that page</h2>
        <p className="mt-3 text-sm text-muted">
          the landing url was unreachable or blocked. try another.
        </p>
        <Button variant="outline" className="mt-6" onClick={onBack}>
          <ArrowLeft className="size-4" /> try another url
        </Button>
      </div>
    );
  }

  if (!ready || !brand) {
    return (
      <BrandScan
        url={url}
        status={project?.status ?? 'pending'}
        screenshotUrl={project?.brand?.screenshotUrl ?? null}
        startedAt={project?.createdAt}
        onBack={onBack}
      />
    );
  }

  const setColor = (i: number, color: string) =>
    setBrand((b) =>
      b
        ? { ...b, colors: b.colors.map((c, idx) => (idx === i ? color : c)) }
        : b,
    );

  // accent роли из analysis.palette — то, чем реально красится видео.
  const setPaletteRole = (role: 'accent' | 'accentAlt', color: string) =>
    setBrand((b) =>
      b && b.analysis
        ? {
            ...b,
            analysis: {
              ...b.analysis,
              palette: { ...b.analysis.palette, [role]: color },
            },
          }
        : b,
    );

  return (
    <div className="mx-auto max-w-[760px] space-y-7">
      <div className="text-center">
        <h2 className="display text-3xl text-ink">here’s your brand</h2>
        <p className="mx-auto mt-2 max-w-[440px] text-sm text-muted">
          tweak anything that’s off — click a color to change it, or upload your
          logo.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* screenshot */}
        <div className="win-surface relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] shadow-win">
          <Preview url={screenshotUrl} alt="landing screenshot" />
          <span className="absolute left-3 top-3">
            <Chip tone="win">{hostOf(url)}</Chip>
          </span>
        </div>

        {/* details */}
        <div className="space-y-5">
          <div>
            <span className="microlabel">palette — click to edit</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {brand.colors.map((color, i) => (
                <label
                  key={i}
                  className="group relative cursor-pointer"
                  title={color}
                >
                  <span
                    className="block size-9 rounded-[10px] border border-hair shadow-sm transition-transform group-hover:scale-105"
                    style={{ background: color }}
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(i, e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label={`palette color ${i + 1}`}
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className="microlabel">fonts</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {brand.fonts.length ? (
                brand.fonts.map((f) => <Chip key={f}>{f}</Chip>)
              ) : (
                <span className="text-[13px] text-faint">none detected</span>
              )}
            </div>
          </div>

          <label className="block">
            <span className="microlabel">headline</span>
            <input
              value={brand.h1 ?? ''}
              onChange={(e) =>
                setBrand((b) => (b ? { ...b, h1: e.target.value } : b))
              }
              placeholder="your landing h1"
              className="mt-1.5 h-10 w-full rounded-[12px] border border-hair-strong bg-paper px-3 text-sm text-ink outline-none focus:border-violet"
            />
          </label>

          <label className="block">
            <span className="microlabel">cta</span>
            <input
              value={brand.cta ?? ''}
              onChange={(e) =>
                setBrand((b) => (b ? { ...b, cta: e.target.value } : b))
              }
              placeholder="start free trial"
              className="mt-1.5 h-10 w-full rounded-[12px] border border-hair-strong bg-paper px-3 text-sm text-ink outline-none focus:border-violet"
            />
          </label>
        </div>
      </div>

      {brand.analysis && (
        <div className="rounded-[var(--radius-card)] border border-hair bg-wash/60 p-5">
          <span className="microlabel">how we read your vibe</span>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip tone="violet">{brand.analysis.brightness}</Chip>
            <Chip tone="violet">{brand.analysis.energy}</Chip>
            {brand.analysis.mood.map((m) => (
              <Chip key={m}>{m}</Chip>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {(
              [
                ['bg', null, brand.analysis.palette.bg],
                ['surface', null, brand.analysis.palette.surface],
                ['text', null, brand.analysis.palette.text],
                ['accent', 'accent', brand.analysis.palette.accent],
                ['accent 2', 'accentAlt', brand.analysis.palette.accentAlt],
              ] as [string, 'accent' | 'accentAlt' | null, string | null][]
            )
              .filter(
                (r): r is [string, 'accent' | 'accentAlt' | null, string] =>
                  r[2] !== null,
              )
              .map(([role, editKey, color]) =>
                editKey ? (
                  <label
                    key={role}
                    className="group flex cursor-pointer items-center gap-1.5"
                    title={`${color} — click to edit`}
                  >
                    <span
                      className="relative block size-6 rounded-[7px] border border-hair shadow-sm transition-transform group-hover:scale-105"
                      style={{ background: color }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setPaletteRole(editKey, e.target.value)}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        aria-label={`${role} color`}
                      />
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-muted">
                      {role}
                    </span>
                  </label>
                ) : (
                  <span key={role} className="flex items-center gap-1.5">
                    <span
                      className="block size-6 rounded-[7px] border border-hair shadow-sm"
                      style={{ background: color }}
                      title={color}
                    />
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-muted">
                      {role}
                    </span>
                  </span>
                ),
              )}
          </div>

          {brand.analysis.story?.hook && (
            <p className="mt-4 text-[14px] italic leading-snug text-ink">
              “{brand.analysis.story.hook}”
            </p>
          )}

          {brand.analysis.metrics.length > 0 && (
            <div className="mt-4">
              <span className="microlabel">numbers we’ll animate</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {brand.analysis.metrics.map((m, i) => (
                  <span
                    key={`${m.value}-${i}`}
                    className="inline-flex items-baseline gap-1.5 rounded-full border border-hair bg-paper px-2.5 py-1"
                  >
                    <span className="font-[family-name:var(--font-mono)] text-[13px] text-ink">
                      {m.value}
                    </span>
                    <span className="text-[11px] text-muted">{m.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {brand.analysis.visuals.some((v) => v.cropPath) && (
            <div className="mt-4">
              <span className="microlabel">real product we found — goes in the video</span>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {brand.analysis.visuals
                  .filter((v) => v.cropPath)
                  .slice(0, 8)
                  .map((v, i) => (
                    <CropThumb
                      key={`${v.cropPath}-${i}`}
                      path={v.cropPath}
                      signedUrl={v.cropUrl ?? null}
                      label={v.label}
                      hero={v.hero}
                    />
                  ))}
              </div>
            </div>
          )}

          {brand.analysis.motion && (
            <p className="mt-4 text-[12px] leading-snug text-muted">
              motion · {brand.analysis.motion}
            </p>
          )}
          <p className="mt-2 text-[11px] leading-snug text-faint">
            this is the read your video is built from — click accent to recolor
            it.
          </p>
        </div>
      )}

      <div>
        <span className="microlabel">logo & extra screenshots — optional</span>
        <Dropzone
          className="mt-2"
          disabled={uploading}
          hint={uploading ? 'uploading…' : 'drop your logo or screenshots'}
          onFiles={onUpload}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" /> back
        </Button>
        <Button onClick={() => onConfirm(brand)}>
          looks right
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Картинка на тёмной поверхности с честными состояниями: «loading…» пока нет
 * URL, «couldn’t load» если браузер не смог её забрать (раньше любой сбой
 * выглядел как молчаливый чёрный прямоугольник).
 */
function Preview({ url, alt }: { url: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);

  if (!url || failed) {
    return (
      <div className="absolute inset-0 grid place-items-center px-3 text-center font-[family-name:var(--font-mono)] text-[11px] text-white/50">
        {failed ? 'couldn’t load preview' : 'loading preview…'}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      onError={() => {
        console.warn('[brand] preview failed to load', url.replace(/\?.*$/, ''));
        setFailed(true);
      }}
      className="absolute inset-0 size-full object-cover object-top"
    />
  );
}

/** Превью реального кропа продукта: signed URL от API, фолбэк — подпись в браузере. */
function CropThumb({
  path,
  signedUrl,
  label,
  hero,
}: {
  path: string | null;
  signedUrl: string | null;
  label: string;
  hero: boolean;
}) {
  const fallback = useSignedUrl(BUCKET_ASSETS, signedUrl ? null : path);
  return (
    <div
      className={cn(
        'win-surface relative aspect-[4/3] overflow-hidden rounded-[10px]',
        hero && 'ring-1 ring-violet',
      )}
      title={label}
    >
      <Preview url={signedUrl ?? fallback} alt={label} />
      {hero && (
        <span className="absolute left-1 top-1 rounded-full bg-violet px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-white">
          hero
        </span>
      )}
    </div>
  );
}
