/** Displays the sandbox mode of a record, never an operational status. */
export function DemoBadge({ variant = 'compact', dataMode = 'demo' }: { variant?: 'compact' | 'full'; dataMode?: 'demo' | 'evaluation' | 'pilot' }) {
  if (variant === 'full') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-violet-400">
        <span className="size-1.5 rounded-full bg-violet-400" />
        {dataMode === 'evaluation' ? 'Evaluation sandbox · dataset-derived example' : 'Demo sandbox · illustrative example'}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-violet-400">
      {dataMode === 'evaluation' ? 'Evaluation sandbox' : dataMode === 'pilot' ? 'Pilot unavailable' : 'Demo sandbox'}
    </span>
  )
}
