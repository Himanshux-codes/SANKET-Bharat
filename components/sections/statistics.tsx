'use client'

import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/section'
import { ICONS } from '@/lib/icons'
import { STATS } from '@/lib/site-data'
import { useLanguage } from '@/lib/i18n/i18n-context'

function StatCard({ stat }: { stat: (typeof STATS)[number] }) {
  const Icon = ICONS[stat.icon] ?? ICONS.Radar

  return (
    <div className="glass glass-hover group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl p-6">
      {/* Hairline that draws in on hover, matching the feature cards */}
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--accent),transparent)] transition-transform duration-700 group-hover:scale-x-100"
      />

      <Icon
        className="h-5 w-5 text-accent transition-transform duration-500 group-hover:scale-110"
        strokeWidth={1.8}
      />

      <p className="font-mono text-3xl font-semibold text-foreground">{stat.value}</p>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold tracking-[0.06em] text-foreground uppercase">
          {stat.label}
        </h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {stat.description}
        </p>
      </div>
    </div>
  )
}

export function Statistics() {
  const { t } = useLanguage()
  return (
    <Section id="statistics" label="Platform statistics">
      <SectionHeader
        eyebrow={t.statistics.eyebrow}
        title={
          <>
            {t.statistics.titlePart1}{' '}
            <span className="text-gradient">{t.statistics.titleGradient}</span>
          </>
        }
        description={t.statistics.description}
      />

      <RevealGroup
        className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.07}
      >
        {STATS.map((stat) => (
          <RevealItem key={stat.label} className="h-full">
            <StatCard stat={stat} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
