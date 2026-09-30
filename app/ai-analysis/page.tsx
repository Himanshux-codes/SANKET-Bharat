'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Copy,
  Database,
  FileCheck2,
  Fingerprint,
  MapPin,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal, RevealGroup } from '@/components/motion/reveal'
import { Eyebrow, Section } from '@/components/section'
import { EvidenceExplainability, type ExplainabilityData } from '@/components/evidence-explainability'
import { SocialSourceSimulation } from '@/components/social-source-simulation'
import { AiRecommendationApproval, type RecommendationData } from '@/components/ai-recommendation-approval'
import { DemoBadge } from '@/components/evaluation/demo-badge'
import { useIncidents } from '@/lib/incident-context'
import type { Incident } from '@/lib/incident-types'
import { useLanguage } from '@/lib/i18n/i18n-context'

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('glass rounded-2xl p-5 sm:p-6', className)}>{children}</div>
}

type IconComponent = React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

function PanelHeading({ icon: Icon, eyebrow, title }: { icon: IconComponent; eyebrow: string; title: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <p className="font-mono text-[0.62rem] tracking-[0.18em] text-accent uppercase">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-medium tracking-tight text-foreground">{title}</h2>
      </div>
    </div>
  )
}

function Metric({ label, value, icon: Icon, tone = 'default' }: { label: string; value: string; icon: IconComponent; tone?: 'default' | 'warning' | 'danger' }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/35 p-4">
      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <span className="text-xs leading-5">{label}</span>
        <Icon className="h-4 w-4 text-accent" aria-hidden />
      </div>
      <p className={cn('mt-3 font-mono text-xl font-semibold', tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning' : 'text-foreground')}>{value}</p>
    </div>
  )
}

function AiAnalysisContent() {
  const { incidents, getIncidentById } = useIncidents()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const targetParamId = searchParams.get('id')

  const [selectedId, setSelectedId] = useState<string>(targetParamId || incidents[0]?.id || 'INC-4821')
  const [open, setOpen] = useState(false)

  // Synchronize selectedId if URL query parameter changes
  useEffect(() => {
    if (targetParamId) {
      setSelectedId(targetParamId)
    }
  }, [targetParamId])

  const activeIncident: Incident = useMemo(
    () =>
      incidents.find((item) => item.id === selectedId || item.reportId === selectedId) ||
      (targetParamId ? getIncidentById(targetParamId) : undefined) ||
      getIncidentById(selectedId) ||
      incidents[0],
    [incidents, selectedId, targetParamId, getIncidentById]
  )

  const explainabilityData: ExplainabilityData = useMemo(() => {
    const hd = activeIncident.humanDecision
    const humanDecisionText =
      hd?.status === 'Approved'
        ? 'Approved by administrator'
        : hd?.status === 'Rejected'
        ? 'Rejected by administrator'
        : hd?.status === 'Modified'
        ? 'Overridden for escalation'
        : 'Awaiting human review'

    return {
      incident: activeIncident.id,
      location: `${activeIncident.city}, ${activeIncident.state}`,
      disasterType: activeIncident.disasterType,
      severity:
        activeIncident.severity === 'critical'
          ? 'Critical'
          : activeIncident.severity === 'high'
          ? 'High'
          : 'Moderate',
      confidence: `${activeIncident.confidence}%`,
      recommendedAction: activeIncident.aiRecommendation.action,
      duplicateCount: activeIncident.duplicateCount,
      factors: activeIncident.factors,
      evidence: activeIncident.evidence,
      humanDecision: humanDecisionText,
    }
  }, [activeIncident])

  const recommendationData: RecommendationData = useMemo(() => {
    return {
      incident: activeIncident.id,
      action: activeIncident.aiRecommendation.action,
      reason: activeIncident.aiRecommendation.reason,
      evidenceSummary: activeIncident.aiRecommendation.evidenceSummary,
      confidence: activeIncident.aiRecommendation.confidence,
      impact: activeIncident.aiRecommendation.impact,
      resources: activeIncident.aiRecommendation.resources,
      allocations: activeIncident.aiRecommendation.allocations,
      allocationFactors: activeIncident.aiRecommendation.allocationFactors,
      humanDecision: activeIncident.humanDecision,
      hazardType: activeIncident.disasterType,
      severity: activeIncident.severity,
      affected: activeIncident.affected,
      location: `${activeIncident.city}, ${activeIncident.state}`,
      teams: activeIncident.teams,
    }
  }, [activeIncident])

  const timeline = [
    ['Report received', '14:32:08', true],
    ['AI verification', '14:32:11', true],
    ['Risk assessment', '14:32:14', true],
    ['Priority generated', '14:32:16', true],
    ['Authority alert', '14:32:18', true],
  ] as const

  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-16 sm:pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,oklch(0.7_0.15_195/0.09),transparent_65%)]" />
      <Section className="py-14 sm:py-20 md:py-24">
        <div className="flex flex-col gap-10">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4">
                <Eyebrow>{t.aiAnalysis.eyebrow}</Eyebrow>
                <div>
                  <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                    AI incident <span className="text-gradient">analysis</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                    {t.aiAnalysis.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start rounded-full border border-success/25 bg-success/10 px-3 py-2 font-mono text-[0.68rem] tracking-[0.12em] text-success uppercase lg:self-auto">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> AI Analysis Engine
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Panel className="relative z-20">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-accent">
                    <Radar className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">Analysis target</p>
                    <p className="mt-1 text-sm text-foreground">Select an incident to inspect model evidence</p>
                  </div>
                </div>
                <div className="relative w-full md:max-w-md">
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-background/55 px-4 py-3 text-left transition-colors hover:border-accent/50"
                  >
                    <span>
                      <span className="font-mono text-xs text-accent">{activeIncident.id}</span>
                      <span className="ml-3 text-sm text-foreground">
                        {activeIncident.city}, {activeIncident.state} · {activeIncident.disasterType}
                      </span>
                    </span>
                    <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden />
                  </button>
                  {open && (
                    <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-2xl">
                      {incidents.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedId(item.id)
                            setOpen(false)
                          }}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-accent/10',
                            item.id === selectedId && 'bg-accent/10'
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-xs text-accent">{item.id}</span>
                            {item.isDemo && <DemoBadge />}
                            <span className="ml-1 text-foreground">{item.city}, {item.state}</span>
                          </span>
                          <span className="text-xs text-muted-foreground">{item.disasterType}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/70 pt-4 sm:grid-cols-4">
                {activeIncident.isDemo && (
                  <div className="col-span-full mb-2">
                    <DemoBadge variant="full" />
                  </div>
                )}
                <div>
                  <p className="text-[0.68rem] text-muted-foreground">Incident ID</p>
                  <p className="mt-1 font-mono text-xs text-foreground">{activeIncident.id}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] text-muted-foreground">Location</p>
                  <p className="mt-1 text-xs text-foreground">{activeIncident.city}, {activeIncident.state}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] text-muted-foreground">Disaster type</p>
                  <p className="mt-1 text-xs text-foreground">{activeIncident.disasterType}</p>
                </div>
                <div>
                  <p className="text-[0.68rem] text-muted-foreground">Timestamp</p>
                  <p className="mt-1 text-xs text-foreground">{activeIncident.updated}</p>
                </div>
              </div>
            </Panel>
          </Reveal>

          <RevealGroup className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]" stagger={0.06}>
            <Panel>
              <PanelHeading icon={Sparkles} eyebrow="Model output" title="AI analysis summary" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Detected disaster" value={activeIncident.disasterType} icon={AlertTriangle} />
                <Metric
                  label="Severity level"
                  value={activeIncident.severity.toUpperCase()}
                  icon={Zap}
                  tone={activeIncident.severity === 'critical' ? 'danger' : activeIncident.severity === 'high' ? 'warning' : 'default'}
                />
                <Metric label="AI Confidence" value={`${activeIncident.confidence}%`} icon={ShieldCheck} />
                <Metric label="Verification status" value={activeIncident.verificationStatus} icon={FileCheck2} />
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-success" aria-hidden />
                Cross-signal pattern assessed across {activeIncident.evidence?.length || 4} evidence sources.
              </div>
            </Panel>
            <Panel>
              <PanelHeading icon={Target} eyebrow="Priority signal" title="Priority score" />
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-danger/20">
                  <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-danger border-r-danger rotate-[38deg]" />
                  <div className="text-center">
                    <p className="font-mono text-5xl font-semibold text-foreground">{activeIncident.confidence}</p>
                    <p className="font-mono text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase">out of 100</p>
                  </div>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-danger/10 px-3 py-1.5 font-mono text-xs tracking-[0.12em] text-danger uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" /> {activeIncident.severity} priority
                </span>
                <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                  Immediate authority response recommended.
                </p>
              </div>
            </Panel>
          </RevealGroup>

          <RevealGroup className="grid gap-5 lg:grid-cols-[1fr_1fr]" stagger={0.06}>
            <Panel>
              <PanelHeading icon={AlertTriangle} eyebrow="Exposure model" title="Risk assessment" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Population at risk" value={activeIncident.affected} icon={Users} tone="danger" />
                <Metric label="Infrastructure risk" value="High · 78%" icon={Database} tone="warning" />
                <Metric label="Spread / escalation" value="Severe · 84%" icon={ArrowRight} tone="danger" />
                <Metric label="Overall risk score" value="8.7 / 10" icon={CircleDot} tone="danger" />
              </div>
            </Panel>
            <Panel>
              <PanelHeading icon={Copy} eyebrow="Integrity checks" title="Duplicate & fake report detection" />
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Duplicate probability</span>
                    <span className="font-mono text-warning">12.4%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[12.4%] rounded-full bg-warning" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">AI authenticity score</span>
                    <span className="font-mono text-success">{activeIncident.confidence}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-success" style={{ width: `${activeIncident.confidence}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/35 px-4 py-3">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Fingerprint className="h-4 w-4 text-accent" aria-hidden /> Corroborating reports
                  </span>
                  <span className="font-mono text-lg text-foreground">{activeIncident.duplicateCount}</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Signal analysis — nearby corroborating reports match the hazard pattern.
                </p>
              </div>
            </Panel>
          </RevealGroup>

          <Reveal>
            <EvidenceExplainability data={explainabilityData} />
          </Reveal>

          <Reveal>
            <SocialSourceSimulation incident={activeIncident} />
          </Reveal>

          <Reveal>
            <AiRecommendationApproval data={recommendationData} />
          </Reveal>

          <RevealGroup className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]" stagger={0.06}>
            <Panel>
              <PanelHeading icon={ShieldCheck} eyebrow="Recommended response" title="AI recommendations" />
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 rounded-xl border border-border/70 bg-background/25 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-[0.65rem] text-accent">01</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Action Plan</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{activeIncident.aiRecommendation.action}</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl border border-border/70 bg-background/25 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-[0.65rem] text-accent">02</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Operational Justification</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{activeIncident.aiRecommendation.reason}</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl border border-border/70 bg-background/25 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-[0.65rem] text-accent">03</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Allocated Resources</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{activeIncident.aiRecommendation.resources.join(', ')}</p>
                  </div>
                </div>
              </div>
            </Panel>
            <Panel>
              <PanelHeading icon={Clock3} eyebrow="Evidence trail" title="Analysis timeline" />
              <div className="relative ml-2 flex flex-col gap-0">
                {timeline.map(([label, time, done], index) => (
                  <div key={label} className="relative flex gap-4 pb-7 last:pb-0">
                    <div className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-card text-accent">
                      {done ? <Check className="h-3 w-3" aria-hidden /> : <span className="h-1.5 w-1.5 rounded-full bg-muted" />}
                    </div>
                    {index < timeline.length - 1 && (
                      <span className="absolute left-[9px] top-5 h-[calc(100%-12px)] w-px bg-accent/25" aria-hidden />
                    )}
                    <div className="flex flex-1 items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-foreground">{label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Automated workflow checkpoint</p>
                      </div>
                      <time className="font-mono text-[0.65rem] text-accent">{time}</time>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-3 py-3 text-xs text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden /> Alert routed to {activeIncident.state} State Emergency Operations Centre.
              </div>
            </Panel>
          </RevealGroup>
        </div>
      </Section>
    </main>
  )
}

export default function AiAnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-muted-foreground">Loading AI analysis models...</div>}>
      <AiAnalysisContent />
    </Suspense>
  )
}
