"use client";

import { createClient } from "@/lib/supabase/client";

function getRedirectUrl() {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${origin}/callback`;
}

export function OAuthButtons() {
  const handleOAuth = async (provider: "apple" | "google") => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getRedirectUrl() },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => handleOAuth("apple")}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-line-strong bg-ink font-mono text-sm font-medium text-white transition-colors hover:bg-noir-3"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <path d="M14.94 13.41c-.33.76-.49 1.1-.91 1.77-.59.93-1.42 2.09-2.45 2.1-0.92.01-1.15-.6-2.4-.59-1.24.01-1.5.6-2.42.59-1.03-.01-1.82-1.05-2.41-1.98C2.93 13.16 2.82 10.61 3.72 9.26c.64-.96 1.65-1.53 2.59-1.53.96 0 1.57.6 2.36.6.77 0 1.24-.6 2.35-.6.84 0 1.73.46 2.37 1.24-2.08 1.14-1.74 4.11.55 4.44zM11.35 6.22c.46-.59.81-1.42.68-2.27-.75.05-1.62.53-2.13 1.15-.46.56-.84 1.4-.69 2.22.81.03 1.66-.46 2.14-1.1z" />
        </svg>
        Continue with Apple
      </button>

      <button
        type="button"
        onClick={() => handleOAuth("google")}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-line-strong bg-surface font-mono text-sm font-medium text-ink transition-colors hover:bg-bg-soft"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853" />
          <path d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3-2.33z" fill="#FBBC05" />
          <path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
