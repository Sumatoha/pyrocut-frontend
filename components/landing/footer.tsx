import Link from "next/link";
import { SITE } from "@/lib/constants";
import { PyrocutLogo } from "./logo";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Showcase", href: "#showcase" },
    { label: "Changelog", href: "/changelog" },
  ],
  Docs: [
    { label: "Quickstart", href: "#" },
    { label: ".cut format", href: "#" },
    { label: "CLI reference", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: `mailto:${SITE.email}` },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

export function Footer() {
  return (
    <footer className="border-t border-line pb-10 pt-16">
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-sans text-lg font-semibold tracking-[-0.01em] text-ink"
            >
              <PyrocutLogo size={28} />
              {SITE.name}
            </Link>
            <p className="mt-4 max-w-[280px] text-[13px] text-muted">
              A Mac-native screen recorder for founders who&apos;d rather be
              building.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-4 font-mono text-[13px] font-medium text-muted">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => {
                  const isInternal =
                    link.href.startsWith("/") && !link.href.startsWith("mailto:");
                  const Component = isInternal ? Link : "a";
                  return (
                    <li key={link.label}>
                      <Component
                        href={link.href}
                        className="text-sm text-ink-soft transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Component>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-between border-t border-line pt-6 text-xs text-muted">
          <span>© 2026 pyrocut labs · made on a Mac, signed for one</span>
          <span>v1.0 — May 2026</span>
        </div>
      </div>
    </footer>
  );
}
