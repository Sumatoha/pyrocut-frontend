import type { Project, Video } from '@pyrocut/shared';

/**
 * Маппинг сырых snake_case строк БД → camelCase контракт @pyrocut/shared.
 *
 * REST-эндпоинты уже отдают camelCase (бэк мапит в lib/server/mappers), но
 * Supabase Realtime присылает СЫРЫЕ строки таблиц (snake_case) в payload.new.
 * Эти функции — зеркало backend/apps/api/lib/server/mappers.ts для realtime.
 */
type Row = Record<string, unknown>;

export function mapProjectRow(r: Row): Project {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    sourceUrl: r.source_url as string,
    brief: (r.brief as string | null) ?? null,
    status: r.status as Project['status'],
    brand: (r.brand as Project['brand']) ?? null,
    error: (r.error as string | null) ?? null,
    createdAt: r.created_at as string,
  };
}

export function mapVideoRow(r: Row): Video {
  const plan = (r.plan as { recipe?: string; title?: string } | null) ?? null;
  return {
    id: r.id as string,
    projectId: r.project_id as string,
    userId: r.user_id as string,
    format: r.format as Video['format'],
    preset: r.preset as Video['preset'],
    // recipe/variationTitle живут в videos.plan jsonb (бэк мапит их в mapVideo).
    recipe: (plan?.recipe as Video['recipe']) ?? null,
    variationTitle: (plan?.title as string | null) ?? null,
    prompt: (r.prompt as string | null) ?? null,
    status: r.status as Video['status'],
    watermark: Boolean(r.watermark),
    compositionPath: (r.composition_path as string | null) ?? null,
    mp4Path: (r.mp4_path as string | null) ?? null,
    thumbPath: (r.thumb_path as string | null) ?? null,
    durationSeconds: (r.duration_seconds as number | null) ?? null,
    error: (r.error as string | null) ?? null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}
