import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { buttonClass } from '@/components/ui/button';
import { RecTimer } from '@/components/motion/rec-timer';

/** Пустое состояние дашборда — крупный CTA. */
export function EmptyState() {
  return (
    <div className="rise-in mx-auto max-w-[640px] py-10 text-center">
      <div
        className="win-surface group relative mx-auto mb-8 flex aspect-video max-w-[440px] items-center justify-center overflow-hidden rounded-[var(--radius-card)] shadow-win"
        style={{
          background:
            'radial-gradient(130% 90% at 78% 8%, #2f2360 0%, transparent 58%), radial-gradient(120% 80% at 18% 100%, #3a1f12 0%, transparent 55%), linear-gradient(180deg, #17141f, #100e16)',
        }}
      >
        <RecTimer time="00:00:00" className="absolute left-4 top-4" />
        {/* зернистость как на лендинге */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <span className="grid size-16 place-items-center rounded-full bg-white/5 ring-1 ring-winline animate-[var(--animate-float)]">
          <Sparkles className="size-8 text-violet2" />
        </span>
        <span className="sheen -translate-x-[130%] transition-transform duration-[850ms] ease-[var(--ease-out-soft)] group-hover:translate-x-[130%]" />
      </div>

      <h1 className="display text-4xl text-ink sm:text-5xl">
        create your first video
      </h1>
      <p className="mx-auto mt-4 max-w-[420px] text-sm text-muted">
        paste a landing url — pyrocut pulls your brand and cuts a launch teaser
        or social reel in one pass.
      </p>

      <Link href="/app/new" className={buttonClass('primary', 'lg', 'mt-7')}>
        paste a landing url
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
