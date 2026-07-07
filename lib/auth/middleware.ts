import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Рефреш сессии в middleware (обязателен для @supabase/ssr).
 * Возвращает обновлённый response, claims текущего юзера и флаг configured.
 */
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: { sub: string } | null;
  configured: boolean;
}> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { response, user: null, configured: false };

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet: CookieToSet[]) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getClaims вместо getUser: JWT валидируется ЛОКАЛЬНО (JWKS кэшируется), сеть —
  // только на рефреш протухшего токена. getUser ходил в Supabase Auth на КАЖДУЮ
  // навигацию/RSC-запрос залогиненного юзера (+150-400мс на любой переход).
  const { data } = await supabase.auth.getClaims();

  return { response, user: data?.claims ?? null, configured: true };
}
