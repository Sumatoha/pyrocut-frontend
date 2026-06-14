'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import type { Plan } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { Wordmark } from '@/components/brand/logo';
import { buttonClass } from '@/components/ui/button';
import { AccountMenu } from '@/components/layout/account-menu';

const links = [
  { href: '/', label: 'videos' },
  { href: '/billing', label: 'billing' },
];

export function TopBar({
  plan = 'free',
  email,
  credits = 0,
}: {
  plan?: Plan;
  email?: string;
  credits?: number;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-hair bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-6 px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="pyrocut home">
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-full px-3 py-1.5 font-[family-name:var(--font-mono)] text-[13px] transition-colors',
                  isActive(l.href)
                    ? 'bg-black/[0.05] text-ink'
                    : 'text-muted hover:text-ink',
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/new"
            aria-label="new video"
            className={buttonClass('primary', 'sm', 'gap-1.5')}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">new video</span>
          </Link>
          <AccountMenu email={email} plan={plan} credits={credits} />
        </div>
      </div>
    </header>
  );
}
