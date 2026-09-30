'use client'

import {
  DisasterPieChart,
  IncidentAreaChart,
  PressureHeatMap,
  ResponseBarChart,
} from '@/components/dashboard/charts'
import { CommandHeader } from '@/components/dashboard/command-header'
import { CriticalIncidents } from '@/components/dashboard/critical-incidents'
import { Panel, Widget } from '@/components/dashboard/widget'
import { AlertFeed } from '@/components/map/alert-feed'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { DASHBOARD_WIDGETS, RESPONSE_SLA } from '@/lib/site-data'
import { useLanguage } from '@/lib/i18n/i18n-context'

// metadata export removed — not compatible with 'use client';
// the page title is set via CommandHeader which renders its own heading.

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <>
      <CommandHeader />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 pt-8 pb-24 sm:px-8 md:pb-32">
        {/* KPI grid */}
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {DASHBOARD_WIDGETS.map((widget) => (
            <RevealItem key={widget.label}>
              <Widget widget={widget} />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Analytics */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2" amount={0.15}>
            <Panel title={t.dashboard.panelIncidentTrend} hint={t.dashboard.hintIncidentTrend}>
              <IncidentAreaChart />
            </Panel>
          </Reveal>

          <Reveal delay={0.08} amount={0.15}>
            <Panel title={t.dashboard.panelSeverityDist} hint={t.dashboard.hintSeverityDist}>
              <DisasterPieChart />
            </Panel>
          </Reveal>

          <Reveal delay={0.04} amount={0.15}>
            <Panel title={t.dashboard.panelResponseTime} hint={t.dashboard.hintResponseTime}>
              <div className="flex flex-col gap-5">
                <ResponseBarChart />
                <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                  {RESPONSE_SLA.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <dt className="font-mono text-[0.6rem] font-medium tracking-[0.14em] text-slate-300 uppercase">
                        {item.label}
                      </dt>
                      <dd className="font-mono text-base font-semibold text-foreground">
                        {item.value}
                      </dd>
                      <dd className="text-[0.72rem] text-slate-300">{item.delta}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Panel>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={0.1} amount={0.15}>
            <Panel title={t.dashboard.panelPressureHeat} hint={t.dashboard.hintPressureHeat}>
              <PressureHeatMap />
            </Panel>
          </Reveal>
        </div>

        {/* Critical incidents + AI advisory stream */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2" amount={0.1}>
            <CriticalIncidents />
          </Reveal>

          <Reveal delay={0.08} amount={0.1}>
            <AlertFeed />
          </Reveal>
        </div>
      </div>
    </>
  )
}
