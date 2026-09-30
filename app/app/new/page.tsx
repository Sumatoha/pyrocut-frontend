import { Suspense } from 'react';
import { Wizard } from '@/components/new/wizard';
import { getProfile } from '@/lib/auth/profile';

export default async function NewVideoPage() {
  const profile = await getProfile();
  return (
    <div className="mx-auto max-w-[820px]">
      {/* Suspense — требование Next для useSearchParams (?p=<project>) в клиентском визарде */}
      <Suspense fallback={null}>
        <Wizard plan={profile?.plan ?? 'free'} />
      </Suspense>
    </div>
  );
}
