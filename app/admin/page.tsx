'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  Ambulance,
  Bell,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Eye,
  HeartPulse,
  MapPin,
  Package,
  Radio,
  ShieldCheck,
  Truck,
  Users,
  X,
  BrainCircuit,
  GitBranch,
  UserRoundCheck,
  Siren,
  ArrowUpRight,
  Merge,
  Warehouse,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { EvidenceExplainability, type ExplainabilityData } from '@/components/evidence-explainability'
import { ReportVerificationWorkflow } from '@/components/report-verification-workflow'
import { AiRecommendationApproval, type RecommendationData } from '@/components/ai-recommendation-approval'
import { AuditTrail } from '@/components/audit-trail'
import { DemoBadge } from '@/components/evaluation/demo-badge'
import { useIncidents } from '@/lib/incident-context'
import type { Incident } from '@/lib/incident-types'
import { useLanguage } from '@/lib/i18n/i18n-context'

const workflow = [
  { label: 'Incoming report', detail: 'Citizen signal received', icon: Radio, tone: 'primary' },
  { label: 'AI analysis', detail: 'Type and severity inferred', icon: BrainCircuit, tone: 'accent' },
  { label: 'Confidence / risk', detail: 'Evidence scored', icon: Activity, tone: 'warning' },
  { label: 'Human review', detail: 'Authority evaluates context', icon: UserRoundCheck, tone: 'violet' },
  { label: 'Verified or rejected', detail: 'Final decision recorded', icon: ShieldCheck, tone: 'success' },
  { label: 'Team assignment', detail: 'Response is coordinated', icon: Siren, tone: 'danger' },
]

const activity = [
  { text: 'Incident verified', detail: 'INC-4821 · Guwahati Kamrup', time: '2 min ago', icon: ShieldCheck, tone: 'success' },
  { text: 'Report escalated', detail: 'Low-confidence chemical spill prediction', time: '11 min ago', icon: ArrowUpRight, tone: 'warning' },
  { text: 'Response team assigned', detail: 'Bravo-2 → Puri Coastal Corridor', time: '19 min ago', icon: Users, tone: 'accent' },
  { text: 'Duplicate reports merged', detail: '12 reports consolidated · Old Market', time: '27 min ago', icon: Merge, tone: 'primary' },
  { text: 'Shelter status updated', detail: 'Kakkanad Relief Center accepting', time: '43 min ago', icon: Warehouse, tone: 'violet' },
]

const alerts = [
  { title: 'Critical incidents awaiting review', detail: 'Brahmaputra and Cyclone Aarav require authority monitoring', tone: 'danger', icon: TriangleAlert },
  { title: 'Low-confidence AI outputs', detail: '1 citizen report below the 75% AI confidence threshold', tone: 'warning', icon: BrainCircuit },
  { title: 'Resource allocation active', detail: '18 of 24 response teams currently deployed in field', tone: 'accent', icon: Package },
  { title: 'Citizen intake stream', detail: 'Incoming reports automatically triaged to Verification Queue', tone: 'primary', icon: ClipboardCheck },
]

const severityBadgeStyles: Record<string, string> = {
  critical: 'bg-danger/10 text-danger border-danger/25',
  high: 'bg-warning/10 text-warning border-warning/25',
  moderate: 'bg-primary/10 text-primary border-primary/25',
  low: 'bg-success/10 text-success border-success/25',
  Critical: 'bg-danger/10 text-danger border-danger/25',
  High: 'bg-warning/10 text-warning border-warning/25',
  Moderate: 'bg-primary/10 text-primary border-primary/25',
  Low: 'bg-success/10 text-success border-success/25',
}

const toneIconStyles: Record<string, { bg: string; text: string }> = {
  accent: { bg: 'bg-accent/10', text: 'text-accent' },
  danger: { bg: 'bg-danger/10', text: 'text-danger' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  violet: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
}

const resourceIconMap: Record<string, LucideIcon> = {
  Users,
  Ambulance,
  Package,
  HeartPulse,
  Truck,
}

function SectionHeading({ icon: Icon, eyebrow, title, count }: { icon: LucideIcon; eyebrow: string; title: string; count?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          <Icon className="size-3.5" /> {eyebrow}
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      {count && <span className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs text-muted-foreground">{count}</span>}
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, trend, tone = 'blue' }: { icon: LucideIcon; label: string; value: string; trend: string; tone?: string }) {
  const styles = toneIconStyles[tone] || toneIconStyles.primary
  return (
    <div className="glass glass-hover rounded-2xl p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${styles.bg} ${styles.text}`}>
          <Icon className="size-4" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-success">{trend}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function MetricCard({ label, value, detail, progress, tone }: { label: string; value: string; detail: string; progress: number; tone: string }) {
  const styles = toneIconStyles[tone] || toneIconStyles.primary
  return (
    <div className="glass glass-hover rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs text-muted-foreground">{label}</div>
        <span className={`font-mono text-lg font-semibold ${styles.text}`}>{value}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${styles.text.replace('text-', 'bg-')}`} style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-2 text-[11px] text-muted-foreground">{detail}</div>
    </div>
  )
}

export default function AdminPage() {
  const {
    incidents,
    verificationQueue,
    resources,
    verifyQueueItem,
    stats,
  } = useIncidents()
  const { t } = useLanguage()

  const [notice, setNotice] = useState('')

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function handleQueueAction(id: string, action: 'Approved' | 'Rejected') {
    verifyQueueItem(id, action)
    showNotice(action === 'Approved' ? 'Report verified & added to active incidents.' : 'Report rejected from verification queue.')
  }

  // Active incident for AI decision review panel (e.g. Guwahati flood or first critical incident)
  const reviewTarget: Incident = incidents.find((i) => i.id === 'INC-4821') || incidents[0]

  const adminExplainability: ExplainabilityData = {
    incident: reviewTarget.id,
    location: `${reviewTarget.city}, ${reviewTarget.state}`,
    disasterType: reviewTarget.disasterType,
    severity: reviewTarget.severity === 'critical' ? 'Critical' : reviewTarget.severity === 'high' ? 'High' : 'Moderate',
    confidence: `${reviewTarget.confidence}%`,
    recommendedAction: reviewTarget.aiRecommendation.action,
    duplicateCount: reviewTarget.duplicateCount,
    factors: reviewTarget.factors,
    evidence: reviewTarget.evidence,
    humanDecision: reviewTarget.humanDecision?.status === 'Approved' ? 'Approved by administrator' : reviewTarget.humanDecision?.status === 'Rejected' ? 'Rejected by administrator' : reviewTarget.humanDecision?.status === 'Modified' ? 'Overridden for escalation' : 'Awaiting human review',
  }

  const adminRecommendation: RecommendationData = {
    incident: reviewTarget.id,
    action: reviewTarget.aiRecommendation.action,
    reason: reviewTarget.aiRecommendation.reason,
    evidenceSummary: reviewTarget.aiRecommendation.evidenceSummary,
    confidence: reviewTarget.aiRecommendation.confidence,
    impact: reviewTarget.aiRecommendation.impact,
    resources: reviewTarget.aiRecommendation.resources,
    allocations: reviewTarget.aiRecommendation.allocations,
    allocationFactors: reviewTarget.aiRecommendation.allocationFactors,
    humanDecision: reviewTarget.humanDecision,
    hazardType: reviewTarget.disasterType,
    severity: reviewTarget.severity,
    affected: reviewTarget.affected,
    location: `${reviewTarget.city}, ${reviewTarget.state}`,
    teams: reviewTarget.teams,
  }

  return (
    <main className="aurora grid-lines min-h-screen px-4 pb-16 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-border/70 pb-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <span className="size-2 animate-pulse rounded-full bg-success shadow-[0_0_12px_var(--success)]" />
              AI Monitoring
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{t.admin.headerTitle}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Operational overview for incident verification, response coordination, and emergency resource readiness across canonical national sectors.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass flex items-center gap-3 rounded-xl px-4 py-3">
              <Activity className="size-4 text-success" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active incidents</div>
                <div className="font-mono text-lg font-semibold text-foreground">{stats.totalActive}</div>
              </div>
            </div>
            <button aria-label="View notifications" className="glass glass-hover rounded-xl p-3 text-muted-foreground hover:text-accent">
              <Bell className="size-5" />
              <span className="sr-only">View notifications</span>
            </button>
          </div>
        </header>

        {/* Top KPIs */}
        <section className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard icon={Radio} label="Active Incidents" value={String(stats.totalActive).padStart(2, '0')} trend={`${stats.totalActive} on grid`} tone="accent" />
          <KpiCard icon={AlertTriangle} label="Critical Incidents" value={String(stats.criticalCount).padStart(2, '0')} trend="Immediate priority" tone="danger" />
          <KpiCard icon={ClipboardCheck} label="Pending Verification" value={String(stats.pendingVerificationCount).padStart(2, '0')} trend="Needs review" tone="warning" />
          <KpiCard icon={Clock3} label="Verified Reports" value={String(stats.verifiedCount)} trend="Verified active" tone="primary" />
          <KpiCard icon={Users} label="Active Response Teams" value={String(stats.assignedTeamsCount)} trend="Deployed in field" tone="success" />
          <KpiCard icon={HeartPulse} label="Shelters Available" value="14" trend="1,280 capacity" tone="amber" />
        </section>

        {/* Decision Pathway */}
        <section className="glass mb-10 rounded-2xl p-4 sm:p-6">
          <SectionHeading icon={GitBranch} eyebrow="Decision pathway" title={t.admin.workflowTitle} count="Authority required" />
          <div className="mb-5 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm leading-6 text-foreground">
            <span className="font-semibold text-accent">AI assists, authorities decide.</span> Predictions, confidence scores, and duplicate signals support review; no emergency response is dispatched from an AI recommendation alone.
          </div>
          <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
            {workflow.map(({ label, detail, icon: Icon, tone }, index) => {
              const styles = toneIconStyles[tone] || toneIconStyles.primary
              const translatedLabel = t.admin.workflowSteps[label] ?? label
              const translatedDetail = t.admin.workflowDetails[detail] ?? detail
              return (
                <div key={label} className="relative flex items-center gap-3 rounded-xl border border-border bg-card/45 p-3 xl:block xl:min-h-32">
                  <div className={`mb-2 flex size-9 shrink-0 items-center justify-center rounded-lg ${styles.bg} ${styles.text}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{translatedLabel}</div>
                    <div className="mt-1 text-[11px] leading-4 text-muted-foreground">{translatedDetail}</div>
                  </div>
                  {index < workflow.length - 1 && (
                    <ChevronRight className="absolute -right-3 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-accent xl:block" />
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Incident Management Table */}
        <section className="glass mb-10 rounded-2xl p-4 sm:p-6">
          <SectionHeading icon={Radio} eyebrow="Operations" title="Incident management" count={`${incidents.length} total`} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <th className="pb-3 font-medium">Incident</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Severity</th>
                  <th className="pb-3 font-medium">Verification</th>
                  <th className="pb-3 font-medium">AI Confidence</th>
                  <th className="pb-3 font-medium">Assigned team</th>
                  <th className="pb-3 font-medium">Updated</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 8).map((incident) => (
                  <tr key={incident.id} className="group border-b border-border/60 last:border-0">
                    <td className="py-4">
                      <div className="font-mono text-xs text-accent">
                        {incident.id}
                        {incident.isDemo && <span className="ml-1.5"><DemoBadge /></span>}
                      </div>
                      <div className="mt-1 font-medium text-foreground">{incident.disasterType}</div>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary" />
                        {incident.city}, {incident.state}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${severityBadgeStyles[incident.severity]}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`flex items-center gap-1.5 text-xs ${incident.verificationStatus === 'Verified' ? 'text-success' : 'text-warning'}`}>
                        <span className={`size-1.5 rounded-full ${incident.verificationStatus === 'Verified' ? 'bg-success' : 'bg-warning'}`} />
                        {incident.verificationStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${incident.confidence}%` }} />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{incident.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-foreground">{incident.assignedTeam}</td>
                    <td className="py-4 text-xs text-muted-foreground">{incident.updated}</td>
                    <td className="py-4">
                      <Link
                        href={`/ai-analysis?id=${incident.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        <Eye className="size-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verification Pathway Component */}
        <ReportVerificationWorkflow />

        {/* Verification Queue & Resource Overview */}
        <div className="mb-10 grid gap-10 xl:grid-cols-[1.25fr_0.75fr]">
          <section>
            <SectionHeading
              icon={ClipboardCheck}
              eyebrow="Human-in-the-loop"
              title="Verification queue"
              count={`${verificationQueue.length} awaiting review`}
            />
            <div className="space-y-3">
              {verificationQueue.map((report) => {
                const isVerified = report.verificationStatus === 'Verified'
                const isRejected = report.verificationStatus === 'Rejected'
                const isDuplicate = report.verificationStatus === 'Duplicate'
                const done = isVerified || isRejected || isDuplicate

                return (
                  <article key={report.id} className={`glass rounded-2xl p-4 transition-opacity ${done ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                            <MapPin className="size-3.5 text-accent" />
                            {report.location}
                          </span>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                            {report.disasterType}
                          </span>
                          <span className="font-mono text-xs text-accent">({report.id})</span>
                          {report.isDemo && <DemoBadge />}
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{report.description}</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>
                            <strong className="font-mono text-accent">{report.confidence}%</strong> AI confidence
                          </span>
                          <span>
                            <strong className="font-mono text-foreground">{report.duplicateCount}</strong> duplicate reports
                          </span>
                          <span>{report.updated}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 sm:self-center">
                        {done ? (
                          <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
                            {isVerified ? (
                              <>
                                <Check className="size-3.5 text-success" /> Verified
                              </>
                            ) : isRejected ? (
                              <>
                                <X className="size-3.5 text-danger" /> Rejected
                              </>
                            ) : (
                              <>
                                <Merge className="size-3.5 text-primary" /> Duplicate
                              </>
                            )}
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleQueueAction(report.id, 'Rejected')}
                              className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-danger/40 hover:text-danger"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQueueAction(report.id, 'Approved')}
                              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
                            >
                              Verify
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section>
            <SectionHeading icon={Package} eyebrow="Readiness" title="Resource overview" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {resources.map((item) => {
                const IconComponent = resourceIconMap[item.iconName] || Package
                const styles = toneIconStyles[item.tone] || toneIconStyles.primary
                return (
                  <div key={item.label} className="glass glass-hover flex items-center gap-4 rounded-2xl p-4">
                    <div className={`rounded-xl p-3 ${styles.bg} ${styles.text}`}>
                      <IconComponent className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div>
                    </div>
                    <div className="text-right font-mono text-sm font-semibold text-foreground">{item.value}</div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* AI Decision Review & Performance */}
        <section className="mb-10 grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="glass rounded-2xl p-4 sm:p-6">
            <SectionHeading icon={BrainCircuit} eyebrow="Human review desk" title="AI decision review" count={reviewTarget.id} />
            <EvidenceExplainability data={adminExplainability} compact />
            {/* Supporting Signals compact link to AI Analysis */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-background/35 px-3.5 py-2.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Radio className="size-3.5 text-accent" />
                <span>
                  <strong className="text-foreground">Supporting Signals:</strong> 4 social channels (WhatsApp, Instagram, X, FB)
                </span>
                <span className="rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                  AI Indexed
                </span>
              </div>
              <Link
                href={`/ai-analysis?id=${reviewTarget.id}`}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-accent transition-colors hover:underline"
              >
                Inspect signals in AI Analysis <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card/45 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Incident</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{reviewTarget.city} · {reviewTarget.disasterType}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/45 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Model Output</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{reviewTarget.disasterType} · {reviewTarget.severity}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/45 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Confidence</div>
                <div className="mt-1 font-mono text-sm font-semibold text-accent">{reviewTarget.confidence}%</div>
              </div>
              <div className="rounded-xl border border-border bg-card/45 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Corroborating signals</div>
                <div className="mt-1 font-mono text-sm font-semibold text-foreground">{reviewTarget.duplicateCount} linked signals</div>
              </div>
            </div>
            <div className="mt-4">
              <AiRecommendationApproval data={adminRecommendation} compact />
            </div>
          </section>

          <section>
            <SectionHeading icon={Activity} eyebrow="AI Performance Monitoring" title="AI performance metrics" />
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Triage confidence" value="94.2%" detail="AI score · Not a validated real-world accuracy measure" progress={94} tone="accent" />
              <MetricCard label="False positive rate" value="3.8%" detail="Benchmark target" progress={24} tone="success" />
              <MetricCard label="Duplicate pattern matching" value="91.6%" detail="Correlation score" progress={92} tone="primary" />
              <MetricCard label="Pipeline latency" value="04:18" detail="Minutes · Benchmark target" progress={78} tone="warning" />
              <MetricCard label="Human review coverage" value="100%" detail="All consequential actions require human authority decision" progress={100} tone="violet" />
            </div>
          </section>
        </section>

        {/* Activity & Alerts */}
        <section className="grid gap-10 xl:grid-cols-[1fr_0.85fr]">
          <section className="glass rounded-2xl p-4 sm:p-6">
            <SectionHeading icon={Activity} eyebrow="AI advisory feed" title="System activity" count="Live updates" />
            <div className="space-y-1">
              {activity.map(({ text, detail, time, icon: Icon, tone }) => {
                const styles = toneIconStyles[tone] || toneIconStyles.primary
                return (
                  <div key={text} className="flex gap-3 border-b border-border/60 py-3 last:border-0">
                    <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${styles.bg} ${styles.text}`}>
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{text}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>
                    </div>
                    <time className="shrink-0 text-[11px] text-muted-foreground">{time}</time>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="glass rounded-2xl p-4 sm:p-6">
            <SectionHeading icon={AlertTriangle} eyebrow="Attention required" title="Admin alerts" count={`${alerts.length} active`} />
            <div className="space-y-2">
              {alerts.map(({ title, detail, tone, icon: Icon }) => {
                const styles = toneIconStyles[tone] || toneIconStyles.danger
                return (
                  <div key={title} className={`flex gap-3 rounded-xl border border-border/60 ${styles.bg} p-3`}>
                    <Icon className={`mt-0.5 size-4 shrink-0 ${styles.text}`} />
                    <div>
                      <div className="text-xs font-semibold text-foreground">{title}</div>
                      <div className="mt-1 text-[11px] leading-4 text-muted-foreground">{detail}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </section>

        {/* Audit Trail */}
        <AuditTrail />

        {/* Notice toast */}
        {notice && (
          <div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-success/30 bg-card px-4 py-3 text-sm text-foreground shadow-2xl">
            <Check className="size-4 text-success" />
            {notice}
          </div>
        )}
      </div>
    </main>
  )
}
