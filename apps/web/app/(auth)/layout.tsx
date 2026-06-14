import Link from 'next/link';
import { Wordmark } from '@/components/brand/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-paper">
      {/* тёплый угловой wash как на лендинге */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 100% 0%, var(--color-wash), transparent 70%)',
        }}
      />
      <header className="mx-auto w-full max-w-[1180px] px-6 py-6">
        <Link href="/" aria-label="pyrocut home">
          <Wordmark />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-24">
        {children}
      </main>
    </div>
  );
}
