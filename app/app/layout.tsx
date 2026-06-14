import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import { TopBar } from '@/components/layout/top-bar';
import { getProfile } from '@/lib/auth/profile';
import { authConfigured } from '@/lib/auth/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = authConfigured();
  const profile = configured ? await getProfile() : null;

  return (
    <div className="min-h-dvh bg-paper">
      <TopBar
        plan={profile?.plan ?? 'free'}
        email={profile?.email}
        credits={profile?.credits ?? 0}
      />
      {!configured && <DegradedBanner />}
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}

function DegradedBanner() {
  return (
    <div className="border-b border-ember/25 bg-ember-soft/50">
      <div className="mx-auto flex max-w-[1180px] items-center gap-2.5 px-5 py-2.5 text-[12px] text-ink2 sm:px-8">
        <TriangleAlert className="size-4 shrink-0 text-ember" />
        <span>
          running without supabase — auth & realtime are disabled. set{' '}
          <code className="font-[family-name:var(--font-mono)]">
            NEXT_PUBLIC_SUPABASE_*
          </code>{' '}
          in <code className="font-[family-name:var(--font-mono)]">.env.local</code>.
        </span>
        <Link
          href="/login"
          className="ml-auto hidden underline underline-offset-2 hover:text-ink sm:inline"
        >
          login screen →
        </Link>
      </div>
    </div>
  );
}
