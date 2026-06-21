'use client';

import { useEffect, useRef, useState } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Project } from '@pyrocut/shared';
import { api } from './api';
import { getSupabase } from './supabase';
import { mapProjectRow } from './mappers';
import { DEMO_MODE, demoProject } from './demo';

type Row = Record<string, unknown>;

/** Подписка на один project: load + realtime статус/brand. demo — симуляция стадий. */
export function useProject(id: string | null): {
  project: Project | null;
  error: string | null;
} {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setProject(null);
    setError(null);
    if (!id) return;

    // demo: имитируем pending → scraping → ready(brand)
    if (DEMO_MODE) {
      const base: Project = {
        ...demoProject,
        id,
        status: 'pending',
        brand: null,
      };
      setProject(base);
      timers.current.push(
        setTimeout(
          () => setProject((p) => (p ? { ...p, status: 'scraping' } : p)),
          900,
        ),
        setTimeout(
          () =>
            setProject((p) =>
              p ? { ...p, status: 'ready', brand: demoProject.brand } : p,
            ),
          2600,
        ),
      );
      return () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
      };
    }

    let cancelled = false;
    api
      .getProject(id)
      .then((p) => !cancelled && setProject(p))
      .catch(
        (e) => !cancelled && setError(e?.message ?? 'could not load project'),
      );

    const sb = getSupabase();
    if (!sb) return () => {
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
        .channel(`project-${id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects',
            filter: `id=eq.${id}`,
          },
          (payload: RealtimePostgresChangesPayload<Row>) => {
            if (payload.eventType === 'DELETE') return;
            const next = mapProjectRow(payload.new);
            setProject((prev) => (prev ? { ...prev, ...next } : next));
          },
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) void sb.removeChannel(channel);
    };
  }, [id]);

  return { project, error };
}
