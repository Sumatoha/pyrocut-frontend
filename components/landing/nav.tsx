"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { PyrocutLogo } from "./logo";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#showcase", label: "Showcase" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 backdrop-blur-[14px] bg-white/[0.74] border-b transition-colors duration-200 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6 px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-sans font-semibold text-lg tracking-[-0.01em] text-ink"
        >
          <PyrocutLogo size={28} />
          {SITE.name}
        </Link>

        <div className="hidden items-center gap-9 text-sm text-ink md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="opacity-[0.78] transition-opacity hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-[18px]">
          <Link
            href="/login"
            className="text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-violet px-4 py-2.5 text-[13px] font-medium text-white shadow-[0_6px_0_-2px_rgba(91,77,239,0.4),0_14px_34px_-12px_rgba(91,77,239,0.6)] transition-transform hover:-translate-y-px active:translate-y-0"
          >
            Get started — free
          </Link>
        </div>
      </div>
    </nav>
  );
}
