import type { ProjectStatus, VideoStatus } from '@pyrocut/shared';

export type StatusTone = 'idle' | 'active' | 'ready' | 'failed';

export interface StatusMeta {
  label: string;
  tone: StatusTone;
  /** идёт работа — анимировать pulse/scrubber */
  active: boolean;
}

const VIDEO: Record<VideoStatus, StatusMeta> = {
  queued: { label: 'queued', tone: 'idle', active: true },
  generating: { label: 'generating', tone: 'active', active: true },
  rendering: { label: 'rendering', tone: 'active', active: true },
  ready: { label: 'ready', tone: 'ready', active: false },
  failed: { label: 'failed', tone: 'failed', active: false },
};

const PROJECT: Record<ProjectStatus, StatusMeta> = {
  pending: { label: 'pending', tone: 'idle', active: true },
  scraping: { label: 'reading brand', tone: 'active', active: true },
  ready: { label: 'ready', tone: 'ready', active: false },
  failed: { label: 'failed', tone: 'failed', active: false },
};

export const videoStatusMeta = (s: VideoStatus): StatusMeta => VIDEO[s];
export const projectStatusMeta = (s: ProjectStatus): StatusMeta => PROJECT[s];

/** Доля прогресса для скраббера по стадии видео. */
export function videoProgress(s: VideoStatus): number {
  switch (s) {
    case 'queued':
      return 0.08;
    case 'generating':
      return 0.45;
    case 'rendering':
      return 0.8;
    case 'ready':
      return 1;
    case 'failed':
      return 1;
  }
}
