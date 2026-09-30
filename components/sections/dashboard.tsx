'use client'

import {
  DisasterPieChart,
  IncidentAreaChart,
  PressureHeatMap,
  ResponseBarChart,
} from '@/components/dashboard/charts'
import { Panel, Widget } from '@/components/dashboard/widget'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/section'
import { DASHBOARD_WIDGETS } from '@/lib/site-data'

export function Dashboard() {
  return (
    <Section id="dashboard" label="Command center dashboard">
      <SectionHeader
        eyebrow="Command center"
        title={
          <>
            One screen a district officer can{' '}
            <span className="text-gradient">act on at 3am</span>
          </>
        }
        description="Incident counts, trend pressure and AI confidence in a single view — no dashboard archaeology while reviewing disaster response data."
      />

      {/* KPI widgets */}
      <RevealGroup
        className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {DASHBOARD_WIDGETS.map((widget) => (
          <RevealItem key={widget.label}>
            <Widget widget={widget} />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Charts */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2" amount={0.15}>
          <Panel title="Incident trend" hint="Reports vs verified · 24h">
            <IncidentAreaChart />
          </Panel>
        </Reveal>

        <Reveal delay={0.08} amount={0.15}>
          <Panel title="Severity distribution" hint="By hazard type">
            <DisasterPieChart />
          </Panel>
        </Reveal>

        <Reveal delay={0.04} amount={0.15}>
          <Panel title="Response time analytics" hint="Median minutes by state">
            <ResponseBarChart />
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.1} amount={0.15}>
          <Panel title="Pressure heatmap" hint="72h event density">
            <PressureHeatMap />
          </Panel>
        </Reveal>
      </div>
    </Section>
  )
}
