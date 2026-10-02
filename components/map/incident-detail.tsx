'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  Clock,
  Flame,
  MapPin,
  Mountain,
  ShieldCheck,
  Tornado,
  Users,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { EASE_OUT_EXPO } from '@/components/motion/reveal'
import { KIND_META, SEVERITY_META, type PlottedIncident } from '@/lib/india-map'

const KIND_ICONS: Record<string, LucideIcon> = {
  Waves,
  Tornado,
  Activity,
  Flame,
  Mountain,
  AlertTriangle,
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-white/[0.03] p-3.5">
      <span className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        {label}
      </span>
      <span className="text-lg font-semibold tracking-[-0.02em] text-foreground">{value}</span>
    </div>
  )
}

/** Detail readout for the pin currently selected on the map. */
export function IncidentDetail({ incident }: { incident: PlottedIncident | null }) {
  const meta = incident ? SEVERITY_META[incident.severity] || SEVERITY_META.moderate : null

  return (
    <div className="glass relative flex min-h-[19rem] flex-col overflow-hidden rounded-3xl p-5 sm:p-6">
      <AnimatePresence mode="wait" initial={false}>
        {incident && meta ? (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
                  {incident.id}
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                  {incident.city}
                </h3>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {incident.state}
                </span>
              </div>

              <span
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.12em] uppercase"
                style={{
                  borderColor: `color-mix(in oklab, ${meta.color} 45%, transparent)`,
                  color: meta.color,
                  background: `color-mix(in oklab, ${meta.color} 10%, transparent)`,
                }}
              >
                {meta.label}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {(() => {
                const Icon = KIND_ICONS[KIND_META[incident.kind].icon] ?? Waves
                return (
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white/[0.05] text-accent">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                )
              })()}
              <span className="text-sm text-muted-foreground">
                {KIND_META[incident.kind].label} event
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric icon={Users} label="Scenario affected" value={incident.affected} />
              <Metric icon={ShieldCheck} label="Teams" value="Not available" />
            </div>

            {/* Model confidence meter */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase">
                <span>Model confidence</span>
                <span className="text-foreground">Not available</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--accent))]"
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.1 }}
                />
              </div>
            </div>

            <span className="flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
              Updated {incident.updated}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
          >
            <MapPin className="h-6 w-6 text-muted-foreground" strokeWidth={1.6} />
            <p className="max-w-[16rem] text-sm text-muted-foreground">
              No incidents match the current filters. Widen the severity or type selection.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
