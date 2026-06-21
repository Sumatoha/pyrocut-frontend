'use client';

import { useEffect, useRef, useState } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Video, VideoStatus } from '@pyrocut/shared';
import { api } from './api';
import { getSupabase } from './supabase';
import { mapVideoRow } from './mappers';
import { DEMO_MODE, demoVideoBase } from './demo';

type Row = Record<string, unknown>;

const DEMO_FLOW: VideoStatus[] = ['queued', 'generating', 'rendering', 'ready'];

/** Подписка на одно video: load + realtime стадии. demo — симуляция queued→ready. */
export function useVideo(id: string | null): {
  video: Video | null;
  error: string | null;
} {
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setVideo(null);
    setError(null);
    if (!id) return;

    if (DEMO_MODE) {
      setVideo(demoVideoBase(id));
      DEMO_FLOW.forEach((status, i) => {
        timers.current.push(
          setTimeout(
            () =>
              setVideo((v) =>
                v
                  ? {
                      ...v,
                      status,
                      compositionPath:
                        status === 'ready' ? 'about:blank' : v.compositionPath,
                      mp4Path: status === 'ready' ? 'about:blank' : v.mp4Path,
                    }
                  : v,
              ),
            i * 1600,
          ),
        );
      });
      return () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
      };
    }

    let cancelled = false;
    api
      .getVideo(id)
      .then((v) => !cancelled && setVideo(v))
      .catch(
        (e) => !cancelled && setError(e?.message ?? 'could not load video'),
      );

    const sb = getSupabase();
    if (!sb)
      return () => {
        cancelled = true;
      };
    let channel: ReturnType<typeof sb.channel> | null = null;
    // Realtime под RLS фильтрует события по JWT юзера — ставим токен ДО subscribe,
    // иначе анонимный сокет отсекает все UPDATE и статус залипает до перезагрузки.
    void (async () => {
      const { data } = await sb.auth.getSession();
      const token = data.session?.access_token;
      if (token) await sb.realtime.setAuth(token);
      if (cancelled) return;
      channel = sb
        .channel(`video-${id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'videos',
            filter: `id=eq.${id}`,
          },
          (payload: RealtimePostgresChangesPayload<Row>) => {
            if (payload.eventType === 'DELETE') return;
            const next = mapVideoRow(payload.new);
            setVideo((prev) => (prev ? { ...prev, ...next } : next));
          },
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) void sb.removeChannel(channel);
    };
  }, [id]);

  // Safety-net поллинг, пока видео не завершилось (realtime может пропасть при
  // reconnect/refresh токена). Останавливается на ready/failed.
  const active = !!video && video.status !== 'ready' && video.status !== 'failed';
  useEffect(() => {
    if (DEMO_MODE || !id || !active) return;
    const t = setInterval(() => {
      api
        .getVideo(id)
        .then((v) => setVideo(v))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(t);
  }, [id, active]);

  return { video, error };
}
