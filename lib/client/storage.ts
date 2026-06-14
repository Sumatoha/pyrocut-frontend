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

/** Уже готовая для <img>/<video> ссылка (demo, абсолютный URL) — не подписываем. */
function isResolvedUrl(p: string): boolean {
  return /^(https?:|blob:|data:|about:)/.test(p);
}

/**
 * Подписывает storage-путь → временный URL. null если клиента нет (degraded),
 * путь пустой или подписать не удалось (нет прав / объект ещё не готов).
 */
export async function signStoragePath(
  bucket: string,
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) return null;
  if (isResolvedUrl(path)) return path;
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (error || !data) return null;
  return data.signedUrl;
}

/**
 * Реактивно резолвит storage-путь в signed URL. Возвращает url|null.
 * Меняется path → перезапрашивает; снятие компонента отменяет гонку.
 */
export function useSignedUrl(
  bucket: string,
  path: string | null | undefined,
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
    void signStoragePath(bucket, path).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [bucket, path]);

  return url;
}
