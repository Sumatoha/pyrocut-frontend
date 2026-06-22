'use client';

import type {
  ApiResponse,
  Asset,
  AssetKind,
  Brand,
  CreateProjectInput,
  CreateVideoInput,
  CreateVideosBatchInput,
  EditVideoInput,
  Plan,
  Project,
  Video,
} from '@pyrocut/shared';
import { getSupabase } from './supabase';

/**
 * Клиент к API бэкенда (§6). Бэк отдаёт единый конверт
 * { ok:true, data } | { ok:false, error } (backend/apps/api/lib/server/http.ts).
 * request<T> разворачивает конверт → payload; на { ok:false } бросает ApiError.
 * Типы — из @pyrocut/shared (camelCase, зеркало бэка).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
  /** кончились кредиты — мягко вести в /billing */
  get isPaymentRequired(): boolean {
    return this.status === 402;
  }
  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

async function authHeader(): Promise<Record<string, string>> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data } = await sb.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(init.body && !(init.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(await authHeader()),
    ...((init.headers as Record<string, string>) ?? {}),
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api${path}`, { ...init, headers });
  } catch (e) {
    throw new ApiError(0, 'network error — бэкенд недоступен', e);
  }

  const text = await res.text();
  const body = text ? (safeJson(text) as ApiResponse<T> | null) : null;

  // HTTP-ошибка: сообщение из конверта { ok:false, error } либо статус.
  if (!res.ok) {
    const msg =
      (body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : null) ?? `${res.status} ${res.statusText}`;
    throw new ApiError(res.status, msg, body);
  }

  // 2xx, но конверт сигналит ошибку — тоже бросаем.
  if (!body || typeof body !== 'object' || !('ok' in body)) {
    throw new ApiError(res.status, 'malformed API response', body);
  }
  if (body.ok === false) {
    throw new ApiError(res.status, body.error, body);
  }
  return body.data;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ---- endpoints (§6) -------------------------------------------------------

export const api = {
  // POST /api/projects { url, brief? } -> Project (pending) + enqueue scrape
  createProject: (input: CreateProjectInput) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  // GET /api/projects/:id -> Project
  getProject: (id: string) => request<Project>(`/projects/${id}`),

  // PATCH /api/projects/:id { brand } -> Project (мерж brand на бэке)
  patchProject: (id: string, brand: Partial<Brand>) =>
    request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ brand }),
    }),

  // POST /api/projects/:id/assets (multipart: file, kind) -> Asset
  uploadAsset: (id: string, file: File, kind: AssetKind) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('kind', kind);
    return request<Asset>(`/projects/${id}/assets`, {
      method: 'POST',
      body: fd,
    });
  },

  // POST /api/videos -> Video (queued) + enqueue pipeline
  createVideo: (input: CreateVideoInput) =>
    request<Video>('/videos', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  // POST /api/videos/batch -> Video[] (планировщик: N взаимно-различных вариаций)
  createVideosBatch: (input: CreateVideosBatchInput) =>
    request<Video[]>('/videos/batch', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  // GET /api/videos -> Video[]
  listVideos: () => request<Video[]>('/videos'),

  // GET /api/videos/:id -> Video
  getVideo: (id: string) => request<Video>(`/videos/${id}`),

  // POST /api/videos/:id/edit { instruction } -> Video (queued); 1-я правка бесплатно, дальше 1 кредит
  editVideo: (id: string, input: EditVideoInput) =>
    request<Video>(`/videos/${id}/edit`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  // DELETE /api/videos/:id -> { ok:true }
  deleteVideo: (id: string) =>
    request<{ ok: boolean }>(`/videos/${id}`, { method: 'DELETE' }),

  // POST /api/billing/checkout { plan } -> { url }
  // 'free' нельзя купить — бэк-схема CheckoutSchema исключает его (zod 400).
  checkout: (plan: Exclude<Plan, 'free'>) =>
    request<{ url: string }>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
};
