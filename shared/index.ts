/**
 * pyrocut — shared type contract (frontend mirror).
 *
 * OWNERSHIP: бэкенд владеет контрактом (backend/packages/shared). Этот файл —
 * ЗЕРКАЛО его публичного контракта, поле-в-поле. API отдаёт camelCase
 * (бэк мапит snake_case строки БД в camelCase в lib/server/mappers).
 * При любом изменении контракта на бэке — синхронизировать здесь.
 */

// ---- enums ----------------------------------------------------------------

export const PLANS = ['free', 'pro', 'studio'] as const;
export type Plan = (typeof PLANS)[number];

export const PROJECT_STATUSES = [
  'pending',
  'scraping',
  'ready',
  'failed',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const ASSET_KINDS = ['screenshot', 'logo', 'footage'] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export const VIDEO_FORMATS = ['16:9', '9:16'] as const;
export type VideoFormat = (typeof VIDEO_FORMATS)[number];

export const VIDEO_PRESETS = ['dolly', 'snapcut', 'editorial'] as const;
export type VideoPreset = (typeof VIDEO_PRESETS)[number];

export const VIDEO_STATUSES = [
  'queued',
  'generating',
  'rendering',
  'ready',
  'failed',
] as const;
export type VideoStatus = (typeof VIDEO_STATUSES)[number];

/** UI-алиасы (исторические имена во фронтовых компонентах). */
export const FORMATS = VIDEO_FORMATS;
export type Format = VideoFormat;
export const PRESETS = VIDEO_PRESETS;
export type Preset = VideoPreset;

/** Пиксельные размеры стейджа под формат (HyperFrames data-width/height). */
export const FORMAT_DIMENSIONS: Record<
  VideoFormat,
  { width: number; height: number }
> = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
};

// ---- entities -------------------------------------------------------------

/**
 * Извлечённый бренд лендинга (projects.brand jsonb). screenshotPath — storage-путь
 * приватного bucket 'assets', НЕ готовый URL: фронт подписывает через lib/client/storage.
 */
export interface Brand {
  colors: string[];
  fonts: string[];
  h1: string | null;
  h2: string | null;
  cta: string | null;
  screenshotPath: string | null;
}

export interface Profile {
  id: string;
  plan: Plan;
  credits: number;
  createdAt: string;
  /**
   * Не часть API-контракта (в таблице profiles колонки email нет).
   * Фронт берёт email из auth-юзера для отображения в TopBar.
   */
  email?: string;
}

export interface Project {
  id: string;
  userId: string;
  sourceUrl: string;
  brief: string | null;
  status: ProjectStatus;
  brand: Brand | null;
  error: string | null;
  createdAt: string;
}

export interface Asset {
  id: string;
  projectId: string;
  userId: string;
  kind: AssetKind;
  /** storage-path в bucket 'assets' */
  storagePath: string;
  createdAt: string;
}

export interface Video {
  id: string;
  projectId: string;
  userId: string;
  format: VideoFormat;
  preset: VideoPreset;
  prompt: string | null;
  status: VideoStatus;
  watermark: boolean;
  /** живая HTML-композиция (bucket 'compositions', storage-path) */
  compositionPath: string | null;
  /** готовый MP4 (bucket 'renders', storage-path) */
  mp4Path: string | null;
  /** тёмный thumbnail (bucket 'renders', storage-path) */
  thumbPath: string | null;
  durationSeconds: number | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- request payloads -----------------------------------------------------

export interface CreateProjectInput {
  url: string;
  brief?: string;
}

export interface PatchProjectInput {
  brand: Partial<Brand>;
}

export interface CreateAssetInput {
  kind: AssetKind;
}

export interface CreateVideoInput {
  projectId: string;
  format: VideoFormat;
  preset: VideoPreset;
  prompt?: string;
}

export interface CheckoutInput {
  plan: Exclude<Plan, 'free'>;
}

// ---- API envelope ---------------------------------------------------------

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: string };
export type ApiResponse<T> = ApiOk<T> | ApiErr;
