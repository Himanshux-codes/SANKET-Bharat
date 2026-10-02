'use client'

import { useState } from 'react'
import { ArrowRight, Check, CircleAlert, Gauge, ListChecks, MapPinned, Package, PenLine, ShieldAlert, TriangleAlert, UserRoundCheck, Users, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { deriveMetadata, type WorkflowMetadata } from '@/lib/data-mode'
import type { ResourceAllocation, AllocationFactors, HumanDecision } from '@/lib/incident-types'
import { useIncidents } from '@/lib/incident-context'

export type { ResourceAllocation } from '@/lib/incident-types'

export type RecommendationData = WorkflowMetadata & {
  incident: string
  action: string
  reason: string
  evidenceSummary: string
  confidence: string
  impact: string
  resources: string[]
  allocations?: ResourceAllocation[]
  allocationFactors?: AllocationFactors
  humanDecision?: HumanDecision
  hazardType?: string
  severity?: string
  affected?: string
  location?: string
  teams?: number
}

export function AiRecommendationApproval({ data, compact = false }: { data: RecommendationData; compact?: boolean }) {
  const { updateAiRecommendationDecision } = useIncidents()
  const decision: HumanDecision = data.humanDecision || {
    ...deriveMetadata([data], data.incident + '/decision-view'), status: 'Pending', finalAction: data.action,
  }
  const displayedProposal = decision.status === 'Pending' ? data.action : decision.finalAction
  const revision = JSON.stringify([data.incident, decision.provenance.sourceId, decision.status, decision.finalAction, data.action])
  const [edit, setEdit] = useState<{ revision: string; draft: string } | null>(null)
  const modifying = edit?.revision === revision
  const draft = modifying ? edit.draft : displayedProposal

  function approve() {
    setEdit(null)
    updateAiRecommendationDecision(data.incident, 'Approved', draft, 'Simulated approval of the displayed proposal; no assignment.')
  }
  function reject() {
    const final = 'Simulated recommendation rejection; no operational action.'
    setEdit(null)
    updateAiRecommendationDecision(data.incident, 'Rejected', final, 'Simulated proposal rejection; no operational action.')
  }
  function saveModification() {
    setEdit(null)
    updateAiRecommendationDecision(data.incident, 'Modified', draft, 'Proposal edited locally; requires a separate review.')
  }

  // Resolve allocation reasoning factors from existing incident data
  const resolvedSeverity =
    data.allocationFactors?.severity ||
    (data.severity ? data.severity.charAt(0).toUpperCase() + data.severity.slice(1) : 'Unknown')
  const resolvedAffected =
    data.allocationFactors?.affected || (data.affected ? `${data.affected} people (unverified)` : 'Unknown')
  const resolvedHazard = data.allocationFactors?.hazardType || data.hazardType || 'Emergency event'
  const resolvedLocation =
    data.allocationFactors?.distanceLocation ||
    data.allocationFactors?.locationPriority ||
    data.location ||
    'Unknown'
  const resolvedAvailability =
    data.allocationFactors?.availability || 'Not available'
  const resolvedPriority = data.allocationFactors?.responsePriority || 'Not assessed'

  const recommendedCount =
    data.allocationFactors?.recommendedTeamCount ||
    (data.resources && data.resources.length > 0
      ? `${data.resources.length} units (${data.resources.join(', ') || 'Not available'})`
      : 'Not available')

  const keyFactors =
    data.allocationFactors?.keyFactors || [
      `${resolvedHazard} hazard with ${resolvedSeverity} severity rating`,
      `Illustrative/user-entered exposure: ${resolvedAffected}`,
      `Target site: ${resolvedLocation} with ${resolvedAvailability}`,
    ]

  return (
    <div className={cn('rounded-2xl border border-accent/20 bg-accent/[0.035] p-4 sm:p-5', compact && 'p-3 sm:p-4')}>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          <ShieldAlert className="size-3.5" /> Template suggestion
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-warning/25 bg-warning/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-warning">
          <CircleAlert className="size-3" /> Simulated review only
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Template review in a sandbox. No authenticated authority, assignment or communication.
      </p>

      <div className="mt-4 rounded-xl border border-border bg-card/45 p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Recommended action</div>
        <p className="mt-1 text-sm font-medium leading-5 text-foreground">{data.action}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Gauge className="size-3.5 text-accent" /> Model confidence: <span className="font-mono text-foreground">{data.confidence}</span></div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><TriangleAlert className="size-3.5 text-warning" /> Impact: <span className="text-foreground">{data.impact}</span></div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Package className="size-3.5 text-primary" /> Resources: <span className="text-foreground">{data.resources.join(', ') || 'Not available'}</span></div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-background/25 p-3">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"><ListChecks className="size-3.5 text-accent" /> Template rationale</div>
          <p className="text-xs leading-5 text-muted-foreground">{data.reason}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/25 p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Supporting evidence</div>
          <p className="text-xs leading-5 text-muted-foreground">{data.evidenceSummary}</p>
        </div>
      </div>

      {/* Why this allocation? section */}
      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/[0.04] p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Users className="size-3.5" /> Why this allocation?
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[9px] uppercase tracking-wide text-accent">
            Template suggestion
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Allocation is not calculated. Inventory, distances and available units are unknown; this panel illustrates fields for a future human review workflow.
        </p>

        {data.allocations && data.allocations.length > 0 && (
          <div className="mt-3 space-y-2">
            {data.allocations.map((allocation) => (
              <div key={`${allocation.resource}-${allocation.target}`} className="rounded-lg border border-border/70 bg-background/35 p-2.5 sm:flex sm:items-start sm:gap-3">
                <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-foreground sm:w-44">
                  <MapPinned className="size-3.5 text-primary" /> {allocation.resource} <ArrowRight className="size-3 text-muted-foreground" /> {allocation.target}
                </div>
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground sm:mt-0">{allocation.reason}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/50 pt-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-lg border border-border/50 bg-background/30 p-2 text-[10px]">
            <span className="block text-muted-foreground">Incident Severity</span>
            <span className="font-semibold text-foreground">{resolvedSeverity}</span>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/30 p-2 text-[10px]">
            <span className="block text-muted-foreground">Affected Population</span>
            <span className="font-semibold text-foreground">{resolvedAffected}</span>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/30 p-2 text-[10px]">
            <span className="block text-muted-foreground">Hazard Type</span>
            <span className="font-semibold text-foreground">{resolvedHazard}</span>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/30 p-2 text-[10px]">
            <span className="block text-muted-foreground">Distance / Location</span>
            <span className="font-semibold text-foreground">{resolvedLocation}</span>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/30 p-2 text-[10px]">
            <span className="block text-muted-foreground">Resource Capacity</span>
            <span className="font-semibold text-foreground">{resolvedAvailability}</span>
          </div>
          <div className="rounded-lg border border-border/50 bg-background/30 p-2 text-[10px]">
            <span className="block text-muted-foreground">Response Priority</span>
            <span className="font-semibold text-foreground">{resolvedPriority}</span>
          </div>
        </div>

        <div className="mt-3 grid gap-2.5 border-t border-border/50 pt-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/50 bg-background/30 p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <ListChecks className="size-3 text-accent" /> Key Allocation Factors
            </div>
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              {keyFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-success" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-border/50 bg-background/30 p-2.5">
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recommended Resources &amp; Teams
              </div>
              <p className="font-mono text-xs font-medium text-foreground">
                {recommendedCount}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
              <span className="text-muted-foreground">Human Approval:</span>
              <span className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                decision.status === 'Approved' ? 'bg-success/15 text-success border border-success/30' :
                decision.status === 'Rejected' ? 'bg-danger/15 text-danger border border-danger/30' :
                decision.status === 'Modified' ? 'bg-warning/15 text-warning border border-warning/30' :
                'bg-secondary text-muted-foreground border border-border'
              )}>
                {decision.status === 'Pending' ? 'Pending Human Review' : decision.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background/20 p-3 text-[11px] text-muted-foreground">
        <span>Template suggestion</span><ArrowRight className="size-3 text-accent" />
        <span>Evidence &amp; reasoning</span><ArrowRight className="size-3 text-accent" />
        <span>Human review</span><ArrowRight className="size-3 text-accent" />
        <span>Approve / Reject / Modify</span><ArrowRight className="size-3 text-accent" />
        <span className="text-foreground">Final decision</span>
      </div>

      {modifying && (
        <div className="mt-3 rounded-xl border border-primary/25 bg-primary/5 p-3">
          <label htmlFor={`modify-${data.incident}`} className="text-[10px] font-semibold uppercase tracking-wider text-primary">Modify recommendation before approval</label>
          <textarea id={`modify-${data.incident}`} value={draft} onChange={(event) => setEdit({ revision, draft: event.target.value })} rows={2} className="mt-2 w-full rounded-lg border border-border bg-background/60 p-2 text-xs text-foreground outline-none focus:border-primary/50" />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEdit(null)} className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground">Cancel</button>
            <button type="button" onClick={saveModification} className="rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground hover:opacity-90">Save modified recommendation</button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-accent/20 bg-accent/5 p-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground">
          <UserRoundCheck className="size-4 shrink-0 text-accent" />
          <span><strong className="text-foreground">Simulated review:</strong> {decision.status === 'Pending' ? 'Awaiting decision' : decision.status}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={approve} className="rounded-lg bg-success/15 px-2.5 py-1.5 text-[11px] font-semibold text-success transition-colors hover:bg-success/25"><Check className="mr-1 inline size-3" />Approve</button>
          <button type="button" onClick={reject} className="rounded-lg bg-danger/10 px-2.5 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-danger/20"><X className="mr-1 inline size-3" />Reject</button>
          <button type="button" onClick={() => setEdit({ revision, draft: displayedProposal })} className="rounded-lg bg-warning/10 px-2.5 py-1.5 text-[11px] font-semibold text-warning transition-colors hover:bg-warning/20"><PenLine className="mr-1 inline size-3" />Modify</button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-success/25 bg-success/5 p-4">
        <div className="text-[10px] uppercase tracking-wider text-success">Final decision (separate from original Template suggestion)</div>
        <p className="mt-1 text-sm font-medium leading-5 text-foreground">
          {decision.status === 'Pending' ? 'No final decision yet — original Template suggestion is unexecuted until a human approves, rejects, or modifies it.' : decision.finalAction}
        </p>
      </div>
    </div>
  )
}
