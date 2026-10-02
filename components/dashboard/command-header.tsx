'use client'

import { useReducedMotion } from 'framer-motion'
import { Activity, Clock } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { SEVERITY_META } from '@/lib/india-map'
import { selectMode } from '@/lib/data-mode'
import { useIncidents } from '@/lib/incident-context'

/** Live status pill reused for the header's operational readouts. */
function StatusPill({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="glass flex min-w-0 flex-col gap-1 rounded-xl px-3.5 py-2.5">
      <span className="font-mono text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </span>
      <span
        className="font-mono text-lg leading-none font-semibold"
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  )
}

/**
 * Command center masthead: product title, a pulsing live indicator and the
 * current incident counts. Reuses the existing glass + mono type treatment.
 */
export function CommandHeader() {
  const reduce = useReducedMotion()
  const { incidents: allIncidents } = useIncidents()
  const incidents = selectMode(allIncidents, 'demo')

  const total = incidents.length
  const critical = incidents.filter(
    (i) => i.severity === 'critical' && i.status !== 'contained'
  ).length
  const escalating = incidents.filter((i) => i.status === 'escalating').length

  return (
    <header className="relative z-10 px-5 pt-32 pb-2 sm:px-8 sm:pt-36 md:pt-40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Reveal direction="none">
          <div className="flex flex-wrap items-center gap-3">
            {/* Live indicator */}
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.18em] text-success uppercase backdrop-blur-xl">
              <span className="relative flex h-1.5 w-1.5">
                {!reduce && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Demo only
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase backdrop-blur-xl">
              <Activity className="h-3 w-3 text-accent" strokeWidth={2} />
              {total} local demo records
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase backdrop-blur-xl">
              <Clock className="h-3 w-3" strokeWidth={2} />
              Local browser state
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="text-balance text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.04em] sm:text-5xl md:text-[3.5rem]">
            SANKET Bharat <span className="text-gradient">Command Center</span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground md:text-lg">
            Local demo scenarios and illustrative charts. No resource inventory, model service or operational national grid.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <StatusPill
              label="Total incidents"
              value={String(total)}
              color="var(--foreground)"
            />
            <StatusPill
              label="Critical"
              value={String(critical)}
              color={SEVERITY_META.critical.color}
            />
            <StatusPill
              label="Escalating"
              value={String(escalating)}
              color="var(--warning)"
            />
            <StatusPill label="Operational status" value="Not available" color="var(--success)" />
          </div>
        </Reveal>
      </div>
    </header>
  )
}
