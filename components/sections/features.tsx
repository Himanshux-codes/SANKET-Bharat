'use client'

import { useReducedMotion } from 'framer-motion'
import {
  BellRing,
  Boxes,
  Copy,
  Home,
  Languages,
  Radar,
  ShieldAlert,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, type MouseEvent } from 'react'
import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/section'
import { FEATURES } from '@/lib/site-data'
import { useLanguage } from '@/lib/i18n/i18n-context'

const ICONS: Record<string, LucideIcon> = {
  Radar,
  Copy,
  ShieldAlert,
  TrendingUp,
  Boxes,
  Home,
  BellRing,
  Languages,
}

function FeatureCard({
  feature,
}: {
  feature: (typeof FEATURES)[number]
}) {
  const Icon = ICONS[feature.icon] ?? Radar
  const reduce = useReducedMotion()

  // Spotlight follows the pointer across the card surface.
  const handleMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (reduce) return
      const rect = event.currentTarget.getBoundingClientRect()
      event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
    },
    [reduce],
  )

  return (
    <div
      onMouseMove={handleMove}
      className="glass glass-hover group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl p-6 sm:p-7"
    >
      {/* Pointer spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(16rem circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--accent) 12%, transparent), transparent 65%)',
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-white/[0.05] text-accent transition-all duration-500 group-hover:border-accent/45 group-hover:bg-accent/10 group-hover:text-accent">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <span className="rounded-full border border-border bg-white/[0.03] px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.08em] whitespace-nowrap text-muted-foreground uppercase">
          {feature.metric}
        </span>
      </div>

      <h3 className="relative text-lg font-semibold tracking-[-0.02em] text-foreground">
        {feature.title}
      </h3>
      <p className="relative text-pretty text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>

      {/* Bottom glow hairline reveals on hover */}
      <span
        aria-hidden
        className="absolute inset-x-6 bottom-0 h-px scale-x-0 bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] transition-transform duration-700 ease-out group-hover:scale-x-100"
      />
    </div>
  )
}

export function Features() {
  const { t } = useLanguage()

  return (
    <Section id="features" label="Platform capabilities">
      <SectionHeader
        eyebrow={t.features.eyebrow}
        title={
          <>
            {t.features.titlePart1}{' '}
            <span className="text-gradient">{t.features.titleGradient}</span>
          </>
        }
        description={t.features.description}
      />

      <RevealGroup
        className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.07}
      >
        {FEATURES.map((feature) => (
          <RevealItem key={feature.title}>
            <FeatureCard feature={feature} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
