import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // signed URLs от Supabase storage; домен подставится из env при настройке
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // Публичный лендинг (статика в public/landing.html) отдаётся на корне.
  // Продукт-дашборд живёт под /app. beforeFiles — чтобы / всегда был лендингом.
  async rewrites() {
    return {
      beforeFiles: [{ source: '/', destination: '/landing.html' }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
