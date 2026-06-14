'use client';

import { useState } from 'react';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { getSupabase, supabaseConfigured } from '@/lib/client/supabase';

export function LoginForm({ nextPath = '/' }: { nextPath?: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'magic' | 'google' | null>(null);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
      : undefined;

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) {
      toast.error('auth not configured', 'set NEXT_PUBLIC_SUPABASE_* env');
      return;
    }
    setLoading('magic');
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(null);
    if (error) {
      toast.error('could not send link', error.message);
      return;
    }
    setSent(true);
  }

  async function signInGoogle() {
    const sb = getSupabase();
    if (!sb) {
      toast.error('auth not configured', 'set NEXT_PUBLIC_SUPABASE_* env');
      return;
    }
    setLoading('google');
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) {
      setLoading(null);
      toast.error('google sign-in failed', error.message);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-[400px] text-center">
        <span className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-ember-soft text-ember">
          <CheckCircle2 className="size-6" />
        </span>
        <h1 className="display text-2xl text-ink">check your inbox</h1>
        <p className="mt-3 text-sm text-muted">
          we sent a magic link to <span className="text-ink2">{email}</span>.
          click it to sign in.
        </p>
        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => setSent(false)}
        >
          use a different email
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="display text-3xl text-ink">sign in to pyrocut</h1>
      <p className="mt-2 text-sm text-muted">
        turn a landing url into a launch video.
      </p>

      {!supabaseConfigured && (
        <div className="mt-5 rounded-[14px] border border-ember/30 bg-ember-soft/50 px-4 py-3 text-[13px] text-ink2">
          auth is in degraded mode — set{' '}
          <code className="font-[family-name:var(--font-mono)]">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{' '}
          and{' '}
          <code className="font-[family-name:var(--font-mono)]">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          .
        </div>
      )}

      <form onSubmit={sendMagicLink} className="mt-7 space-y-3">
        <label className="block">
          <span className="microlabel">email</span>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@startup.com"
              className="h-12 w-full rounded-[14px] border border-hair-strong bg-paper pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-ember"
            />
          </div>
        </label>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading === 'magic'}
        >
          send magic link
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-hair" />
        <span className="microlabel">or</span>
        <span className="h-px flex-1 bg-hair" />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        loading={loading === 'google'}
        onClick={signInGoogle}
      >
        <GoogleMark /> continue with google
      </Button>

      <p className="mt-6 text-center text-[12px] text-faint">
        by continuing you agree to the terms & privacy policy.
      </p>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
