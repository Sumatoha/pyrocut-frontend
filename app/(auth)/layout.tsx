import Link from 'next/link';
import { Wordmark } from '@/components/brand/logo';
import { RecTimer } from '@/components/motion/rec-timer';
import { Scrubber } from '@/components/ui/scrubber';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-dvh bg-paper lg:grid-cols-[1fr_minmax(420px,44%)]">
      {/* левая колонка — форма */}
      <div className="relative flex flex-col">
        {/* тёплый угловой wash как на лендинге */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 50% at 100% 0%, var(--color-wash), transparent 70%)',
          }}
        />
        <header className="w-full px-6 py-6 sm:px-10">
          <Link href="/" aria-label="pyrocut home">
            <Wordmark />
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 pb-24">
          {children}
        </main>
      </div>

      {/* правая колонка — тёмная «сцена продукта» (герой-объект) */}
      <aside
        aria-hidden="true"
        className="win-surface relative m-4 hidden overflow-hidden rounded-[var(--radius-lg2)] shadow-win lg:block"
        style={{
          background:
            'radial-gradient(120% 90% at 80% 0%, #2f2360 0%, transparent 55%), radial-gradient(110% 80% at 10% 100%, #3a1f12 0%, transparent 52%), linear-gradient(180deg, #17141f, #100e16)',
        }}
      >
        {/* плёночная зернистость */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* дрейфующие свечения */}
        <div
          className="pointer-events-none absolute -left-1/4 top-[-25%] aspect-square w-2/3 rounded-full blur-3xl animate-[var(--animate-drift)]"
          style={{
            background:
              'radial-gradient(circle, rgba(109,74,255,0.4), transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute -right-1/4 bottom-[-25%] aspect-square w-2/3 rounded-full blur-3xl animate-[var(--animate-drift)]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,90,31,0.35), transparent 70%)',
            animationDelay: '-6s',
          }}
        />

        <RecTimer time="00:00:12" className="absolute left-6 top-6" />
        <span className="absolute right-6 top-6 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em] text-white/50">
          16:9 · 1080P
        </span>

        <div className="absolute inset-x-10 top-1/2 -translate-y-1/2">
          <p className="display text-4xl text-white xl:text-5xl">
            paste a url.
            <br />
            <span className="text-white/60">watch it become</span>
            <br />a <span className="brand-grad-text">video</span>.
          </p>
          <p className="mt-5 max-w-[340px] font-[family-name:var(--font-mono)] text-[13px] leading-relaxed text-white/50">
            your brand — palette, type, real screens — read straight from the
            page and cut into a directed launch reel.
          </p>
        </div>

        <div className="absolute inset-x-8 bottom-8 flex items-center gap-4">
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-white/60">
            0:06
          </span>
          <Scrubber value={0.38} active onDark className="flex-1" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums text-white/60">
            0:18
          </span>
        </div>
      </aside>
    </div>
  );
}
