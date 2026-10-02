'use client'

import type { WorkflowMetadata } from '@/lib/data-mode'
import type { EvidenceItem } from '@/lib/incident-types'

import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, CircleAlert, CircleCheck, Eye, FileText, Flag, MapPin, UserRoundCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIncidents } from '@/lib/incident-context'

export type ExplainabilityData = WorkflowMetadata & {
  incident: string
  location: string
  disasterType: string
  severity: 'Critical' | 'High' | 'Moderate' | 'Low'
  confidence: string
  recommendedAction: string
  duplicateCount: number
  factors: string[]
  evidence: EvidenceItem[]
  humanDecision?: string
}

const toneBySeverity: Record<ExplainabilityData['severity'], string> = {
  Critical: 'border-danger/25 bg-danger/10 text-danger',
  High: 'border-warning/25 bg-warning/10 text-warning',
  Moderate: 'border-primary/25 bg-primary/10 text-primary',
  Low: 'border-success/25 bg-success/10 text-success',
}

function Step({ label, detail, active, last }: { label: string; detail: string; active?: boolean; last?: boolean }) {
  return <div className="relative flex min-w-0 flex-1 items-start gap-2.5 sm:block sm:text-center"><div className={cn('relative z-10 mx-0 flex size-8 shrink-0 items-center justify-center rounded-full border text-xs sm:mx-auto', active ? 'border-accent/40 bg-accent/15 text-accent' : 'border-border bg-secondary/70 text-muted-foreground')}><span className="font-mono">{label.slice(0, 1)}</span></div>{!last && <span className="absolute left-8 right-0 top-4 hidden h-px bg-border sm:block" aria-hidden /> }<div className="min-w-0 sm:mt-2"><p className="text-xs font-semibold text-foreground">{label}</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">{detail}</p></div></div>
}

export function EvidenceExplainability({ data, compact = false }: { data: ExplainabilityData; compact?: boolean }) {
  const { updateAiRecommendationDecision } = useIncidents()
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const humanDecision = data.humanDecision || 'Awaiting simulated review'

  function handleDecision(status: 'Approved' | 'Rejected' | 'Modified', label: string) {
    updateAiRecommendationDecision(data.incident, status, label, 'Recorded via Evidence Explainability panel.')
  }

  return <div className={cn('rounded-2xl border border-accent/20 bg-accent/[0.035] p-4 sm:p-5', compact && 'p-3 sm:p-4')}>
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent"><Eye className="size-3.5" /> Sandbox source notes</div><p className="mt-1 text-xs text-muted-foreground">Evidence presented for human review — All source material here is a sandbox example, not verified corroboration.</p></div><span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-warning/25 bg-warning/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-warning"><CircleAlert className="size-3" /> Simulation only</span></div>

    <div className="mt-5 rounded-xl border border-border bg-card/45 p-4"><div className="grid gap-3 sm:grid-cols-4"><div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Triage level</div><div className={cn('mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', toneBySeverity[data.severity])}>{data.severity}</div></div><div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Model confidence</div><div className="mt-2 font-mono text-lg font-semibold text-accent">{data.confidence}</div></div><div className="sm:col-span-2"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Recommended action</div><div className="mt-2 text-sm font-medium leading-5 text-foreground">{data.recommendedAction}</div></div></div></div>

    <div className="mt-5"><div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Illustrative factors / user input</div><div className="grid gap-2 sm:grid-cols-2">{data.factors.slice(0, 5).map((factor) => <div key={factor} className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/25 px-3 py-2 text-xs text-muted-foreground"><Check className="size-3.5 shrink-0 text-success" />{factor}</div>)}</div></div>

    <div className="mt-5 rounded-xl border border-border bg-card/40 p-4"><div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"><Flag className="size-3.5 text-accent" /> Decision explanation</div><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-1"><Step label="Evidence" detail="Illustrative notes" /><ArrowRight className="hidden size-4 shrink-0 self-center text-accent sm:block" /><Step label="Template review" detail="No model inference" /><ArrowRight className="hidden size-4 shrink-0 self-center text-accent sm:block" /><Step label="Matching unavailable" detail="No duplicate analysis" /><ArrowRight className="hidden size-4 shrink-0 self-center text-accent sm:block" /><Step label="Recommendation" detail="Simulated review" last /></div></div>

    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background/20">
      <button type="button" onClick={() => setEvidenceOpen((open) => !open)} aria-expanded={evidenceOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/5">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="size-4 text-accent" /> View Illustrative Notes <span className="text-xs font-normal text-muted-foreground">({data.evidence.length} notes)</span>
        </span>
        <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', evidenceOpen && 'rotate-180')} />
      </button>
      {evidenceOpen && (
        <div className="space-y-2 border-t border-border p-3">
          {data.evidence.map((item) => (
            <div key={`${item.source}-${item.timestamp}-${item.summary.slice(0, 10)}`} className="rounded-lg border border-border/70 bg-card/45 p-3">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{item.source}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Reliability: {item.reliability}</span>
                  <span className={cn('flex items-center gap-1 text-[10px]', item.supports ? 'text-success' : 'text-warning')}>
                    {item.supports ? <CircleCheck className="size-3" /> : <CircleAlert className="size-3" />}
                    Illustrative note · not corroboration
                  </span>
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">Simulation · not verified</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{item.timestamp}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="size-3 text-accent" />{item.location}</span>
                <span>{item.summary}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-accent/20 bg-accent/5 p-3 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground"><UserRoundCheck className="size-4 shrink-0 text-accent" /><span><strong className="text-foreground">Template suggestion</strong> → Human review → Approve / Reject / Override</span></div><div className="flex flex-wrap items-center gap-2"><span className="mr-auto text-[11px] text-muted-foreground sm:mr-1">{humanDecision}</span><button type="button" onClick={() => handleDecision('Approved', 'Simulated proposal approval')} className="rounded-lg bg-success/15 px-2.5 py-1.5 text-[11px] font-semibold text-success transition-colors hover:bg-success/25"><Check className="mr-1 inline size-3" />Approve</button><button type="button" onClick={() => handleDecision('Rejected', 'Simulated proposal rejection')} className="rounded-lg bg-danger/10 px-2.5 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-danger/20"><X className="mr-1 inline size-3" />Reject</button><button type="button" onClick={() => handleDecision('Modified', 'Simulated proposal modification')} className="rounded-lg bg-warning/10 px-2.5 py-1.5 text-[11px] font-semibold text-warning transition-colors hover:bg-warning/20">Override</button></div></div>
  </div>
}
