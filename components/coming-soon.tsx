'use client'

import { ArrowRight, CircleDashed, Map as MapIcon } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section } from '@/components/section'
import { GlowLink } from '@/components/ui/glow-button'

/**
 * Route scaffold for application surfaces that are reserved but not built
 * yet. Keeps the shell, chrome and motion language consistent so each screen
 * can be filled in without touching layout.
 */
export function ComingSoon({
  status,
  summary,
  planned,
}: {
  status: string
  summary: string
  planned: readonly string[]
}) {
  return (
    <Section className="pt-10 pb-28" label="Planned capabilities">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9">
          {/* Scanning hairline reused from the map card treatment */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scan bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]"
          />

          <div className="flex flex-col gap-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1.5 font-mono text-[0.66rem] tracking-[0.16em] text-warning uppercase">
                <CircleDashed className="h-3 w-3 animate-spin [animation-duration:3s]" />
                {status}
              </span>
              <span className="font-mono text-[0.66rem] tracking-[0.16em] text-muted-foreground uppercase">
                Route scaffolded
              </span>
            </div>

            <p className="max-w-2xl text-pretty leading-relaxed text-foreground/85">{summary}</p>

            <div className="flex flex-col gap-4">
              <h2 className="font-mono text-[0.66rem] tracking-[0.18em] text-accent uppercase">
                Planned in this module
              </h2>
              <RevealGroup className="grid gap-3 sm:grid-cols-2" stagger={0.06}>
                {planned.map((item) => (
                  <RevealItem key={item}>
                    <div className="flex items-start gap-3 rounded-2xl border border-border bg-white/[0.03] px-4 py-3.5 transition-colors duration-500 hover:border-accent/30">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70"
                      />
                      <span className="text-pretty text-sm leading-relaxed text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
              <GlowLink href="/live-map" variant="primary">
                <MapIcon className="h-4 w-4" />
                Explore the Demo Map
              </GlowLink>
              <GlowLink href="/" variant="ghost">
                Back to Overview
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </GlowLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
