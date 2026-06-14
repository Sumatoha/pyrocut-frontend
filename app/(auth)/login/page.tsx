import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="w-full max-w-[400px]">
      {error && (
        <div className="mb-5 rounded-[14px] border border-ember/40 bg-ember-soft/60 px-4 py-3 text-[13px] text-ink2">
          sign-in link was invalid or expired. try again.
        </div>
      )}
      <LoginForm nextPath={next ?? '/'} />
    </div>
  );
}
