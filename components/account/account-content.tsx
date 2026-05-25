"use client";

import { useState } from "react";
import Link from "next/link";

type Plan = "free" | "pro" | "lifetime";

type Props = {
  email: string;
  plan: Plan;
  subscription: {
    id: string;
    status: string;
    interval: string;
    current_period_end: string | null;
    canceled_at: string | null;
  } | null;
  licenseKey: {
    id: string;
    key: string;
    display_key: string;
    plan: string;
    activation_limit: number;
  } | null;
};

const PLAN_LABELS: Record<Plan, { label: string; badge: string }> = {
  free: { label: "Hobby", badge: "bg-bg-soft text-muted" },
  pro: { label: "Founder", badge: "bg-violet-soft text-violet" },
  lifetime: { label: "Lifetime", badge: "bg-heat-soft text-heat" },
};

export function AccountContent({ email, plan, subscription, licenseKey }: Props) {
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const planInfo = PLAN_LABELS[plan];

  const handleCopy = async () => {
    if (!licenseKey) return;
    await navigator.clipboard.writeText(licenseKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Plan card */}
      <div className="rounded-[22px] border border-line bg-surface p-8 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-sm text-muted">Current plan</span>
            <div className="mt-1 flex items-center gap-3">
              <h2 className="font-sans text-2xl font-bold">{planInfo.label}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${planInfo.badge}`}
              >
                {plan === "lifetime" ? "No renewal" : plan === "pro" ? "Active" : "Free"}
              </span>
            </div>
          </div>
          {plan === "free" && (
            <Link
              href="/#pricing"
              className="rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-px"
            >
              Upgrade
            </Link>
          )}
        </div>

        {subscription && (
          <div className="mt-6 flex gap-8 text-sm">
            <div>
              <span className="text-muted">Billing</span>
              <p className="mt-0.5 font-medium">
                {subscription.interval === "month" ? "Monthly" : "Yearly"}
              </p>
            </div>
            {subscription.current_period_end && (
              <div>
                <span className="text-muted">
                  {subscription.canceled_at ? "Access until" : "Next billing"}
                </span>
                <p className="mt-0.5 font-medium">
                  {new Date(subscription.current_period_end).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" },
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* License key card */}
      {licenseKey && (
        <div className="rounded-[22px] border border-line bg-surface p-8 shadow-card">
          <span className="text-sm text-muted">License key</span>
          <div className="mt-3 flex items-center gap-3">
            <code className="flex-1 rounded-[10px] border border-line bg-bg-soft px-4 py-3 font-mono text-sm">
              {keyVisible ? licenseKey.key : licenseKey.display_key}
            </code>
            <button
              type="button"
              onClick={() => setKeyVisible((v) => !v)}
              className="rounded-[10px] border border-line-strong px-3 py-3 text-sm transition-colors hover:bg-bg-soft"
            >
              {keyVisible ? "Hide" : "Show"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-[10px] border border-line-strong px-3 py-3 text-sm transition-colors hover:bg-bg-soft"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">
            Activations: {licenseKey.activation_limit} devices max
          </p>
        </div>
      )}

      {/* Download */}
      <div className="rounded-[22px] border border-line bg-surface p-8 shadow-card">
        <span className="text-sm text-muted">Download</span>
        <div className="mt-3">
          <a
            href="/api/download/pyrocut"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-noir-3"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12v1h10v-1" />
            </svg>
            Download Pyrocut for Mac
          </a>
          <p className="mt-2 text-xs text-muted">
            macOS 14+ · Apple Silicon & Intel · Signed & notarized
          </p>
        </div>
      </div>

      {/* Account settings */}
      <div className="rounded-[22px] border border-line bg-surface p-8 shadow-card">
        <span className="text-sm text-muted">Account</span>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="text-ink">{email}</span>
        </div>
      </div>
    </div>
  );
}
