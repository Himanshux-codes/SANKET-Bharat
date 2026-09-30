'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { memo } from 'react'
import { SEVERITY_META, type PlottedIncident } from '@/lib/india-map'

/**
 * Detect mobile once at module load to conditionally reduce animations.
 */
const isMobile =
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 767px)').matches
    : false

/**
 * A single geo-projected incident pin: radiating pulse rings whose cadence
 * tracks severity, plus a focus ring when the incident is selected.
 *
 * Mobile optimizations:
 * - Only selected / critical markers get pulse rings
 * - Single ring instead of two on mobile
 */
export const IncidentMarker = memo(function IncidentMarker({
  incident,
  index,
  isSelected,
  isDimmed,
  onSelect,
  onHover,
}: {
  incident: PlottedIncident
  index: number
  isSelected: boolean
  isDimmed: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}) {
  const reduce = useReducedMotion()
  const meta = SEVERITY_META[incident.severity] || SEVERITY_META.moderate
  const { color, radius } = meta

  // Critical sites breathe faster to read as more urgent at a glance.
  const cadence =
    incident.severity === 'critical' ? 2 : incident.severity === 'high' ? 2.6 : incident.severity === 'moderate' ? 3.2 : 3.8

  const x = Math.round(incident.x * 100) / 100
  const y = Math.round(incident.y * 100) / 100

  // On mobile: only animate selected or critical/high severity markers.
  // Others get static dots — still fully visible and interactive.
  const shouldAnimate =
    !reduce &&
    (!isMobile || isSelected || incident.severity === 'critical' || incident.severity === 'high')

  // On mobile: use single ring instead of two for reduced GPU work
  const ringCount = isMobile ? 1 : 2

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer transition-opacity duration-500 focus:outline-none"
      opacity={isDimmed ? 0.22 : 1}
      role="button"
      tabIndex={0}
      aria-label={`${incident.city}, ${incident.state} — ${incident.severity} ${incident.kind}`}
      onClick={() => onSelect(incident.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(incident.id)
        }
      }}
      onMouseEnter={() => onHover(incident.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(incident.id)}
      onBlur={() => onHover(null)}
    >
      {/* Generous invisible hit area for touch targets */}
      <circle r={18} fill="transparent" />

      {shouldAnimate &&
        Array.from({ length: ringCount }, (_, ring) => (
          <motion.circle
            key={ring}
            fill="none"
            stroke={color}
            strokeWidth={1.1}
            initial={{ r: radius, opacity: 0.55 }}
            animate={{ r: radius * 3.6, opacity: 0 }}
            transition={{
              duration: cadence,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.14 + ring * (cadence / 2),
              ease: 'easeOut',
            }}
          />
        ))}

      {/* Selection halo */}
      {isSelected && (
        <>
          <circle r={radius * 2.4} fill={color} fillOpacity={0.14} />
          <motion.circle
            r={radius * 2.4}
            fill="none"
            stroke={color}
            strokeWidth={1.2}
            strokeDasharray="4 5"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          />
        </>
      )}

      <circle r={radius + 2.5} fill={color} fillOpacity={0.2} />
      <circle r={radius} fill={color} />
      <circle r={radius * 0.4} fill="#ffffff" fillOpacity={0.85} />
    </g>
  )
})
