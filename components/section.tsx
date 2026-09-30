import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/reveal'

export function Section({
  id,
  children,
  className,
  label,
}: {
  id?: string
  children: ReactNode
  className?: string
  label?: string
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn(
        'relative z-10 scroll-mt-24 px-5 py-24 sm:px-8 md:py-32',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.18em] text-accent uppercase backdrop-blur-xl">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {children}
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'mx-auto max-w-3xl items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="none">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-[3.25rem] md:leading-[1.05]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              'text-pretty leading-relaxed text-muted-foreground md:text-lg',
              align === 'center' ? 'max-w-2xl' : 'max-w-2xl',
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
