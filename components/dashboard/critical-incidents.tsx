'use client'

import { Users } from 'lucide-react'
import { getIcon } from '@/lib/icons'
import { KIND_META, SEVERITY_META, SEVERITY_ORDER } from '@/lib/india-map'
import { STATUS_META } from '@/lib/site-data'
import { useIncidents } from '@/lib/incident-context'
import type { Incident } from '@/lib/incident-types'
import { DemoBadge } from '@/components/evaluation/demo-badge'

const COLUMNS = [
  'Location',
  'Disaster type',
  'Severity',
  'Affected',
  'AI Confidence',
  'Status',
]

function SeverityTag({ severity }: { severity: Incident['severity'] }) {
  const meta = SEVERITY_META[severity] || SEVERITY_META.moderate

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.12em] uppercase"
      style={{
        color: meta.color,
        background: `color-mix(in oklab, ${meta.color} 12%, transparent)`,
        border: `1px solid color-mix(in oklab, ${meta.color} 30%, transparent)`,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
      />
      {meta.label}
    </span>
  )
}

function StatusTag({ status }: { status?: Incident['status'] }) {
  const currentStatus = status || 'monitoring'
  const meta = STATUS_META[currentStatus as keyof typeof STATUS_META] || STATUS_META.monitoring

  return (
    <span
      className="font-mono text-[0.62rem] tracking-[0.1em] uppercase"
      style={{ color: meta.color }}
    >
      {meta.label}
    </span>
  )
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width: `${value}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
          }}
        />
      </div>
      <span className="font-mono text-xs text-foreground">{value}%</span>
    </div>
  )
}

/** Ranked incident table with a stacked card layout on small screens. */
export function CriticalIncidents() {
  const { incidents } = useIncidents()

  const rows = incidents
    .filter((incident) => incident.severity === 'critical' || incident.severity === 'high')
    .sort(
      (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
    )

  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-4 sm:px-6">
        <h3 className="text-base font-semibold tracking-[-0.015em] text-foreground">
          Critical incidents
        </h3>
        <span className="font-mono text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
          {rows.length} requiring action
        </span>
      </div>

      {/* Column headers — desktop only */}
      <div className="hidden grid-cols-[1.4fr_1fr_0.9fr_0.8fr_1.1fr_1fr] gap-4 border-b border-border px-6 py-3 lg:grid">
        {COLUMNS.map((column) => (
          <span
            key={column}
            className="font-mono text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase"
          >
            {column}
          </span>
        ))}
      </div>

      <ul className="flex flex-col divide-y divide-border">
        {rows.map((incident) => {
          const kind = KIND_META[incident.kind] || KIND_META.other
          const KindIcon = getIcon(kind.icon)

          return (
            <li
              key={incident.id}
              className="px-5 py-4 transition-colors duration-300 hover:bg-white/[0.03] sm:px-6 lg:grid lg:grid-cols-[1.4fr_1fr_0.9fr_0.8fr_1.1fr_1fr] lg:items-center lg:gap-4"
            >
              {/* Location */}
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-sm font-medium tracking-[-0.01em] text-foreground">
                  {incident.city}
                  {incident.isDemo && <DemoBadge />}
                </span>
                <span className="font-mono text-[0.62rem] tracking-[0.08em] text-muted-foreground">
                  {incident.state} · {incident.id}
                </span>
              </div>

              {/* Mobile field grid */}
              <div className="mt-3 grid grid-cols-2 gap-3 lg:hidden">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase">
                    Type
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-foreground">
                    <KindIcon className="h-3.5 w-3.5 text-accent" strokeWidth={1.9} />
                    {kind.label}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase">
                    Severity
                  </span>
                  <SeverityTag severity={incident.severity} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase">
                    Affected
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-foreground">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.9} />
                    {incident.affected}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase">
                    AI Confidence
                  </span>
                  <ConfidenceBar value={incident.confidence} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase">
                    Status
                  </span>
                  <StatusTag status={incident.status} />
                </div>
              </div>

              {/* Desktop cells */}
              <span className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
                <KindIcon className="h-4 w-4 text-accent" strokeWidth={1.9} />
                {kind.label}
              </span>
              <span className="hidden lg:block">
                <SeverityTag severity={incident.severity} />
              </span>
              <span className="hidden font-mono text-sm text-foreground lg:block">
                {incident.affected}
              </span>
              <span className="hidden lg:block">
                <ConfidenceBar value={incident.confidence} />
              </span>
              <span className="hidden lg:block">
                <StatusTag status={incident.status} />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
