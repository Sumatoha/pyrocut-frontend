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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('id, plan, credits, created_at')
    .eq('id', user.id)
    .maybeSingle();

  if (data) {
    return {
      id: data.id as string,
      plan: data.plan as Profile['plan'],
      credits: data.credits as number,
      createdAt: data.created_at as string,
      email: user.email ?? undefined,
    };
  }

  return {
    id: user.id,
    plan: 'free',
    credits: 0,
    createdAt: new Date().toISOString(),
    email: user.email ?? undefined,
  };
}
