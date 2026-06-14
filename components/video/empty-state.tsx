import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { buttonClass } from '@/components/ui/button';
import { RecTimer } from '@/components/motion/rec-timer';

/** Пустое состояние дашборда — крупный CTA. */
export function EmptyState() {
  return (
    <div className="mx-auto max-w-[640px] py-10 text-center">
      <div
        className="win-surface relative mx-auto mb-8 flex aspect-video max-w-[440px] items-center justify-center overflow-hidden rounded-[var(--radius-card)] shadow-win"
        style={{
          background:
            'radial-gradient(120% 80% at 30% 0%, #3a1f12 0%, transparent 55%), radial-gradient(140% 90% at 90% 100%, #241a3a 0%, transparent 60%), linear-gradient(180deg, #17141f, #100e16)',
        }}
      >
        <RecTimer time="00:00:00" className="absolute left-4 top-4" />
        <Sparkles className="size-9 text-ember" />
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
