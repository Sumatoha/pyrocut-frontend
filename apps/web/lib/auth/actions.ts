'use server';

import { redirect } from 'next/navigation';
import { createClient } from './server';

/** Выход: убиваем сессию и ведём на /login. */
export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect('/login');
}
