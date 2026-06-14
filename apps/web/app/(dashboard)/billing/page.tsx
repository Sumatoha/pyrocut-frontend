import { Plans } from '@/components/billing/plans';
import { getProfile } from '@/lib/auth/profile';

export default async function BillingPage() {
  const profile = await getProfile();
  return (
    <Plans current={profile?.plan ?? 'free'} credits={profile?.credits ?? 0} />
  );
}
