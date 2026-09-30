'use client'

import { motion } from 'framer-motion'
import { Satellite } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { AlertFeed } from '@/components/map/alert-feed'
import { IncidentDetail } from '@/components/map/incident-detail'
import { IndiaMapCanvas } from '@/components/map/india-map-canvas'
import { MapFilters } from '@/components/map/map-filters'
import { MapLegend } from '@/components/map/map-legend'
import { EASE_OUT_EXPO, Reveal } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/section'
import { useIncidents } from '@/lib/incident-context'
import {
  KIND_META,
  SEVERITY_META,
  filterIncidents,
  plotIncidents,
  parseAffected,
  type KindFilter,
  type SeverityFilter,
  type PlottedIncident,
} from '@/lib/india-map'
import { cn } from '@/lib/utils'

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
        {value}
      </span>
    </div>
  )
}

/** Compact roster row — gives touch users a large target for pin selection. */
function IncidentRow({
  incident,
  isSelected,
  onSelect,
  onHover,
}: {
  incident: PlottedIncident
  isSelected: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}) {
  const color = (SEVERITY_META[incident.severity] || SEVERITY_META.moderate).color

  return (
    <button
      type="button"
      onClick={() => onSelect(incident.id)}
      onMouseEnter={() => onHover(incident.id)}
      onMouseLeave={() => onHover(null)}
      aria-pressed={isSelected}
      className={cn(
        'flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-500',
        isSelected
          ? 'border-accent/45 bg-accent/[0.07]'
          : 'border-border bg-white/[0.03] hover:border-accent/30 hover:bg-white/[0.05]',
      )}
    >
      <span
        aria-hidden
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{incident.city}</span>
        <span className="truncate font-mono text-[0.6rem] tracking-[0.1em] text-muted-foreground uppercase">
          {(KIND_META[incident.kind] || KIND_META.other).label} · {incident.affected}
        </span>
      </span>
    </button>
  )
}

export function LiveMap() {
  const { incidents: sharedIncidents, setSelectedIncidentId, selectedIncidentId: contextSelectedId } = useIncidents()
  const [severity, setSeverity] = useState<SeverityFilter>('all')
  const [kind, setKind] = useState<KindFilter>('all')
  const [requestedId, setRequestedId] = useState<string | null>(contextSelectedId || 'INC-4821')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const plottedIncidents = useMemo(
    () => plotIncidents(sharedIncidents),
    [sharedIncidents],
  )

  const incidents = useMemo(
    () => filterIncidents(plottedIncidents, severity, kind),
    [plottedIncidents, severity, kind],
  )

  // Selection derives from the filtered set, so a filtered-out pin falls back
  // to the first visible incident without needing an effect.
  const selected = useMemo(
    () => incidents.find((incident) => incident.id === requestedId) ?? incidents[0] ?? null,
    [incidents, requestedId],
  )

  const activeStates = useMemo(
    () => new Set(selected ? [selected.state] : []),
    [selected],
  )

  const totals = useMemo(
    () => ({
      count: incidents.length,
      affected: incidents.reduce((sum, incident) => sum + parseAffected(incident.affected), 0),
      teams: incidents.reduce((sum, incident) => sum + incident.teams, 0),
    }),
    [incidents],
  )

  const handleSelect = useCallback((id: string) => {
    setRequestedId(id)
    setSelectedIncidentId(id)
  }, [setSelectedIncidentId])
  const handleHover = useCallback((id: string | null) => setHoveredId(id), [])

  return (
    <Section id="live-map" label="Live disaster map">
      <SectionHeader
        eyebrow="Operations"
        title={
          <>
            Every active incident on{' '}
            <span className="text-gradient">one national canvas</span>
          </>
        }
        description="Citizen reports, satellite telemetry and field confirmations resolve to true coordinates the moment they land — filter by severity or hazard type to isolate what your teams own."
      />

      <Reveal className="mt-14" delay={0.05}>
        <MapFilters
          severity={severity}
          kind={kind}
          onSeverityChange={setSeverity}
          onKindChange={setKind}
        />
      </Reveal>

      <div className="mt-6 grid gap-5 lg:grid-cols-12">
        {/* Map card */}
        <Reveal className="lg:col-span-8" delay={0.1}>
          <div className="glass flex h-full flex-col overflow-hidden rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <span className="flex items-center gap-2 text-sm font-semibold tracking-[-0.01em] text-foreground">
                <Satellite className="h-4 w-4 text-accent" strokeWidth={1.8} />
                National incident grid
              </span>
              <div className="flex items-center gap-5">
                <SummaryStat label="Active" value={String(totals.count)} />
                <SummaryStat
                  label="Affected"
                  value={`${(totals.affected / 1000).toFixed(0)}K`}
                />
                <SummaryStat label="Teams" value={String(totals.teams)} />
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <IndiaMapCanvas
                incidents={incidents}
                selectedId={selected?.id ?? null}
                hoveredId={hoveredId}
                activeStates={activeStates}
                onSelect={handleSelect}
                onHover={handleHover}
              />
            </div>

            <MapLegend incidents={incidents} />
          </div>
        </Reveal>

        {/* Side rail */}
        <div className="flex flex-col gap-5 lg:col-span-4">
          <Reveal delay={0.16}>
            <IncidentDetail incident={selected} />
          </Reveal>
          <Reveal delay={0.22}>
            <AlertFeed selectedIncidentId={selected?.id ?? null} />
          </Reveal>
        </div>
      </div>

      {/* Roster */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
        className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        {incidents.map((incident) => (
          <IncidentRow
            key={incident.id}
            incident={incident}
            isSelected={incident.id === selected?.id}
            onSelect={handleSelect}
            onHover={handleHover}
          />
        ))}
      </motion.div>
    </Section>
  )
}
