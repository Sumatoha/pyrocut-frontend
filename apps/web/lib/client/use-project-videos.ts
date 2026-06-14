'use client';

import { useEffect, useState } from 'react';
import type { Video } from '@pyrocut/shared';
import { api } from './api';
import { DEMO_MODE, demoVideos } from './demo';

/**
 * Видео одного проекта (для variations-галереи «one brand → many cuts»).
 * Бэк не даёт фильтр-эндпоинт (§6) — фильтруем listVideos на клиенте.
 * TODO(stub): при появлении бэка свериться, нет ли GET /api/projects/:id/videos.
 */
export function useProjectVideos(
  projectId: string | null,
  excludeId?: string,
): Video[] {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (!projectId) {
      setVideos([]);
      return;
    }
    if (DEMO_MODE) {
      setVideos(demoVideos.filter((v) => v.id !== excludeId).slice(0, 3));
      return;
    }
    let cancelled = false;
    api
      .listVideos()
      .then((all) => {
        if (cancelled) return;
        setVideos(
          all.filter((v) => v.projectId === projectId && v.id !== excludeId),
        );
      })
      .catch(() => !cancelled && setVideos([]));
    return () => {
      cancelled = true;
    };
  }, [projectId, excludeId]);

  return videos;
}
