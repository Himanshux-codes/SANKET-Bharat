'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { memo, useMemo } from 'react'
import { IncidentMarker } from '@/components/map/incident-marker'
import { EASE_OUT_EXPO } from '@/components/motion/reveal'
import { useIsMobile } from '@/hooks/use-is-mobile'
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  SEVERITY_META,
  STATE_PATHS,
  type PlottedIncident,
} from '@/lib/india-map'

/** Floating label for the hovered or selected pin. */
function MarkerLabel({ incident }: { incident: PlottedIncident }) {
  const meta = SEVERITY_META[incident.severity] || SEVERITY_META.moderate
  const color = meta.color
  const x = Math.round(incident.x * 100) / 100
  const y = Math.round(incident.y * 100) / 100
  // Flip the callout inward when the pin sits near the right edge.
  const flip = x > MAP_WIDTH - 200
  const dx = flip ? -14 : 14
  const anchor = flip ? 'end' : 'start'

  return (
    <g transform={`translate(${x}, ${y})`} pointerEvents="none">
      <motion.g
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      >
        <line x1={0} y1={0} x2={dx} y2={-16} stroke={color} strokeWidth={1} strokeOpacity={0.6} />
        <text
          x={dx}
          y={-24}
          textAnchor={anchor}
          className="fill-foreground text-[15px] font-semibold"
          style={{ letterSpacing: '-0.01em' }}
        >
          {incident.city}
        </text>
        <text
          x={dx}
          y={-8}
          textAnchor={anchor}
          className="fill-muted-foreground font-mono text-[11px]"
          style={{ letterSpacing: '0.08em' }}
        >
          {incident.id} · {incident.affected} AFFECTED
        </text>
      </motion.g>
    </g>
  )
}

/**
 * Memoized state paths — static geometry that never changes.
 * Avoids Framer Motion overhead on stable (non-active) states.
 */
const StatePaths = memo(function StatePaths({
  activeStates,
}: {
  activeStates: Set<string>
}) {
  return (
    <g>
      {STATE_PATHS.map((state) => {
        const isActive = activeStates.has(state.name)
        return (
          <path
            key={state.name}
            d={state.d}
            fill={
              isActive
                ? 'color-mix(in oklab, var(--accent) 12%, transparent)'
                : 'color-mix(in oklab, #7ba0ff 5%, transparent)'
            }
            stroke={
              isActive
                ? 'color-mix(in oklab, var(--accent) 55%, transparent)'
                : 'color-mix(in oklab, #8fb0ff 24%, transparent)'
            }
            strokeWidth={0.7}
            strokeLinejoin="round"
            style={{ transition: 'fill 0.6s ease, stroke 0.6s ease' }}
          />
        )
      })}
    </g>
  )
})

export function IndiaMapCanvas({
  incidents,
  selectedId,
  hoveredId,
  activeStates,
  onSelect,
  onHover,
}: {
  incidents: PlottedIncident[]
  selectedId: string | null
  hoveredId: string | null
  activeStates: Set<string>
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}) {
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  const labelled = useMemo(
    () => incidents.find((incident) => incident.id === (hoveredId ?? selectedId)) ?? null,
    [incidents, hoveredId, selectedId],
  )

  return (
    <div className="relative overflow-hidden rounded-[1.6rem]">
      {/* Technical grid + aurora wash behind the landmass */}
      <div aria-hidden className="grid-lines absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 40%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 72%)',
        }}
      />

      {/* Satellite sweep — only on desktop + non-reduced-motion */}
      {!reduce && !isMobile && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
          <div className="animate-scan h-24 w-full bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--accent)_14%,transparent),transparent)]" />
        </div>
      )}

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="relative z-10 h-auto w-full"
        role="img"
        aria-label="Illustrative demo incident map of India"
      >
        <defs>
          {/* Reduced blur on mobile to cut GPU compositing cost */}
          <filter id="pin-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={isMobile ? '1.6' : '3.2'} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* State outlines — memoized static geometry */}
        <StatePaths activeStates={activeStates} />

        {/* Incident pins */}
        <g filter={isMobile ? undefined : 'url(#pin-glow)'}>
          {incidents.map((incident, index) => (
            <IncidentMarker
              key={incident.id}
              incident={incident}
              index={index}
              isSelected={incident.id === selectedId}
              isDimmed={hoveredId !== null && hoveredId !== incident.id}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </g>

        {labelled && <MarkerLabel incident={labelled} />}
      </svg>
    </div>
  )
}
