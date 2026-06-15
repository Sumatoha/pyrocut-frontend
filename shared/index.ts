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

export const VIDEO_PRESETS = [
  'dolly',
  'snapcut',
  'editorial',
  'neon',
  'kinetic',
  'glass',
  'terminal',
  'liquid',
] as const;
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

export const BRIGHTNESS = ['dark', 'mixed', 'light'] as const;
export type Brightness = (typeof BRIGHTNESS)[number];

export const ENERGY = ['calm', 'balanced', 'energetic'] as const;
export type Energy = (typeof ENERGY)[number];

/**
 * Роли палитры из vision-анализа (не сырые доминирующие цвета) — то, чем
 * красится КОМПОЗИЦИЯ: фон / поверхности / текст / акцент бренда.
 */
export interface PaletteRoles {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  accentAlt: string | null;
}

/**
 * brand.analysis — структурный creative-brief из vision-прохода над full-page
 * скрином. Источник правды о ВАЙБЕ лендинга (палитра по ролям + язык движения).
 * null, если анализ не удался — генерация откатывается на сырые colors/тексты.
 */
export interface BrandAnalysis {
  palette: PaletteRoles;
  brightness: Brightness;
  energy: Energy;
  /** Прилагательные вайба: «тёмный, дерзкий, тех» / «лёгкий, дружелюбный». */
  mood: string[];
  /** О чём говорят секции лендинга, сверху вниз. */
  sections: string[];
  /** Рекомендованный язык движения (1-2 фразы). */
  motion: string | null;
  /** Вайб типографики. */
  typography: string | null;
}

/**
 * Извлечённый бренд лендинга (projects.brand jsonb). screenshotPath / fullPagePath —
 * storage-пути приватного bucket 'assets', НЕ готовые URL: фронт подписывает через
 * lib/client/storage.
 */
export interface Brand {
  colors: string[];
  fonts: string[];
  h1: string | null;
  h2: string | null;
  cta: string | null;
  screenshotPath: string | null;
  /** Полностраничный скрин (для vision-генерации). Может отличаться от hero-скрина. */
  fullPagePath: string | null;
  /** Структурный vision-brief; null если анализ не удался. */
  analysis: BrandAnalysis | null;
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
