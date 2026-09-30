import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/reveal'
import { Eyebrow } from '@/components/section'
import { cn } from '@/lib/utils'

/**
 * Shared masthead for application routes. Clears the fixed navbar and reuses
 * the homepage eyebrow, typography scale and reveal timing.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        'relative z-10 px-5 pt-32 pb-4 sm:px-8 sm:pt-36 md:pt-40',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <Reveal direction="none">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="max-w-4xl text-balance text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.04em] sm:text-5xl md:text-[3.5rem]">
            {title}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.12}>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          </Reveal>
        )}

        {actions && (
          <Reveal delay={0.18}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>
          </Reveal>
        )}
      </div>
    </header>
  )
}
