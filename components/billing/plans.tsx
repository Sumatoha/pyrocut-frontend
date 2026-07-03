'use client';

import { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { PLANS, type Plan } from '@pyrocut/shared';
import { cn } from '@/lib/cn';
import { api, ApiError } from '@/lib/client/api';
import { DEMO_MODE } from '@/lib/client/demo';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { useToast } from '@/components/ui/toast';

interface PlanCard {
  id: Plan;
  name: string;
  price: string;
  per: string;
  blurb: string;
  features: string[];
  popular?: boolean;
}

// MAPPING (см. PROGRESS → DECISIONS): free=Hobby, pro=Founder, studio=Studio.
const CARDS: PlanCard[] = [
  {
    id: 'free',
    name: 'hobby',
    price: '$0',
    per: 'forever',
    blurb: 'for weekend projects',
    features: [
      '3 videos / month',
      '720p export · watermark',
      'dolly preset',
      'live browser preview',
    ],
  },
  {
    id: 'pro',
    name: 'founder',
    price: '$19',
    per: 'per month',
    blurb: 'for builders shipping in public',
    popular: true,
    features: [
      'unlimited videos',
      '1080p export · no watermark',
      'all presets + 9:16 reels',
      'brand kit + variations',
      'private share links',
    ],
  },
  {
    id: 'studio',
    name: 'studio',
    price: '$49',
    per: 'per month',
    blurb: 'for seed-stage teams',
    features: [
      'everything in founder',
      '4k export',
      'priority render queue',
      'team brand presets',
      'priority support',
    ],
  },
];

export function Plans({
  current,
  credits,
}: {
  current: Plan;
  credits: number;
}) {
  const [loading, setLoading] = useState<Plan | null>(null);
  const toast = useToast();

  async function upgrade(plan: Plan) {
    if (plan === current) return;
    // free — это даунгрейд/отмена подписки, не checkout (Polar не оформляет $0).
    // Narrowing ниже даёт api.checkout тип Exclude<Plan,'free'> без каста.
    if (plan === 'free') return;
    setLoading(plan);
    if (DEMO_MODE) {
      toast.toast('checkout is disabled in demo mode');
      setLoading(null);
      return;
    }
    try {
      const { url } = await api.checkout(plan);
      window.location.href = url;
    } catch (e) {
      toast.error(
        'could not start checkout',
        e instanceof ApiError ? e.message : undefined,
      );
      setLoading(null);
    }
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl text-ink">billing</h1>
          <p className="mt-2 text-sm text-muted">
            recording stays free. pay for the polish.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-[var(--radius-win)] border border-hair bg-wash px-4 py-2.5">
          <Zap className="size-4 text-ember" />
          <span className="text-[13px] text-ink2">
            <span className="font-[family-name:var(--font-mono)] text-ink">
              {credits}
            </span>{' '}
            credits
          </span>
          <span className="h-4 w-px bg-hair" />
          <Chip tone={current === 'free' ? 'neutral' : 'ember'}>{current}</Chip>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {CARDS.map((card) => (
          <PlanColumn
            key={card.id}
            card={card}
            current={current}
            loading={loading === card.id}
            onSelect={() => upgrade(card.id)}
          />
        ))}
      </div>

      <p className="text-center text-[12px] text-faint">
        plans billed monthly · cancel anytime · prices in usd
      </p>
    </div>
  );
}

function PlanColumn({
  card,
  current,
  loading,
  onSelect,
}: {
  card: PlanCard;
  current: Plan;
  loading: boolean;
  onSelect: () => void;
}) {
  const isCurrent = card.id === current;
  const rank = PLANS.indexOf(card.id);
  const currentRank = PLANS.indexOf(current);
  const isUpgrade = rank > currentRank;
  const dark = card.popular;

  return (
    <div
      className={cn(
        'relative flex flex-col gap-6 rounded-[var(--radius-card)] border p-7',
        'transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1',
        dark
          ? 'win-surface border-transparent shadow-win hover:shadow-[0_50px_100px_-45px_rgba(60,32,120,0.6)]'
          : 'border-hair bg-paper shadow-lift hover:shadow-pop',
      )}
      style={
        dark
          ? {
              background:
                'radial-gradient(120% 90% at 85% -10%, rgba(109,74,255,0.32), transparent 55%), radial-gradient(100% 80% at 0% 110%, rgba(255,90,31,0.2), transparent 55%), var(--color-win)',
            }
          : undefined
      }
    >
      {card.popular && (
        <>
          <span aria-hidden="true" className="ring-grad" />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full brand-grad px-3 py-1 text-[11px] font-medium text-white shadow-[0_6px_16px_-6px_rgba(109,74,255,0.7)]">
            most popular
          </span>
        </>
      )}

      <div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-[family-name:var(--font-display)] text-xl lowercase tracking-[-0.02em]',
              dark ? 'text-white' : 'text-ink',
            )}
          >
            {card.name}
          </span>
          {isCurrent && <Chip tone={dark ? 'win' : 'neutral'}>current</Chip>}
        </div>
        <p
          className={cn(
            'mt-1 text-[13px]',
            dark ? 'text-white/55' : 'text-muted',
          )}
        >
          {card.blurb}
        </p>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'font-[family-name:var(--font-display)] text-5xl tracking-[-0.04em]',
            dark ? 'text-white' : 'text-ink',
          )}
        >
          {card.price}
        </span>
        <span
          className={cn(
            'font-[family-name:var(--font-mono)] text-[12px]',
            dark ? 'text-white/55' : 'text-muted',
          )}
        >
          / {card.per}
        </span>
      </div>

      <Button
        variant={isCurrent ? 'outline' : dark ? 'primary' : 'dark'}
        className="w-full"
        loading={loading}
        disabled={isCurrent || card.id === 'free'}
        onClick={onSelect}
      >
        {isCurrent
          ? 'current plan'
          : card.id === 'free'
            ? 'free forever'
            : isUpgrade
              ? `upgrade to ${card.name}`
              : `switch to ${card.name}`}
      </Button>

      <ul className="space-y-2.5">
        {card.features.map((f) => (
          <li
            key={f}
            className={cn(
              'flex items-start gap-2.5 text-[13px]',
              dark ? 'text-white/85' : 'text-ink2',
            )}
          >
            <Check className="mt-0.5 size-4 shrink-0 text-ember" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
