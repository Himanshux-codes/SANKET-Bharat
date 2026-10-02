'use client'

import { ArrowRight, Map as MapIcon } from 'lucide-react'
import { IncidentAreaChart } from '@/components/dashboard/charts'
import { Panel, Widget } from '@/components/dashboard/widget'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/section'
import { GlowLink } from '@/components/ui/glow-button'
import { DASHBOARD_WIDGETS } from '@/lib/site-data'

/** Four headline KPIs — the full six live on the command center route. */
const PREVIEW_WIDGETS = DASHBOARD_WIDGETS.slice(0, 4)

/**
 * Compact taste of the command center for the landing page. The complete
 * dashboard and the full national map live on their own routes so the
 * homepage stays short.
 */
export function DashboardPreview() {
  return (
    <Section id="dashboard" label="Dashboard preview">
      <SectionHeader
        eyebrow="Platform overview"
        title={
          <>
            Explore a browser demo of{' '}
            <span className="text-gradient">incident review</span>
          </>
        }
        description="Illustrative charts and unavailable operational measurements. Open the local review demo or static scenario map."
      />

      {/* Headline KPIs */}
      <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
        {PREVIEW_WIDGETS.map((widget) => (
          <RevealItem key={widget.label}>
            <Widget widget={widget} />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Single trend panel keeps the preview short */}
      <Reveal className="mt-5" delay={0.08} amount={0.15}>
        <Panel title="Incident trend" hint="Illustrative chart · fixed sample values">
          <IncidentAreaChart />
        </Panel>
      </Reveal>

      <Reveal className="mt-8" delay={0.12}>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Six KPIs, four analytics panels and the full national incident grid are one click
            away.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <GlowLink href="/dashboard" variant="primary">
              Open Command Center
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </GlowLink>
            <GlowLink href="/live-map" variant="ghost">
              <MapIcon className="h-4 w-4" />
              View Demo Map
            </GlowLink>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
