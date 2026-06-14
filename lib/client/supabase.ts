'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** true когда env настроены — иначе auth/realtime в degraded-режиме. */
export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * Браузерный Supabase-клиент (singleton).
 * Возвращает null, если env не настроены — вызывающий код должен это учитывать
 * и не падать (degraded UX с явным warning).
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) {
    client = createBrowserClient(url as string, anonKey as string);
  }
  return client;
}
