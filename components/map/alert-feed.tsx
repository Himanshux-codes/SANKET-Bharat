'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Radio } from 'lucide-react'
import { EASE_OUT_EXPO } from '@/components/motion/reveal'
import { getAdvisoriesForIncident } from '@/lib/site-data'
import { SEVERITY_META } from '@/lib/india-map'
import { useIncidents } from '@/lib/incident-context'

export interface AlertFeedProps {
  /** Explicit incident ID to display advisories for. Falls back to IncidentContext. */
  selectedIncidentId?: string | null
  incidentId?: string | null
}

/** Incident-aware Sandbox template notes mapped to the active incident. */
export function AlertFeed({ selectedIncidentId, incidentId }: AlertFeedProps = {}) {
  const reduce = useReducedMotion()
  const { selectedIncidentId: contextSelectedId, incidents, getIncidentById } = useIncidents()

  const targetId = selectedIncidentId !== undefined 
    ? selectedIncidentId 
    : incidentId !== undefined 
    ? incidentId 
    : contextSelectedId

  const targetIncident = useMemo(() => {
    if (!targetId) return null
    return incidents.find((i) => i.id === targetId) || getIncidentById(targetId) || null
  }, [targetId, incidents, getIncidentById])

  const advisories = useMemo(() => {
    return getAdvisoriesForIncident(targetId, targetIncident)
  }, [targetId, targetIncident])

  return (
    <div className="glass flex flex-col overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-[-0.01em] text-foreground">
          <Radio className="h-4 w-4 text-accent" strokeWidth={1.8} />
          Sandbox template notes
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase">
          <span className="relative flex h-1.5 w-1.5">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Illustrative
        </span>
      </div>

      {!targetId ? (
        <div className="flex min-h-[140px] flex-col items-center justify-center p-6 text-center">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Select an incident to view related advisories.
          </p>
        </div>
      ) : advisories.length === 0 ? (
        <div className="flex min-h-[140px] flex-col items-center justify-center p-6 text-center">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            No advisories available for this incident.
          </p>
        </div>
      ) : (
        <ul key={targetId} className="flex flex-col divide-y divide-border">
          {advisories.map((advisory, index) => {
            const severityMeta = SEVERITY_META[advisory.severity] || SEVERITY_META.moderate
            const color = severityMeta.color

            return (
              <motion.li
                key={`${targetId}-${index}-${advisory.message.slice(0, 24)}`}
                initial={reduce ? undefined : { opacity: 0, x: 14 }}
                animate={reduce ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: EASE_OUT_EXPO }}
                className="group flex gap-3 px-5 py-3.5 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-pretty text-[0.82rem] leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    {advisory.message}
                  </p>
                  <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase" style={{ color }}>
                    {severityMeta.label} · {advisory.time}
                  </span>
                </div>
              </motion.li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
