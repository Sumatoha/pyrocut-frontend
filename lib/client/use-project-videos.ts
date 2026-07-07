'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Video } from '@pyrocut/shared';
import { api } from './api';
import { DEMO_MODE, demoVideos } from './demo';

/**
 * Видео одного проекта (для variations-галереи «one brand → many cuts»).
 * Бэк не даёт фильтр-эндпоинт (§6) — фильтруем listVideos на клиенте.
 * Список тянем СРАЗУ на маунте (параллельно с getVideo основной страницы), а не
 * после появления projectId — иначе сайдбар вариаций ждёт waterfall +150-300мс.
 * TODO(stub): при появлении бэка свериться, нет ли GET /api/projects/:id/videos.
 */
export function useProjectVideos(
  projectId: string | null,
  excludeId?: string,
): Video[] {
  const [all, setAll] = useState<Video[] | null>(null);

  useEffect(() => {
    if (DEMO_MODE) return;
    let cancelled = false;
    api
      .listVideos()
      .then((v) => !cancelled && setAll(v))
      .catch(() => !cancelled && setAll([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    if (DEMO_MODE) {
      return projectId
        ? demoVideos.filter((v) => v.id !== excludeId).slice(0, 3)
        : [];
    }
    if (!projectId || !all) return [];
    return all.filter((v) => v.projectId === projectId && v.id !== excludeId);
  }, [all, projectId, excludeId]);
}
