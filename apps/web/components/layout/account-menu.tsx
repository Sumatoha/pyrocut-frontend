'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CreditCard, LogOut } from 'lucide-react';
import type { Plan } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { Chip } from '@/components/ui/chip';
import { signOut } from '@/lib/auth/actions';

export function AccountMenu({
  email,
  plan,
  credits,
}: {
  email?: string;
  plan: Plan;
  credits: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (email?.trim()?.[0] ?? 'u').toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="account"
        title={email}
        className="grid size-9 place-items-center rounded-full bg-ink text-[13px] font-medium text-white transition-transform hover:scale-105"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 w-60 origin-top-right animate-[popin_.12s_ease] rounded-[16px] border border-hair bg-paper p-2 shadow-pop"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-[13px] text-ink">{email ?? 'signed in'}</p>
            <div className="mt-2 flex items-center gap-2">
              <Chip tone={plan === 'free' ? 'neutral' : 'ember'}>{plan}</Chip>
              <span className="microlabel">{credits} credits</span>
            </div>
          </div>
          <div className="my-1 h-px bg-hair" />
          <MenuItem href="/billing" onSelect={() => setOpen(false)}>
            <CreditCard className="size-4" /> billing & plan
          </MenuItem>
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className={cn(
                'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13px] text-ink2',
                'transition-colors hover:bg-black/[0.04] hover:text-ink',
              )}
            >
              <LogOut className="size-4" /> sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  onSelect,
  children,
}: {
  href: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] text-ink2 transition-colors hover:bg-black/[0.04] hover:text-ink"
    >
      {children}
    </Link>
  );
}
