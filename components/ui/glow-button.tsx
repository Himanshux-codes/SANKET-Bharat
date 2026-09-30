'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

const BASE =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-medium tracking-tight transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const SIZES = {
  sm: 'h-9 px-4',
  md: 'h-11 px-6',
  lg: 'h-12 px-7 text-[0.95rem]',
} as const

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-primary-foreground shadow-[0_10px_40px_-14px_var(--primary)] hover:shadow-[0_18px_60px_-14px_var(--primary)] hover:-translate-y-0.5',
  ghost:
    'border border-border bg-white/[0.03] text-foreground backdrop-blur-xl hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_16px_50px_-24px_var(--accent)]',
  danger:
    'text-destructive-foreground shadow-[0_10px_40px_-14px_var(--destructive)] hover:shadow-[0_18px_60px_-12px_var(--destructive)] hover:-translate-y-0.5',
}

export function GlowButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  children: ReactNode
  variant?: Variant
  size?: keyof typeof SIZES
}) {
  return (
    <button
      className={cn(BASE, SIZES[size], VARIANTS[variant], className)}
      {...props}
    >
      {/* Animated gradient fill */}
      {variant !== 'ghost' && (
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 -z-10 bg-[length:200%_100%] bg-[position:0%_0%] transition-[background-position] duration-700 ease-out group-hover:bg-[position:100%_0%]',
            variant === 'primary'
              ? 'bg-[linear-gradient(100deg,var(--primary),#22d3ee,var(--primary))]'
              : 'bg-[linear-gradient(100deg,var(--destructive),#ff8a5b,var(--destructive))]',
          )}
        />
      )}

      {/* Sheen sweep */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
      />

      {children}
    </button>
  )
}

export function GlowLink({
  children,
  className,
  variant = 'primary',
  size = 'md',
  href,
  ...props
}: Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  children: ReactNode
  href: string
  variant?: Variant
  size?: keyof typeof SIZES
}) {
  return (
    <Link
      href={href}
      className={cn(BASE, SIZES[size], VARIANTS[variant], className)}
      {...props}
    >
      {variant !== 'ghost' && (
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 -z-10 bg-[length:200%_100%] bg-[position:0%_0%] transition-[background-position] duration-700 ease-out group-hover:bg-[position:100%_0%]',
            variant === 'primary'
              ? 'bg-[linear-gradient(100deg,var(--primary),#22d3ee,var(--primary))]'
              : 'bg-[linear-gradient(100deg,var(--destructive),#ff8a5b,var(--destructive))]',
          )}
        />
      )}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
      />
      {children}
    </Link>
  )
}
