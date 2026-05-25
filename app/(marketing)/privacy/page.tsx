import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[720px] px-8 py-24">
        <h1 className="font-mono text-4xl font-bold tracking-[-0.02em]">
          Privacy Policy
        </h1>
        <div className="mt-8 flex flex-col gap-6 text-sm leading-[1.7] text-ink-soft">
          <p>
            Pyrocut is built by founders who value privacy. Here&apos;s how we handle
            your data.
          </p>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            What we collect
          </h2>
          <p>
            When you create an account, we store your email address and hashed
            password (via Supabase Auth). When you purchase a license, Polar.sh
            processes the payment — we store your license key, plan type, and
            subscription status.
          </p>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            What we don&apos;t collect
          </h2>
          <p>
            Your screen recordings never leave your Mac. Pyrocut processes
            everything locally. We don&apos;t collect analytics, don&apos;t run tracking
            pixels, and don&apos;t sell your data.
          </p>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            License validation
          </h2>
          <p>
            The app validates your license key once every 7 days by contacting
            our server. This sends your license key and a device identifier (a
            randomly generated UUID, not your Mac serial number). No other data
            is transmitted.
          </p>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            Third-party services
          </h2>
          <ul className="list-inside list-disc">
            <li>Supabase — authentication and database</li>
            <li>Polar.sh — payment processing and license management</li>
            <li>Resend — transactional email delivery</li>
            <li>Vercel — hosting</li>
          </ul>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            Data deletion
          </h2>
          <p>
            You can delete your account from the account portal at any time.
            This removes all your data from our systems. Email{" "}
            <a href="mailto:hello@pyrocut.app" className="text-violet">
              hello@pyrocut.app
            </a>{" "}
            if you need help.
          </p>

          <p className="mt-8 text-xs text-muted">
            Last updated: May 2026
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
