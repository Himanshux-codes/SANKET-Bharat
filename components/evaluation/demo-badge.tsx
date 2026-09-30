/**
 * DemoBadge — visual indicator for dataset-sourced demo incidents.
 *
 * Renders as a small inline badge. Use `variant` to control verbosity:
 *  - 'compact': short "DEMO DATA" label (default)
 *  - 'full':    "Demo Incident · Dataset-Sourced Signal · Not a Live Incident"
 */
export function DemoBadge({ variant = 'compact' }: { variant?: 'compact' | 'full' }) {
  if (variant === 'full') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-violet-400">
        <span className="size-1.5 rounded-full bg-violet-400" />
        Demo Incident · Dataset-Sourced Signal · Not a Live Incident
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-violet-400">
      Demo Data
    </span>
  )
}
