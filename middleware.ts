import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/auth/middleware';

/** Публичные пути (без auth-гарда). '/' — маркетинговый лендинг. */
const PUBLIC_PREFIXES = ['/login', '/auth', '/kitchen'];

function isPublic(path: string): boolean {
  if (path === '/') return true; // лендинг (rewrite → /landing.html)
  return PUBLIC_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { response, user, configured } = await updateSession(request);

  // env не настроены → degraded dev-режим: пропускаем всё (баннер в UI).
  if (!configured) return response;

  const path = request.nextUrl.pathname;

  if (!user && !isPublic(path)) {
    const to = request.nextUrl.clone();
    to.pathname = '/login';
    to.searchParams.set('next', path);
    return NextResponse.redirect(to);
  }

  if (user && path === '/login') {
    const to = request.nextUrl.clone();
    to.pathname = '/app';
    to.search = '';
    return NextResponse.redirect(to);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
