import type { NextConfig } from 'next';

/**
 * Домены (один Vercel-проект обслуживает все три):
 *  - pyrocut.com / www.pyrocut.com — публичный ЛЕНДИНГ (маркетинг).
 *  - app.pyrocut.com               — ПРОДУКТ (дашборд/логин). CORS бэка (APP_URL),
 *                                    Polar successUrl и Supabase Site URL завязаны
 *                                    именно на этот origin.
 * Поэтому: на app-домене корень ведёт в /app, лендинг не показываем; на маркетинг-
 * домене корень = лендинг, а попытки зайти в продукт уводим на app-домен.
 * Локалка (localhost) и Vercel preview (*.vercel.app) под эти host-правила не
 * попадают → работают самодостаточно (лендинг на /, продукт на /app, /login).
 */
const APP_HOST = 'app.pyrocut.com';
const MARKETING_HOST = 'www.pyrocut.com';
const APP_ORIGIN = `https://${APP_HOST}`;

const onHost = (value: string) =>
  [{ type: 'host' as const, value }];

const nextConfig: NextConfig = {
  images: {
    // signed URLs от Supabase storage; домен подставится из env при настройке
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async redirects() {
    return [
      // app-домен: корень → продукт (дальше middleware уведёт на /login если не авторизован)
      { source: '/', has: onHost(APP_HOST), destination: '/app', permanent: false },
      // маркетинг-домен: вход в продукт уводим на app-домен (там CORS/куки/Site URL)
      {
        source: '/login',
        has: onHost(MARKETING_HOST),
        destination: `${APP_ORIGIN}/login`,
        permanent: false,
      },
      {
        source: '/app/:path*',
        has: onHost(MARKETING_HOST),
        destination: `${APP_ORIGIN}/app/:path*`,
        permanent: false,
      },
      {
        source: '/app',
        has: onHost(MARKETING_HOST),
        destination: `${APP_ORIGIN}/app`,
        permanent: false,
      },
    ];
  },
  // Лендинг (статика public/landing.html) на корне — везде, КРОМЕ app-домена.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          missing: onHost(APP_HOST),
          destination: '/landing.html',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
