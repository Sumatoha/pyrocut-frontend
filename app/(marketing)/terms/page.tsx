import type { Metadata } from "next";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[720px] px-8 py-24">
        <h1 className="font-mono text-4xl font-bold tracking-[-0.02em]">
          Terms of Service
        </h1>
        <div className="mt-8 flex flex-col gap-6 text-sm leading-[1.7] text-ink-soft">
          <p>
            By using Pyrocut, you agree to the following terms.
          </p>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            License
          </h2>
          <p>
            Pyrocut grants you a personal, non-transferable license to use the
            software on the number of devices specified by your plan. You may not
            redistribute, resell, or sublicense the software.
          </p>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            Refund policy
          </h2>
          <p>
            We offer a 14-day refund policy, no questions asked. Email{" "}
            <a href="mailto:hello@pyrocut.app" className="text-violet">
              hello@pyrocut.app
            </a>{" "}
            within 14 days of purchase for a full refund.
          </p>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            Service availability
          </h2>
          <p>
            Pyrocut is a desktop application that runs locally. The license
            validation service may experience downtime. The app is designed to
            work offline for up to 7 days between validation checks.
          </p>

          <h2 className="mt-4 font-mono text-lg font-bold text-ink">
            Limitation of liability
          </h2>
          <p>
            Pyrocut is provided &quot;as is&quot; without warranty of any kind.
            We are not liable for any damages arising from the use of the
            software.
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
