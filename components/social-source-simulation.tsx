'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Camera,
  Share2,
  Users,
  MapPin,
  Clock,
  Radio,
  Check,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIncidents } from '@/lib/incident-context'
import { metadata, tagRecord, type WorkflowMetadata } from '@/lib/data-mode'
import type { Incident } from '@/lib/incident-types'

export type SocialSource = 'WhatsApp' | 'Instagram' | 'X (Twitter)' | 'Facebook'

export type SocialSignal = WorkflowMetadata & {
  id: string
  source: SocialSource
  message: string
  location: string
  timestamp: string
  status: 'Simulation'
}

const sourceMeta: Record<
  SocialSource,
  { icon: typeof MessageSquare; badge: string; iconColor: string }
> = {
  WhatsApp: {
    icon: MessageSquare,
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    iconColor: 'text-emerald-400',
  },
  Instagram: {
    icon: Camera,
    badge: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400',
    iconColor: 'text-fuchsia-400',
  },
  'X (Twitter)': {
    icon: Share2,
    badge: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    iconColor: 'text-sky-400',
  },
  Facebook: {
    icon: Users,
    badge: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    iconColor: 'text-blue-400',
  },
}

export function getSimulatedSocialSignals(incident?: {
  id?: string
  city?: string
  state?: string
  location?: string
  disasterType?: string
  dataMode?: 'demo' | 'evaluation' | 'pilot'
}): SocialSignal[] {
  if (incident && incident.dataMode !== 'demo') return []
  const city = incident?.city || 'Local Sector'
  const loc = incident?.location || `${city} Central`
  const disaster = (incident?.disasterType || 'Emergency').toLowerCase()

  return [
    {
      id: `${incident?.id || 'SIG'}-wa`,
      source: 'WhatsApp',
      message: `Emergency group alert: Rapid water rise and blocked road near ${loc}. Residents advising alternate route.`,
      location: loc,
      timestamp: '2 min ago',
      status: 'Simulation',
    },
    {
      id: `${incident?.id || 'SIG'}-ig`,
      source: 'Instagram',
      message: `Citizen story video shows active ${disaster} impact and traffic backlog along primary corridor in ${city}.`,
      location: `${city} Corridor`,
      timestamp: '5 min ago',
      status: 'Simulation',
    },
    {
      id: `${incident?.id || 'SIG'}-x`,
      source: 'X (Twitter)',
      message: `Citizen alert thread: Urgent assistance needed near ${loc} due to escalating ${disaster}. Emergency units requested.`,
      location: city,
      timestamp: '9 min ago',
      status: 'Simulation',
    },
    {
      id: `${incident?.id || 'SIG'}-fb`,
      source: 'Facebook',
      message: `Community forum update: Relief shelter assembly point set up at school near ${incident?.state || 'District'} perimeter.`,
      location: `${city} Sector 4`,
      timestamp: '14 min ago',
      status: 'Simulation',
    },
  ].map(signal => tagRecord({ ...signal, message: 'Fictional example: ' + signal.message }, metadata('demo', 'social-simulation', signal.id))) as SocialSignal[]
}

export function SocialSourceSimulation({
  incident,
  compact = false,
}: {
  incident?: Incident
  compact?: boolean
}) {
  const { addEvidenceItem } = useIncidents()
  const [linkedIds, setLinkedIds] = useState<Record<string, boolean>>({})

  const signals = getSimulatedSocialSignals(incident)

  function handleLinkEvidence(signal: SocialSignal) {
    if (!incident?.id) return
    setLinkedIds((prev) => ({ ...prev, [signal.id]: true }))
    addEvidenceItem(incident.id, {
      ...signal,
      source: `${signal.source} (fictional example)`,
      timestamp: signal.timestamp,
      location: signal.location,
      summary: signal.message,
      reliability: 'Unknown',
      supports: false,
      verification: 'illustrative',
    })
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-accent/20 bg-accent/[0.035] p-4 sm:p-5',
        compact && 'p-3 sm:p-4'
      )}
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            <Radio className="size-3.5" /> Social Source Simulation
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Generated examples only. No social API access, verification or corroboration. Available only for demo records.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground uppercase">
          Fictional examples
        </span>
      </div>

      {/* Signals Grid */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {signals.map((signal) => {
          const meta = sourceMeta[signal.source]
          const Icon = meta.icon
          const isLinked = linkedIds[signal.id]

          return (
            <article
              key={signal.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card/45 p-3.5 transition-colors hover:border-accent/30"
            >
              <div>
                {/* Channel Header & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide',
                      meta.badge
                    )}
                  >
                    <Icon className="size-3" />
                    {signal.source}
                  </span>
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-accent">
                    {signal.status}
                  </span>
                </div>

                {/* Message */}
                <p className="mt-2 text-xs leading-5 text-foreground">{signal.message}</p>
              </div>

              {/* Footer: Location, Timestamp, and Connect to Evidence Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-primary" />
                    {signal.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Clock className="size-3 text-muted-foreground" />
                    {signal.timestamp}
                  </span>
                </div>

                {incident?.id && (
                  <button
                    type="button"
                    onClick={() => handleLinkEvidence(signal)}
                    disabled={isLinked}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors',
                      isLinked
                        ? 'bg-success/10 text-success border border-success/30'
                        : 'border border-border bg-background/50 text-muted-foreground hover:border-accent/40 hover:text-accent'
                    )}
                  >
                    {isLinked ? (
                      <>
                        <Check className="size-3 text-success" /> Fictional note attached
                      </>
                    ) : (
                      <>
                        <Plus className="size-3" /> Attach fictional note
                      </>
                    )}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
