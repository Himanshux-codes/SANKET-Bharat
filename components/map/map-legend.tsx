'use client'

import { SEVERITY_META, SEVERITY_ORDER, type PlottedIncident } from '@/lib/india-map'

/** Severity key with live counts for the currently filtered incident set. */
export function MapLegend({ incidents }: { incidents: PlottedIncident[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-border px-5 py-4 sm:px-6">
      <span className="font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">
        Legend
      </span>

      {SEVERITY_ORDER.map((key) => {
        const meta = SEVERITY_META[key]
        const count = incidents.filter((incident) => incident.severity === key).length

        return (
          <span key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span
                aria-hidden
                className="absolute h-2.5 w-2.5 rounded-full opacity-30"
                style={{ background: meta.color }}
              />
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: meta.color }}
              />
            </span>
            {meta.label}
            <span className="font-mono text-foreground">{count}</span>
          </span>
        )
      })}

      <span className="ml-auto font-mono text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
        Mercator · live feed
      </span>
    </div>
  )
}
