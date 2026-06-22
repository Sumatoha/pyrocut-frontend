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

/**
 * Рецепт = СТРУКТУРНЫЙ каркас ролика (какие сцены, в каком порядке, что в фокусе).
 * Это ось РАЗНООБРАЗИЯ вариаций: пресет задаёт СТИЛЬ/энергию, рецепт — СТРУКТУРУ.
 * Планировщик батча назначает разным вариациям разные рецепты, чтобы они были
 * реально непохожи. (зеркало enums.ts)
 */
export const VIDEO_RECIPES = [
  'dashboard-zoom',
  'product-scroll',
  'kinetic-type',
  'data-metrics',
  'editorial',
  'snap-montage',
] as const;
export type VideoRecipe = (typeof VIDEO_RECIPES)[number];

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

/**
 * Дефолтный рецепт-структура под каждый пресет (одиночная генерация без планировщика).
 * Планировщик батча может назначить другой рецепт ради разнообразия. (зеркало enums.ts)
 */
export const PRESET_RECIPE: Record<VideoPreset, VideoRecipe> = {
  dolly: 'dashboard-zoom',
  snapcut: 'snap-montage',
  editorial: 'editorial',
  neon: 'snap-montage',
  kinetic: 'kinetic-type',
  glass: 'product-scroll',
  terminal: 'data-metrics',
  liquid: 'product-scroll',
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
 * Тип визуального узла лендинга. dashboard/product_shot/chart можно ВСТАВИТЬ кропом
 * и анимировать (зум/scroll/спотлайт) вместо фейк-панели. (зеркало schemas.ts)
 */
export const VISUAL_KINDS = [
  'dashboard',
  'product_shot',
  'chart',
  'device_frame',
  'logo_strip',
  'illustration',
  'other',
] as const;
export type VisualKind = (typeof VISUAL_KINDS)[number];

/** Прямоугольник на full-page скрине (px). */
export interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Найденный на лендинге визуальный элемент. bbox — из DOM; kind/label/hero — из
 * vision-классификации; cropPath — storage-путь кропа (bucket assets) от crop.ts.
 */
export interface Visual {
  kind: VisualKind;
  label: string;
  bbox: BBox | null;
  cropPath: string | null;
  hero: boolean;
}

/** Числовая метрика-стат с лендинга — для счётчиков/бар-чартов в видео. */
export interface Metric {
  /** Значение как на странице: «10x», «99.9%», «2M+». */
  value: string;
  /** Подпись: «faster», «uptime», «developers». */
  label: string;
}

/** Нарратив-каркас ролика: хук + биты сцен. */
export interface Story {
  hook: string;
  beats: string[];
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
  /** Реальные визуалы лендинга (дашборды/продукт-шоты/графики) — «что анимировать». */
  visuals: Visual[];
  /** Числовые метрики со страницы — для счётчиков/бар-чартов. */
  metrics: Metric[];
  /** Нарратив-каркас (хук + биты) — драйвер сториборда. */
  story: Story | null;
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
  /** Структурный рецепт вариации (из plan); null для одиночных видео старого флоу. */
  recipe: VideoRecipe | null;
  /** Имя вариации для UI (из plan.title); null если не батч. */
  variationTitle: string | null;
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

/** POST /videos/batch — N взаимно-различных вариаций по одному проекту (планировщик). */
export interface CreateVideosBatchInput {
  projectId: string;
  format: VideoFormat;
  /** Сколько вариаций (2-6). */
  count: number;
  prompt?: string;
}

/** POST /videos/:id/edit — точечная AI-правка готового видео по инструкции юзера. */
export interface EditVideoInput {
  instruction: string;
}

export interface CheckoutInput {
  plan: Exclude<Plan, 'free'>;
}

// ---- API envelope ---------------------------------------------------------

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: string };
export type ApiResponse<T> = ApiOk<T> | ApiErr;
