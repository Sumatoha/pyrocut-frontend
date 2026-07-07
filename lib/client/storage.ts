'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from './supabase';

/**
 * Buckets приватные (RLS: первый сегмент пути = uid владельца). Бэк хранит и
 * отдаёт storage-ПУТИ, не URL — фронт подписывает их через authed-клиент.
 * См. backend/supabase/migrations/0001_init.sql (storage policies).
 */
export const BUCKET_ASSETS = 'assets';
export const BUCKET_COMPOSITIONS = 'compositions';
export const BUCKET_RENDERS = 'renders';

const SIGNED_URL_TTL = 60 * 60; // 1 час
/** Кэш живёт заметно меньше TTL подписи — отдаём только заведомо валидные URL. */
const CACHE_TTL_MS = 45 * 60 * 1000;

/** Уже готовая для <img>/<video> ссылка (demo, абсолютный URL) — не подписываем. */
function isResolvedUrl(p: string): boolean {
  return /^(https?:|blob:|data:|about:)/.test(p);
}

/**
 * КЭШ + БАТЧ подписей. Раньше каждый тумб грида делал СВОЙ createSignedUrl
 * (N запросов на грид, и всё заново при возврате на страницу). Теперь:
 * - запросы одного тика собираются в ОДИН createSignedUrls на bucket;
 * - результат кэшируется на 45 мин (моложе TTL подписи) — повторные переходы
 *   грид→видео→грид не ходят в сеть вообще;
 * - неудачная подпись (объект ещё не готов) НЕ кэшируется — следующий запрос ретраит.
 */
const signedCache = new Map<string, { promise: Promise<string | null>; at: number }>();
const batchQueue = new Map<string, Map<string, Array<(u: string | null) => void>>>();
let batchScheduled = false;

function flushSignBatch(): void {
  batchScheduled = false;
  const sb = getSupabase();
  for (const [bucket, byPath] of batchQueue) {
    batchQueue.delete(bucket);
    const paths = [...byPath.keys()];
    if (!sb) {
      for (const resolvers of byPath.values()) resolvers.forEach((r) => r(null));
      continue;
    }
    void sb.storage
      .from(bucket)
      .createSignedUrls(paths, SIGNED_URL_TTL)
      .then(({ data, error }) => {
        const byResult = new Map(
          (data ?? []).map((d) => [d.path, d.error ? null : d.signedUrl]),
        );
        for (const [path, resolvers] of byPath) {
          const url = error ? null : (byResult.get(path) ?? null);
          resolvers.forEach((r) => r(url));
        }
      })
      .catch(() => {
        for (const resolvers of byPath.values()) resolvers.forEach((r) => r(null));
      });
  }
}

/** Ставит путь в батч текущего тика; все useSignedUrl одного рендера = один запрос. */
function enqueueSign(bucket: string, path: string): Promise<string | null> {
  return new Promise((resolve) => {
    const byPath = batchQueue.get(bucket) ?? new Map<string, Array<(u: string | null) => void>>();
    batchQueue.set(bucket, byPath);
    byPath.set(path, [...(byPath.get(path) ?? []), resolve]);
    if (!batchScheduled) {
      batchScheduled = true;
      queueMicrotask(flushSignBatch);
    }
  });
}

/** Signed URL + content-disposition: attachment (том же токеном, без второй подписи). */
function withDownload(url: string | null, name: string): string | null {
  if (!url) return null;
  return `${url}${url.includes('?') ? '&' : '?'}download=${encodeURIComponent(name)}`;
}

/**
 * Подписывает storage-путь → временный URL. null если клиента нет (degraded),
 * путь пустой или подписать не удалось (нет прав / объект ещё не готов).
 * download: имя файла → Supabase отдаёт content-disposition: attachment.
 * Без него <a download> на cross-origin URL игнорируется — Safari открывает
 * плеер в новой вкладке вместо скачивания.
 */
export async function signStoragePath(
  bucket: string,
  path: string | null | undefined,
  download?: string,
): Promise<string | null> {
  if (!path) return null;
  if (isResolvedUrl(path)) return download ? withDownload(path, download) : path;

  const key = `${bucket}:${path}`;
  const hit = signedCache.get(key);
  let promise =
    hit && Date.now() - hit.at < CACHE_TTL_MS ? hit.promise : null;
  if (!promise) {
    promise = enqueueSign(bucket, path);
    signedCache.set(key, { promise, at: Date.now() });
    // null (объект не готов/нет прав) не держим в кэше — следующий вызов ретраит.
    void promise.then((u) => {
      if (u === null && signedCache.get(key)?.promise === promise) signedCache.delete(key);
    });
  }
  const url = await promise;
  return download ? withDownload(url, download) : url;
}

/**
 * Реактивно резолвит storage-путь в signed URL. Возвращает url|null.
 * Меняется path → перезапрашивает; снятие компонента отменяет гонку.
 */
export function useSignedUrl(
  bucket: string,
  path: string | null | undefined,
  download?: string,
): string | null {
  const [url, setUrl] = useState<string | null>(() =>
    path && isResolvedUrl(path) ? path : null,
  );

  useEffect(() => {
    let cancelled = false;
    if (!path) {
      setUrl(null);
      return;
    }
    if (isResolvedUrl(path)) {
      setUrl(path);
      return;
    }
    setUrl(null);
    void signStoragePath(bucket, path, download).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [bucket, path, download]);

  return url;
}
