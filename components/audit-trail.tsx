'use client'

import { Fragment, useState } from 'react'
import { BrainCircuit, Check, ChevronDown, ClipboardList, History, UserRoundCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import { useIncidents } from '@/lib/incident-context'
import type { AuditEntry } from '@/lib/incident-types'

export type { AuditEntry }

const actorStyles: Record<AuditEntry['actorType'], string> = {
  AI: 'border-accent/25 bg-accent/10 text-accent',
  Human: 'border-primary/25 bg-primary/10 text-primary',
}

export function AuditTrail() {
  const { auditTrail } = useIncidents()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section className="glass mb-10 rounded-2xl p-4 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            <History className="size-3.5" /> Accountability record
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Audit trail</h2>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
            Chronological record of AI-generated actions and human decisions across incidents.
          </p>
        </div>
        <span className="w-fit rounded-full border border-border bg-secondary/70 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          {auditTrail.length} logged actions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <th className="pb-3 font-medium">Timestamp</th>
              <th className="pb-3 font-medium">Incident</th>
              <th className="pb-3 font-medium">Action</th>
              <th className="pb-3 font-medium">Actor</th>
              <th className="pb-3 font-medium">Status change</th>
              <th className="pb-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditTrail.map((entry) => {
              const isExpanded = expanded === entry.id
              return (
                <Fragment key={entry.id}>
                  <tr className="border-b border-border/60 last:border-0">
                    <td className="py-3 align-top font-mono text-[11px] text-muted-foreground">{entry.timestamp}</td>
                    <td className="py-3 align-top font-mono text-xs text-accent">{entry.incident}</td>
                    <td className="py-3 align-top">
                      <span className="text-sm font-medium text-foreground">{entry.action}</span>
                      {entry.isOverride && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-warning/25 bg-warning/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
                          Human override
                        </span>
                      )}
                    </td>
                    <td className="py-3 align-top">
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide', actorStyles[entry.actorType])}>
                        {entry.actorType === 'AI' ? <BrainCircuit className="size-3" /> : <UserRoundCheck className="size-3" />}
                        {entry.actor}
                      </span>
                    </td>
                    <td className="py-3 align-top text-xs text-muted-foreground">
                      <span>{entry.previousStatus}</span>
                      <span className="mx-1.5 text-accent">→</span>
                      <span className="text-foreground">{entry.newStatus}</span>
                    </td>
                    <td className="py-3 align-top">
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : entry.id)}
                        aria-expanded={isExpanded}
                        className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        <ClipboardList className="size-3.5" />
                        Details
                        <ChevronDown className={cn('size-3.5 transition-transform', isExpanded && 'rotate-180')} />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-border/60 last:border-0">
                      <td colSpan={6} className="pb-4">
                        <div className="grid gap-3 rounded-xl border border-border bg-card/40 p-4 sm:grid-cols-3">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI recommendation</div>
                            <p className="mt-1 text-xs leading-5 text-foreground">{entry.aiRecommendation}</p>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Human decision</div>
                            <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-foreground">
                              {entry.actorType === 'Human' ? <Check className="mt-0.5 size-3.5 shrink-0 text-success" /> : <X className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />}
                              {entry.humanDecision}
                            </p>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reason</div>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">{entry.reason}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
