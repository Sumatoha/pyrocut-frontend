'use client';

import { useCallback, useEffect, useState } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Video } from '@pyrocut/shared';
import { api, ApiError } from './api';
import { getSupabase } from './supabase';
import { mapVideoRow } from './mappers';
import { DEMO_MODE, demoVideos } from './demo';

type Row = Record<string, unknown>;

const sortNewest = (v: Video[]): Video[] =>
  [...v].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

function applyChange(
  prev: Video[],
  payload: RealtimePostgresChangesPayload<Row>,
): Video[] {
  // Realtime присылает СЫРЫЕ строки (snake_case) — мапим в контракт.
  if (payload.eventType === 'INSERT') {
    const next = mapVideoRow(payload.new);
    if (prev.some((v) => v.id === next.id)) return prev;
    return sortNewest([next, ...prev]);
  }
  if (payload.eventType === 'UPDATE') {
    const next = mapVideoRow(payload.new);
    return prev.map((v) => (v.id === next.id ? next : v));
  }
  if (payload.eventType === 'DELETE') {
    const oldId = (payload.old as { id?: string })?.id;
    return prev.filter((v) => v.id !== oldId);
  }
  return prev;
}

export interface VideosState {
  videos: Video[] | null;
  loading: boolean;
  error: string | null;
  /** true когда показываем demo-данные (нет бэка) */
  demo: boolean;
  reload: () => Promise<void>;
  /** локальное оптимистичное удаление */
  removeLocal: (id: string) => void;
}

/** Загрузка видео + live-обновление статусов через Supabase Realtime. */
export function useVideos(): VideosState {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (DEMO_MODE) {
      setVideos(sortNewest(demoVideos));
      setError(null);
      return;
    }
    try {
      const v = await api.listVideos();
      setVideos(sortNewest(v));
      setError(null);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : 'could not load videos',
      );
      setVideos([]);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (DEMO_MODE) return;
    const sb = getSupabase();
    if (!sb) return;
    const channel = sb
      .channel('videos-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'videos' },
        (payload: RealtimePostgresChangesPayload<Row>) =>
          setVideos((prev) => applyChange(prev ?? [], payload)),
      )
      .subscribe();
    return () => {
      void sb.removeChannel(channel);
    };
  }, []);

  const removeLocal = useCallback((id: string) => {
    setVideos((prev) => (prev ? prev.filter((v) => v.id !== id) : prev));
  }, []);

  return {
    videos,
    loading: videos === null,
    error,
    demo: DEMO_MODE,
    reload,
    removeLocal,
  };
}
