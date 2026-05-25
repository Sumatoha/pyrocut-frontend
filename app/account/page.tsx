import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PyrocutLogo } from "@/components/landing/logo";
import { AccountContent } from "@/components/account/account-content";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: subscription }, { data: lifetimeLicense }, { data: licenseKey }] =
    await Promise.all([
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle(),
      supabase
        .from("lifetime_licenses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("license_keys")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  const plan = lifetimeLicense ? "lifetime" : subscription ? "pro" : "free";

  return (
    <div className="min-h-dvh bg-bg">
      <nav className="border-b border-line">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-sans text-lg font-semibold text-ink"
          >
            <PyrocutLogo size={28} />
            pyrocut
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-full border border-line-strong px-4 py-2 text-sm text-ink transition-colors hover:bg-bg-soft"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[980px] px-8 py-12">
        <h1 className="font-mono text-3xl font-bold tracking-[-0.02em]">
          Account
        </h1>
        <AccountContent
          email={user.email ?? ""}
          plan={plan}
          subscription={subscription}
          licenseKey={licenseKey}
        />
      </main>
    </div>
  );
}
