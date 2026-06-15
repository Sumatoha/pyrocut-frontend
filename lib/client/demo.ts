import type { Video, Project } from '@pyrocut/shared';

/**
 * DEMO-данные. Включаются ТОЛЬКО при NEXT_PUBLIC_DEMO=1 — чтобы можно было
 * увидеть UI без бэкенда. Это не рабочие данные: помечены меткой «demo» в UI.
 * Поля — camelCase (зеркало контракта @pyrocut/shared).
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO === '1';

/** Базовый каркас demo-видео со всеми обязательными полями контракта. */
export function demoVideoBase(id: string): Video {
  return {
    id,
    projectId: 'demo-project',
    userId: 'demo-user',
    format: '16:9',
    preset: 'dolly',
    prompt: null,
    status: 'queued',
    watermark: true,
    compositionPath: null,
    mp4Path: null,
    thumbPath: null,
    durationSeconds: null,
    error: null,
    createdAt: '2026-06-14T10:00:00Z',
    updatedAt: '2026-06-14T10:00:00Z',
  };
}

function demoVideo(over: Partial<Video> & Pick<Video, 'id'>): Video {
  return { ...demoVideoBase(over.id), ...over };
}

export const demoVideos: Video[] = [
  demoVideo({
    id: 'demo-1',
    projectId: 'p1',
    format: '16:9',
    preset: 'dolly',
    status: 'ready',
    compositionPath: 'about:blank',
    mp4Path: 'about:blank',
    createdAt: '2026-06-14T10:00:00Z',
  }),
  demoVideo({
    id: 'demo-2',
    projectId: 'p1',
    format: '9:16',
    preset: 'snapcut',
    status: 'rendering',
    createdAt: '2026-06-14T09:30:00Z',
  }),
  demoVideo({
    id: 'demo-3',
    projectId: 'p2',
    format: '16:9',
    preset: 'editorial',
    status: 'ready',
    compositionPath: 'about:blank',
    mp4Path: 'about:blank',
    createdAt: '2026-06-13T18:00:00Z',
  }),
  demoVideo({
    id: 'demo-4',
    projectId: 'p2',
    format: '9:16',
    preset: 'dolly',
    status: 'generating',
    createdAt: '2026-06-13T17:00:00Z',
  }),
  demoVideo({
    id: 'demo-5',
    projectId: 'p3',
    format: '16:9',
    preset: 'snapcut',
    status: 'failed',
    error: 'render worker timed out',
    createdAt: '2026-06-12T12:00:00Z',
  }),
  demoVideo({
    id: 'demo-6',
    projectId: 'p3',
    format: '9:16',
    preset: 'editorial',
    status: 'queued',
    createdAt: '2026-06-12T11:00:00Z',
  }),
];

export const demoProject: Project = {
  id: 'p1',
  userId: 'demo-user',
  sourceUrl: 'https://acme.dev',
  brief: null,
  status: 'ready',
  error: null,
  createdAt: '2026-06-14T09:00:00Z',
  brand: {
    colors: ['#5B4DEF', '#FF5A1F', '#0D0C11', '#FBF8F3', '#FFB85C'],
    fonts: ['Inter', 'JetBrains Mono'],
    h1: 'ship your saas faster',
    h2: null,
    cta: 'start free trial',
    screenshotPath: null,
    fullPagePath: null,
    analysis: {
      palette: {
        bg: '#0D0C11',
        surface: '#17141F',
        text: '#FBF8F3',
        textMuted: '#B9B5BE',
        accent: '#5B4DEF',
        accentAlt: '#FFB85C',
      },
      brightness: 'dark',
      energy: 'energetic',
      mood: ['bold', 'tech', 'confident'],
      sections: ['hero', 'features', 'pricing'],
      motion: 'snappy cuts with quick parallax on the product shots',
      typography: 'grotesk, tight, mixed-case',
    },
  },
};
