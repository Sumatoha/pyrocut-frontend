import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'outline' | 'dark' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-full ' +
  'transition-[transform,background,box-shadow,border-color,opacity] duration-150 ' +
  'disabled:opacity-50 disabled:pointer-events-none active:translate-y-0 ' +
  "font-[family-name:var(--font-mono)]";

const variants: Record<Variant, string> = {
  primary:
    'ember-grad text-white shadow-[0_8px_24px_-10px_rgba(255,90,31,0.6)] ' +
    'hover:-translate-y-px hover:shadow-[0_14px_32px_-12px_rgba(255,90,31,0.7)]',
  dark: 'bg-ink text-white hover:bg-[#1c1a22]',
  ghost: 'bg-transparent text-ink hover:bg-black/[0.05]',
  outline:
    'bg-paper text-ink border border-hair-strong hover:bg-black/[0.03]',
  danger:
    'bg-transparent text-ink border border-hair-strong hover:border-ember hover:text-ember',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[52px] px-7 text-[15px]',
};

/** Классы кнопки для не-button элементов (напр. next/link). */
export function buttonClass(
  variant: Variant = 'primary',
  size: Size = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
