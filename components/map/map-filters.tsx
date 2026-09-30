'use client'

import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  Flame,
  Mountain,
  Tornado,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { EASE_OUT_EXPO } from '@/components/motion/reveal'
import {
  KIND_META,
  KIND_ORDER,
  SEVERITY_META,
  SEVERITY_ORDER,
  type KindFilter,
  type SeverityFilter,
} from '@/lib/india-map'
import { cn } from '@/lib/utils'

const KIND_ICONS: Record<string, LucideIcon> = {
  Waves,
  Tornado,
  Activity,
  Flame,
  Mountain,
  AlertTriangle,
}

/** Segmented glass control with a shared sliding pill, matching the navbar. */
function FilterRow<T extends string>({
  legend,
  layoutId,
  options,
  value,
  onChange,
}: {
  legend: string
  layoutId: string
  options: { value: T; label: string; dot?: string; icon?: string }[]
  value: T
  onChange: (next: T) => void
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{legend}</legend>
      <span className="mr-1 font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
        {legend}
      </span>
      {options.map((option) => {
        const isActive = option.value === value
        const Icon = option.icon ? KIND_ICONS[option.icon] : undefined

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              'relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300',
              isActive
                ? 'border-accent/45 text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-accent/12"
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              />
            )}
            {option.dot && (
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: option.dot }}
              />
            )}
            {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />}
            {option.label}
          </button>
        )
      })}
    </fieldset>
  )
}

export function MapFilters({
  severity,
  kind,
  onSeverityChange,
  onKindChange,
}: {
  severity: SeverityFilter
  kind: KindFilter
  onSeverityChange: (next: SeverityFilter) => void
  onKindChange: (next: KindFilter) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <FilterRow<SeverityFilter>
        legend="Severity"
        layoutId="map-severity-pill"
        value={severity}
        onChange={onSeverityChange}
        options={[
          { value: 'all', label: 'All levels' },
          ...SEVERITY_ORDER.map((key) => ({
            value: key as SeverityFilter,
            label: SEVERITY_META[key].label,
            dot: SEVERITY_META[key].color,
          })),
        ]}
      />
      <FilterRow<KindFilter>
        legend="Type"
        layoutId="map-kind-pill"
        value={kind}
        onChange={onKindChange}
        options={[
          { value: 'all', label: 'All types' },
          ...KIND_ORDER.map((key) => ({
            value: key as KindFilter,
            label: KIND_META[key].label,
            icon: KIND_META[key].icon,
          })),
        ]}
      />
    </div>
  )
}
