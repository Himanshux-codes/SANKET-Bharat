'use client'

import { useState } from 'react'
import { AlertTriangle, Check, ChevronDown, ExternalLink, FileSearch, GitBranch, MapPin, Merge, Radio, ShieldQuestion, UserRoundCheck, X } from 'lucide-react'

import { useIncidents } from '@/lib/incident-context'
import type { ReportClassification } from '@/lib/incident-types'

export type { ReportClassification }

const statusStyles: Record<ReportClassification, string> = {
  'Likely Genuine': 'border-success/25 bg-success/10 text-success',
  Duplicate: 'border-primary/25 bg-primary/10 text-primary',
  Suspicious: 'border-warning/25 bg-warning/10 text-warning',
  'Needs Human Review': 'border-danger/25 bg-danger/10 text-danger',
}

export function ReportVerificationWorkflow() {
  const { verificationQueue, verifyQueueItem } = useIncidents()
  const [expanded, setExpanded] = useState<string | null>(verificationQueue[0]?.id || 'RPT-20481')
  const [decisions, setDecisions] = useState<Record<string, string>>({})

  function decide(id: string, decision: 'Approved' | 'Rejected' | 'Marked duplicate' | 'Escalated') {
    setDecisions((current) => ({ ...current, [id]: decision }))
    verifyQueueItem(id, decision)
  }

  return (
    <section className="glass mb-10 rounded-2xl p-4 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            <GitBranch className="size-3.5" /> Verification pathway
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Fake / duplicate report verification
          </h2>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
            AI classifies incoming signals and surfaces evidence; an authorized human decides the final status. “Suspicious” never means permanently fake.
          </p>
        </div>
        <span className="w-fit rounded-full border border-border bg-secondary/70 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          {verificationQueue.length} queue items
        </span>
      </div>

      <div className="mb-6 grid gap-2 md:grid-cols-6">
        {[
          { label: 'Incoming report', icon: Radio },
          { label: 'AI verification', icon: FileSearch },
          { label: 'Classification', icon: ShieldQuestion },
          { label: 'Evidence', icon: ExternalLink },
          { label: 'Human review', icon: UserRoundCheck },
          { label: 'Final status', icon: Check },
        ].map(({ label, icon: Icon }, index) => (
          <div key={label} className="relative flex items-center gap-2 rounded-lg border border-border bg-card/45 px-3 py-2 md:block">
            <Icon className="size-3.5 shrink-0 text-accent" />
            <span className="text-[11px] font-medium text-foreground">{label}</span>
            {index < 5 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-accent md:block">›</span>}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {verificationQueue.map((report) => {
          const isExpanded = expanded === report.id
          const decision = decisions[report.id] || (report.humanDecision.status !== 'Pending' ? report.humanDecision.finalAction : null)
          const classification = (report.verificationStatus as ReportClassification) || 'Needs Human Review'

          return (
            <article key={report.id} className="rounded-2xl border border-border bg-card/35 p-4 transition-colors hover:border-accent/30">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-accent">{report.reportId || report.id}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles[classification] || statusStyles['Needs Human Review']}`}>
                      {classification}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {report.humanDecision.status === 'Pending' ? 'Awaiting human review' : report.humanDecision.finalAction}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Radio className="size-3.5 text-primary" />
                      {report.source}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" />
                      {report.location}
                    </span>
                    <span>{report.updated}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground">{report.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                    <span className="text-muted-foreground">
                      AI confidence <strong className="font-mono text-accent">{report.confidence}%</strong>
                    </span>
                    {report.duplicateMatch && (
                      <span className="flex items-center gap-1.5 text-primary">
                        <Merge className="size-3.5" />
                        {report.duplicateMatch}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 xl:w-[290px] xl:justify-end">
                  <button
                    type="button"
                    onClick={() => decide(report.id, 'Approved')}
                    className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Check className="mr-1 inline size-3.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(report.id, 'Rejected')}
                    className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-danger/40 hover:text-danger"
                  >
                    <X className="mr-1 inline size-3.5" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(report.id, 'Marked duplicate')}
                    className="rounded-lg border border-primary/30 px-3 py-2 text-xs text-primary transition-colors hover:bg-primary/10"
                  >
                    <Merge className="mr-1 inline size-3.5" />
                    Mark duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(report.id, 'Escalated')}
                    className="rounded-lg border border-warning/30 px-3 py-2 text-xs text-warning transition-colors hover:bg-warning/10"
                  >
                    <AlertTriangle className="mr-1 inline size-3.5" />
                    Escalate
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : report.id)}
                className="mt-4 flex w-full items-center justify-between border-t border-border/70 pt-3 text-left text-xs text-accent"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="size-3.5" />
                  Evidence link / preview
                </span>
                <ChevronDown className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="mt-3 grid gap-3 rounded-xl border border-accent/15 bg-accent/5 p-3 md:grid-cols-[0.7fr_1.3fr] md:items-center">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-accent">
                      {report.evidenceSource || 'Citizen report cluster · demo preview'}
                    </div>
                    <div className="mt-2 text-xs font-medium text-foreground">Evidence preview</div>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {report.evidence?.[0]?.summary || report.description}
                  </p>
                </div>
              )}

              {decision && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-xs text-foreground">
                  <Check className="size-3.5 text-success" />
                  Human decision: <strong>{decision}</strong>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
