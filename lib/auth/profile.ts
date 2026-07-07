import type { Profile } from '@pyrocut/shared';
import { createClient } from './server';

/**
 * Профиль текущего юзера. Таблица profiles(id, plan, credits, created_at) —
 * без email (контракт бэка). email берём из auth-юзера для отображения в TopBar.
 * Если строки нет — деградируем к дефолтам free/0.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  // sub/email из локально валидированного JWT (getClaims) — без сетевого getUser:
  // middleware уже рефрешнул сессию, здесь клеймов достаточно.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;
  const email = typeof claims.email === 'string' ? claims.email : undefined;

  const { data: row } = await supabase
    .from('profiles')
    .select('id, plan, credits, created_at')
    .eq('id', claims.sub)
    .maybeSingle();

  if (row) {
    return {
      id: row.id as string,
      plan: row.plan as Profile['plan'],
      credits: row.credits as number,
      createdAt: row.created_at as string,
      email,
    };
  }

  return {
    id: claims.sub,
    plan: 'free',
    credits: 0,
    createdAt: new Date().toISOString(),
    email,
  };
}
