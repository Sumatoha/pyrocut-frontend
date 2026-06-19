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
  'transition-[transform,background-position,box-shadow,border-color,color,opacity] ' +
  'duration-300 ease-[var(--ease-out-expo)] ' +
  'disabled:opacity-50 disabled:pointer-events-none ' +
  'active:scale-[0.97] active:duration-100 ' +
  "font-[family-name:var(--font-mono)]";

const variants: Record<Variant, string> = {
  primary:
    'brand-grad bg-[length:180%_auto] bg-left text-white ' +
    'shadow-[0_8px_24px_-10px_rgba(109,74,255,0.55)] ' +
    'hover:bg-right hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-12px_rgba(109,74,255,0.7)]',
  dark: 'bg-ink text-white hover:-translate-y-0.5 hover:bg-[#1c1a22] hover:shadow-pop',
  ghost: 'bg-transparent text-ink hover:bg-black/[0.05]',
  outline:
    'bg-paper text-ink border border-hair-strong hover:border-ink/25 hover:bg-black/[0.03] hover:-translate-y-0.5',
  danger:
    'bg-transparent text-ink border border-hair-strong hover:border-ember hover:bg-ember-soft/40 hover:text-ember',
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
