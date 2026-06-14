import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // signed URLs от Supabase storage; домен подставится из env при настройке
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
