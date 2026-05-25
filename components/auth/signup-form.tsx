"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { OAuthButtons } from "./oauth-buttons";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setConfirmSent(true);
    setLoading(false);
  };

  if (confirmSent) {
    return (
      <div className="text-center">
        <h1 className="font-mono text-2xl font-bold tracking-[-0.02em]">
          Check your email
        </h1>
        <p className="mt-3 text-sm text-muted">
          We sent a confirmation link to{" "}
          <strong className="text-ink">{email}</strong>. Click it to activate
          your account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-mono text-2xl font-bold tracking-[-0.02em]">
        Create your account
      </h1>
      <p className="mt-2 text-center text-sm text-muted">
        Free to start. Upgrade when you&apos;re ready.
      </p>

      <div className="mt-8">
        <OAuthButtons />
      </div>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-12 rounded-[10px] border border-line-strong bg-surface px-4 font-mono text-sm text-ink outline-none transition-colors focus:border-violet"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
            className="h-12 rounded-[10px] border border-line-strong bg-surface px-4 font-mono text-sm text-ink outline-none transition-colors focus:border-violet"
            placeholder="8+ characters"
          />
        </label>

        {error && (
          <p className="text-sm text-[#e53e3e]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center rounded-full bg-violet font-mono text-sm font-medium text-white shadow-[0_6px_0_-2px_rgba(91,77,239,0.4),0_14px_34px_-12px_rgba(91,77,239,0.6)] transition-transform hover:-translate-y-px active:translate-y-0 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink">
          Sign in
        </Link>
      </p>
    </div>
  );
}
