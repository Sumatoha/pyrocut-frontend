import type { ReactNode } from "react";
import Link from "next/link";
import { PyrocutLogo } from "@/components/landing/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 py-12">
      <Link href="/" className="mb-10 flex items-center gap-2.5 font-sans text-lg font-semibold text-ink">
        <PyrocutLogo size={32} />
        pyrocut
      </Link>
      <div className="w-full max-w-[400px]">{children}</div>
    </div>
  );
}
