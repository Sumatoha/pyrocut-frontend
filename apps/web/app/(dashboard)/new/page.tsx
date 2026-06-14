import { Wizard } from '@/components/new/wizard';
import { getProfile } from '@/lib/auth/profile';

export default async function NewVideoPage() {
  const profile = await getProfile();
  return (
    <div className="mx-auto max-w-[820px]">
      <Wizard plan={profile?.plan ?? 'free'} />
    </div>
  );
}
