'use client'

import React, { createContext, useContext, useMemo, useState, useEffect, useCallback, type ReactNode } from 'react'
import type {
  Incident,
  IncidentKind,
  IncidentSeverity,
  IncidentStatus,
  VerificationStatus,
  EvidenceItem,
  AuditEntry,
  ResourceItem,
} from './incident-types'
import type { EvaluatedRow } from './evaluation/types'
import {
  INITIAL_INCIDENTS,
  INITIAL_VERIFICATION_QUEUE,
  INITIAL_AUDIT_TRAIL,
  INITIAL_RESOURCES,
} from './incident-data'

import {
  type QueuedOfflineReport,
  saveOfflineReport,
  getOfflineReports,
  getPendingOfflineReports,
  updateOfflineReportStatus,
} from './offline-db'

export type CreateReportInput = {
  emergencyType: string
  severity: 'Moderate' | 'High' | 'Critical'
  location: string
  coordinates?: string
  description: string
  affected?: string
  name?: string
  contact?: string
  fileName?: string
}

type IncidentContextType = {
  incidents: Incident[]
  verificationQueue: Incident[]
  auditTrail: AuditEntry[]
  resources: ResourceItem[]
  selectedIncidentId: string
  setSelectedIncidentId: (id: string) => void
  getIncidentById: (id: string) => Incident | undefined
  addReport: (input: CreateReportInput) => string
  verifyQueueItem: (
    reportId: string,
    decision: 'Approved' | 'Rejected' | 'Marked duplicate' | 'Escalated'
  ) => void
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void
  updateAiRecommendationDecision: (
    incidentId: string,
    status: 'Pending' | 'Approved' | 'Rejected' | 'Modified',
    finalAction: string,
    reason?: string
  ) => void
  updateAssignedTeam: (incidentId: string, team: string) => void
  addEvidenceItem: (incidentId: string, item: EvidenceItem) => void
  addAuditEntry: (
    entry: Omit<AuditEntry, 'id' | 'timestamp'> & { timestamp?: string }
  ) => void
  addDemoIncidents: (rows: EvaluatedRow[]) => string[]
  promotedDatasetIds: Set<string>
  stats: {
    totalActive: number
    criticalCount: number
    pendingVerificationCount: number
    verifiedCount: number
    assignedTeamsCount: number
  }
  isOnline: boolean
  offlineQueue: QueuedOfflineReport[]
  isSyncing: boolean
  syncFeedback: string | null
  queueOfflineReport: (input: CreateReportInput, imageBlob?: Blob | null) => Promise<string>
  syncPendingReports: () => Promise<{ syncedCount: number; failedCount: number }>
  refreshOfflineQueue: () => Promise<void>
}

const IncidentContext = createContext<IncidentContextType | null>(null)

function getNextIncidentNumber(currentIncidents: Incident[]): number {
  let max = 4829
  for (const inc of currentIncidents) {
    if (inc.id && inc.id.startsWith('INC-')) {
      const n = parseInt(inc.id.replace('INC-', ''), 10)
      if (!isNaN(n) && n > max) max = n
    }
  }
  return max + 1
}

function getNextReportNumber(currentQueue: Incident[]): number {
  let max = 20489
  for (const rep of currentQueue) {
    if (rep.reportId && rep.reportId.startsWith('RPT-')) {
      const n = parseInt(rep.reportId.replace('RPT-', ''), 10)
      if (!isNaN(n) && n > max) max = n
    }
    if (rep.id && rep.id.startsWith('RPT-')) {
      const n = parseInt(rep.id.replace('RPT-', ''), 10)
      if (!isNaN(n) && n > max) max = n
    }
  }
  return max + 1
}

function getNextAuditNumber(currentAudit: AuditEntry[]): number {
  let max = 9009
  for (const aud of currentAudit) {
    if (aud.id && aud.id.startsWith('AUD-')) {
      const n = parseInt(aud.id.replace('AUD-', ''), 10)
      if (!isNaN(n) && n > max) max = n
    }
  }
  return max + 1
}

function mapDisasterKind(type: string): IncidentKind {
  const normalized = type.toLowerCase()
  if (normalized.includes('flood') || normalized.includes('water')) return 'flood'
  if (normalized.includes('fire') || normalized.includes('smoke')) return 'fire'
  if (normalized.includes('quake') || normalized.includes('tremor')) return 'quake'
  if (normalized.includes('cyclone') || normalized.includes('storm') || normalized.includes('wind')) return 'cyclone'
  if (normalized.includes('landslide') || normalized.includes('debris') || normalized.includes('slope')) return 'landslide'
  return 'other'
}

function parseCoordinates(coordStr?: string): { lat: number; lng: number } {
  if (!coordStr) return { lat: 28.5708, lng: 77.3260 } // Default Noida/Delhi NCR
  const latMatch = coordStr.match(/([\d.]+)Â°?\s*([NSns])?/)
  const lngMatch = coordStr.match(/(?:,\s*|\s+)([\d.]+)Â°?\s*([EWew])?/)
  const lat = latMatch ? parseFloat(latMatch[1]) * (latMatch[2]?.toUpperCase() === 'S' ? -1 : 1) : 28.5708
  const lng = lngMatch ? parseFloat(lngMatch[1]) * (lngMatch[2]?.toUpperCase() === 'W' ? -1 : 1) : 77.3260
  return {
    lat: isNaN(lat) ? 28.5708 : lat,
    lng: isNaN(lng) ? 77.3260 : lng,
  }
}

export function IncidentProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS)
  const [verificationQueue, setVerificationQueue] = useState<Incident[]>(INITIAL_VERIFICATION_QUEUE)
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(INITIAL_AUDIT_TRAIL)
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES)
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-4821')
  const [isHydrated, setIsHydrated] = useState(false)

  // Offline support states
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [offlineQueue, setOfflineQueue] = useState<QueuedOfflineReport[]>([])
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)
  const isSyncingRef = React.useRef(false)

  // Refresh offline queue list from IndexedDB
  const refreshOfflineQueue = useCallback(async () => {
    try {
      const reports = await getOfflineReports()
      setOfflineQueue(reports)
    } catch {
      // IndexedDB fallback
    }
  }, [])

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedIncidents = localStorage.getItem('sanket_incidents') || localStorage.getItem('sentinel_incidents')
      if (storedIncidents) setIncidents(JSON.parse(storedIncidents))

      const storedQueue = localStorage.getItem('sanket_queue') || localStorage.getItem('sentinel_queue')
      if (storedQueue) setVerificationQueue(JSON.parse(storedQueue))

      const storedAudit = localStorage.getItem('sanket_audit') || localStorage.getItem('sentinel_audit')
      if (storedAudit) setAuditTrail(JSON.parse(storedAudit))

      const storedResources = localStorage.getItem('sanket_resources') || localStorage.getItem('sentinel_resources')
      if (storedResources) setResources(JSON.parse(storedResources))

      const storedSelectedId = localStorage.getItem('sanket_selected_id') || localStorage.getItem('sentinel_selected_id')
      if (storedSelectedId) setSelectedIncidentId(storedSelectedId)
    } catch {
      // Fallback cleanly to initial datasets
    }
    setIsHydrated(true)
  }, [])

  // Persist state updates to localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem('sanket_incidents', JSON.stringify(incidents))
    } catch {}
  }, [incidents, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem('sanket_queue', JSON.stringify(verificationQueue))
    } catch {}
  }, [verificationQueue, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem('sanket_audit', JSON.stringify(auditTrail))
    } catch {}
  }, [auditTrail, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem('sanket_resources', JSON.stringify(resources))
    } catch {}
  }, [resources, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem('sanket_selected_id', selectedIncidentId)
    } catch {}
  }, [selectedIncidentId, isHydrated])

  const getIncidentById = useCallback(
    (id: string) =>
      incidents.find((inc) => inc.id === id || inc.reportId === id) ||
      verificationQueue.find((rep) => rep.id === id || rep.reportId === id),
    [incidents, verificationQueue]
  )

  const addAuditEntry = useCallback(
    (entry: Omit<AuditEntry, 'id' | 'timestamp'> & { timestamp?: string }) => {
      setAuditTrail((prev) => {
        const nextId = `AUD-${getNextAuditNumber(prev)}`
        const newEntry: AuditEntry = {
          id: nextId,
          timestamp: entry.timestamp || 'Just now',
          ...entry,
        }
        return [newEntry, ...prev]
      })
    },
    []
  )

  const queueOfflineReport = useCallback(
    async (input: CreateReportInput, imageBlob?: Blob | null): Promise<string> => {
      const record = await saveOfflineReport({
        emergencyType: input.emergencyType,
        severity: input.severity,
        location: input.location,
        coordinates: input.coordinates,
        description: input.description,
        affected: input.affected,
        name: input.name,
        contact: input.contact,
        fileName: input.fileName,
        imageBlob: imageBlob || null,
      })
      await refreshOfflineQueue()
      return record.id
    },
    [refreshOfflineQueue]
  )

  const syncPendingReports = useCallback(async () => {
    if (isSyncingRef.current) return { syncedCount: 0, failedCount: 0 }
    if (typeof window === 'undefined' || !navigator.onLine) return { syncedCount: 0, failedCount: 0 }

    isSyncingRef.current = true
    setIsSyncing(true)

    let syncedCount = 0
    let failedCount = 0

    try {
      const pending = await getPendingOfflineReports()
      if (pending.length === 0) {
        setIsSyncing(false)
        isSyncingRef.current = false
        return { syncedCount: 0, failedCount: 0 }
      }

      setSyncFeedback('Connection restored — syncing queued reports.')

      for (const report of pending) {
        try {
          await updateOfflineReportStatus(report.id, 'syncing')

          // Deduplication: check if already present
          let alreadyExists = false
          if (report.syncedIncidentId) {
            alreadyExists =
              incidents.some((inc) => inc.id === report.syncedIncidentId) ||
              verificationQueue.some((rep) => rep.id === report.syncedIncidentId)
          }

          if (!alreadyExists) {
            alreadyExists =
              incidents.some((inc) => inc.factors?.some((f) => f.includes(report.id))) ||
              verificationQueue.some((rep) => rep.factors?.some((f) => f.includes(report.id)))
          }

          if (alreadyExists) {
            await updateOfflineReportStatus(report.id, 'synced', {
              syncedAt: new Date().toISOString(),
            })
            syncedCount++
            continue
          }

          // Generate IDs
          const incidentId = `INC-${getNextIncidentNumber(incidents)}`
          const reportId = `RPT-${getNextReportNumber(verificationQueue)}`
          const { lat, lng } = parseCoordinates(report.coordinates)
          const kind = mapDisasterKind(report.emergencyType)
          const severityKey: IncidentSeverity =
            report.severity === 'Critical' ? 'critical' : report.severity === 'High' ? 'high' : 'moderate'

          const confidenceScore =
            report.description.length > 80 ? 94 : report.description.length > 30 ? 89 : 78
          const city = report.location.split(',')[0]?.trim() || report.location || 'Local Sector'
          const state = report.location.split(',')[1]?.trim() || 'Assigned District'

          const reportDate = new Date(report.createdAt)
          const timeFormatted = isNaN(reportDate.getTime())
            ? report.createdAt
            : `${reportDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${reportDate.toLocaleDateString()}`

          const newReport: Incident = {
            id: incidentId,
            reportId,
            city,
            state,
            location: report.location,
            lat,
            lng,
            coordinates: report.coordinates || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
            kind,
            disasterType: report.emergencyType,
            severity: severityKey,
            status: 'pending',
            verificationStatus: 'Needs Human Review',
            confidence: confidenceScore,
            description: report.description,
            source: 'Citizen Offline Queue Intake',
            updated: `Synced just now (Reported ${timeFormatted})`,
            duplicateCount: 1,
            assignedTeam: 'Unassigned',
            teams: 0,
            affected: report.affected || 'Unknown',
            reporterName: report.name,
            reporterContact: report.contact,
            fileName: report.fileName,
            factors: [
              'Citizen offline queue intake submission',
              `Local submission ID: ${report.id}`,
              `Original offline timestamp: ${timeFormatted}`,
              'Coordinate signal received',
              'Urgency flagged by caller',
              'Pending authority verification',
            ],
            evidence: [
              {
                source: 'Citizen device offline intake',
                timestamp: timeFormatted,
                location: report.location,
                summary: report.description || 'Emergency situation reported via offline intake form.',
                reliability: 'Medium',
                supports: true,
              },
            ],
            evidenceSource: `Citizen offline intake · ${report.id} · Synchronized upon reconnection`,
            aiRecommendation: {
              action: `Verify reported ${report.emergencyType.toLowerCase()} at ${report.location} and dispatch nearest responder team.`,
              reason: `Citizen reported ${report.severity.toLowerCase()} severity event affecting ~${report.affected || 'multiple'} individuals.`,
              evidenceSummary: `Citizen report submitted offline with ${confidenceScore}% initial confidence score. Preserved intake timestamp: ${timeFormatted}.`,
              confidence: `${confidenceScore}%`,
              impact: `${report.affected || 'Local'} residents in reported vicinity.`,
              resources: ['1 Local Assessment Unit', 'Standby Ambulance'],
              allocations: [
                {
                  resource: 'Assessment Unit',
                  target: report.location,
                  reason: 'On-site verification of citizen offline report.',
                },
              ],
              allocationFactors: {
                severity: report.severity,
                affected: `${report.affected || '1+'} people`,
                hazardType: report.emergencyType,
                locationPriority: 'Citizen reported sector',
                distanceLocation: report.location,
                availability: 'Assessment units on standby',
                responsePriority:
                  report.severity === 'Critical'
                    ? 'Immediate Priority (Tier 1)'
                    : report.severity === 'High'
                    ? 'High Priority (Tier 2)'
                    : 'Standard Priority (Tier 3)',
                recommendedTeamCount: '1 Assessment Unit + Standby Ambulance',
                keyFactors: [
                  `Citizen report indicates ${report.severity.toLowerCase()} urgency`,
                  `Reported impact affecting ~${report.affected || 'multiple'} individuals`,
                  `Offline timestamp preserved: ${timeFormatted}`,
                ],
              },
            },
            humanDecision: {
              status: 'Pending',
              finalAction: 'Awaiting human review in Admin Verification Queue',
            },
          }

          setVerificationQueue((prev) => [newReport, ...prev])
          setIncidents((prev) => [newReport, ...prev])

          addAuditEntry({
            incident: incidentId,
            action: 'Offline emergency report synchronized',
            actor: 'Citizen (Offline Queue Sync)',
            actorType: 'Human',
            previousStatus: `Queued offline (${report.id})`,
            newStatus: 'Pending review',
            aiRecommendation: `Initial classification: ${report.emergencyType} (${report.severity}) with ${confidenceScore}% confidence. Intake logged at ${timeFormatted}.`,
            humanDecision: 'Awaiting review in Admin Verification Queue',
            reason: `Offline emergency report safely captured in device IndexedDB (${report.id}) and synced to SANKET Bharat intake stream upon network restoration.`,
          })

          await updateOfflineReportStatus(report.id, 'synced', {
            syncedIncidentId: incidentId,
            syncedAt: new Date().toISOString(),
          })

          syncedCount++
        } catch (itemErr: any) {
          failedCount++
          await updateOfflineReportStatus(report.id, 'failed', {
            error: itemErr?.message || 'Sync failed',
            incrementRetry: true,
          })
        }
      }

      await refreshOfflineQueue()

      if (syncedCount > 0) {
        setSyncFeedback('Report synchronized successfully.')
        setTimeout(() => {
          setSyncFeedback(null)
        }, 4000)
      } else if (failedCount > 0) {
        setSyncFeedback('Sync failed for some reports. Will retry when connection stabilizes.')
        setTimeout(() => {
          setSyncFeedback(null)
        }, 5000)
      }
    } catch (err) {
      console.error('Error during offline report sync:', err)
    } finally {
      setIsSyncing(false)
      isSyncingRef.current = false
    }

    return { syncedCount, failedCount }
  }, [addAuditEntry, incidents, refreshOfflineQueue, verificationQueue])

  // Connectivity event listener and initial offline queue sync
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => {
      setIsOnline(true)
      syncPendingReports()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    refreshOfflineQueue()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [refreshOfflineQueue, syncPendingReports])

  // Check sync on initial mount when online
  useEffect(() => {
    if (isHydrated && typeof navigator !== 'undefined' && navigator.onLine) {
      syncPendingReports()
    }
  }, [isHydrated, syncPendingReports])

  const addReport = useCallback(
    (input: CreateReportInput): string => {
      // Use a local variable to capture the generated ID for the audit entry.
      // We compute next numbers inside functional setState to avoid stale closures.
      let incidentId = ''
      let reportId = ''

      setIncidents((prevIncidents) => {
        const nextInc = getNextIncidentNumber(prevIncidents)
        incidentId = `INC-${nextInc}`
        return prevIncidents // actual insert happens below
      })

      setVerificationQueue((prevQueue) => {
        const nextRpt = getNextReportNumber(prevQueue)
        reportId = `RPT-${nextRpt}`
        return prevQueue // actual insert happens below
      })

      // Force synchronous read via the pattern above, then build the report
      const { lat, lng } = parseCoordinates(input.coordinates)
      const kind = mapDisasterKind(input.emergencyType)
      const severityKey: IncidentSeverity =
        input.severity === 'Critical' ? 'critical' : input.severity === 'High' ? 'high' : 'moderate'

      const confidenceScore = input.description.length > 80 ? 94 : input.description.length > 30 ? 89 : 78
      const city = input.location.split(',')[0]?.trim() || input.location || 'Local Sector'
      const state = input.location.split(',')[1]?.trim() || 'Assigned District'

      const newReport: Incident = {
        id: incidentId,
        reportId,
        city,
        state,
        location: input.location,
        lat,
        lng,
        coordinates: input.coordinates || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
        kind,
        disasterType: input.emergencyType,
        severity: severityKey,
        status: 'pending',
        verificationStatus: 'Needs Human Review',
        confidence: confidenceScore,
        description: input.description,
        source: 'Citizen Emergency Intake',
        updated: 'Just now',
        duplicateCount: 1,
        assignedTeam: 'Unassigned',
        teams: 0,
        affected: input.affected || 'Unknown',
        reporterName: input.name,
        reporterContact: input.contact,
        fileName: input.fileName,
        factors: [
          'Citizen web intake submission',
          'Coordinate signal received',
          'Urgency flagged by caller',
          'Pending authority verification',
        ],
        evidence: [
          {
            source: 'Citizen mobile/web intake',
            timestamp: 'Just now',
            location: input.location,
            summary: input.description || 'Emergency situation reported via citizen intake form.',
            reliability: 'Medium',
            supports: true,
          },
        ],
        evidenceSource: 'Citizen intake form · citizen report submission',
        aiRecommendation: {
          action: `Verify reported ${input.emergencyType.toLowerCase()} at ${input.location} and dispatch nearest responder team.`,
          reason: `Citizen reported ${input.severity.toLowerCase()} severity event affecting ~${input.affected || 'multiple'} individuals.`,
          evidenceSummary: `Citizen report submitted with ${confidenceScore}% initial confidence score.`,
          confidence: `${confidenceScore}%`,
          impact: `${input.affected || 'Local'} residents in reported vicinity.`,
          resources: ['1 Local Assessment Unit', 'Standby Ambulance'],
          allocations: [
            {
              resource: 'Assessment Unit',
              target: input.location,
              reason: 'On-site verification of citizen report.',
            },
          ],
          allocationFactors: {
            severity: input.severity,
            affected: `${input.affected || '1+'} people`,
            hazardType: input.emergencyType,
            locationPriority: 'Citizen reported sector',
            distanceLocation: input.location,
            availability: 'Assessment units on standby',
            responsePriority:
              input.severity === 'Critical'
                ? 'Immediate Priority (Tier 1)'
                : input.severity === 'High'
                ? 'High Priority (Tier 2)'
                : 'Standard Priority (Tier 3)',
            recommendedTeamCount: '1 Assessment Unit + Standby Ambulance',
            keyFactors: [
              `Citizen report indicates ${input.severity.toLowerCase()} urgency`,
              `Reported impact affecting ~${input.affected || 'multiple'} individuals`,
              `Location coordinates flagged for on-site verification`,
            ],
          },
        },
        humanDecision: {
          status: 'Pending',
          finalAction: 'Awaiting human review in Admin Verification Queue',
        },
      }

      // Add to verification queue & overall incidents
      setVerificationQueue((prev) => [newReport, ...prev])
      setIncidents((prev) => [newReport, ...prev])

      // Log into Audit Trail
      addAuditEntry({
        incident: incidentId,
        action: 'Citizen report intake registered',
        actor: 'Citizen (Intake form)',
        actorType: 'AI',
        previousStatus: 'New submission',
        newStatus: 'Pending review',
        aiRecommendation: `Initial classification: ${input.emergencyType} (${input.severity}) with ${confidenceScore}% confidence.`,
        humanDecision: 'Awaiting review in Admin Verification Queue',
        reason: `Citizen report submitted for ${input.location}. Added to verification queue.`,
      })

      return incidentId
    },
    [addAuditEntry]
  )

  const verifyQueueItem = useCallback(
    (reportId: string, decision: 'Approved' | 'Rejected' | 'Marked duplicate' | 'Escalated') => {
      let resolvedIncidentId = reportId

      setVerificationQueue((prev) =>
        prev.map((item) => {
          if (item.id === reportId || item.reportId === reportId) {
            resolvedIncidentId = item.id.startsWith('INC-') ? item.id : item.reportId || item.id
            const newVerificationStatus: VerificationStatus =
              decision === 'Approved'
                ? 'Verified'
                : decision === 'Rejected'
                ? 'Rejected'
                : decision === 'Marked duplicate'
                ? 'Duplicate'
                : 'Needs Human Review'

            const newStatus: IncidentStatus =
              decision === 'Approved'
                ? 'dispatched'
                : decision === 'Rejected'
                ? 'contained'
                : decision === 'Escalated'
                ? 'escalating'
                : 'pending'

            return {
              ...item,
              verificationStatus: newVerificationStatus,
              status: newStatus,
              humanDecision: {
                ...item.humanDecision,
                status: decision === 'Approved' ? 'Approved' : decision === 'Rejected' ? 'Rejected' : 'Modified',
                finalAction: `Admin action: ${decision}`,
                timestamp: 'Just now',
                actor: 'Admin Â· Control Room',
              },
            }
          }
          return item
        })
      )

      setIncidents((prev) =>
        prev.map((item) => {
          if (item.id === reportId || item.reportId === reportId) {
            const newVerificationStatus: VerificationStatus =
              decision === 'Approved'
                ? 'Verified'
                : decision === 'Rejected'
                ? 'Rejected'
                : decision === 'Marked duplicate'
                ? 'Duplicate'
                : 'Needs Human Review'

            const newStatus: IncidentStatus =
              decision === 'Approved'
                ? 'dispatched'
                : decision === 'Rejected'
                ? 'contained'
                : decision === 'Escalated'
                ? 'escalating'
                : 'pending'

            return {
              ...item,
              verificationStatus: newVerificationStatus,
              status: newStatus,
              humanDecision: {
                ...item.humanDecision,
                status: decision === 'Approved' ? 'Approved' : decision === 'Rejected' ? 'Rejected' : 'Modified',
                finalAction: `Admin action: ${decision}`,
                timestamp: 'Just now',
                actor: 'Admin Â· Control Room',
              },
            }
          }
          return item
        })
      )

      // Add to audit trail
      addAuditEntry({
        incident: resolvedIncidentId,
        action: `Report ${decision.toLowerCase()} by Authority`,
        actor: 'Admin Â· Control Room',
        actorType: 'Human',
        previousStatus: 'Pending review',
        newStatus: decision === 'Approved' ? 'Verified & Dispatched' : decision === 'Escalated' ? 'Escalating' : decision,
        aiRecommendation: 'Recommendation reviewed by human operator.',
        humanDecision: `Operator decision: ${decision}`,
        reason: `Verification queue decision recorded by human in the loop.`,
        isOverride: decision === 'Rejected' || decision === 'Marked duplicate' || decision === 'Escalated',
      })
    },
    [addAuditEntry]
  )

  const updateIncidentStatus = useCallback(
    (incidentId: string, status: IncidentStatus) => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === incidentId || inc.reportId === incidentId) {
            return { ...inc, status, updated: 'Just now' }
          }
          return inc
        })
      )

      setVerificationQueue((prev) =>
        prev.map((rep) => {
          if (rep.id === incidentId || rep.reportId === incidentId) {
            return { ...rep, status, updated: 'Just now' }
          }
          return rep
        })
      )

      addAuditEntry({
        incident: incidentId,
        action: `Incident status updated to ${status}`,
        actor: 'Admin Â· Control Room',
        actorType: 'Human',
        previousStatus: 'Previous status',
        newStatus: status,
        aiRecommendation: 'Sync status across command center grid.',
        humanDecision: `Status updated to ${status}`,
        reason: 'Operational status change recorded by dispatcher.',
      })
    },
    [addAuditEntry]
  )

  const updateAiRecommendationDecision = useCallback(
    (
      incidentId: string,
      status: 'Pending' | 'Approved' | 'Rejected' | 'Modified',
      finalAction: string,
      reason?: string
    ) => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === incidentId || inc.reportId === incidentId) {
            return {
              ...inc,
              humanDecision: {
                status,
                finalAction,
                timestamp: 'Just now',
                actor: 'Admin Â· Control Room',
                reason,
                isOverride: status === 'Modified' || status === 'Rejected',
              },
            }
          }
          return inc
        })
      )

      setVerificationQueue((prev) =>
        prev.map((rep) => {
          if (rep.id === incidentId || rep.reportId === incidentId) {
            return {
              ...rep,
              humanDecision: {
                status,
                finalAction,
                timestamp: 'Just now',
                actor: 'Admin Â· Control Room',
                reason,
                isOverride: status === 'Modified' || status === 'Rejected',
              },
            }
          }
          return rep
        })
      )

      addAuditEntry({
        incident: incidentId,
        action: `AI recommendation ${status.toLowerCase()} by Authority`,
        actor: 'Admin Â· Control Room',
        actorType: 'Human',
        previousStatus: 'Pending review',
        newStatus: status,
        aiRecommendation: 'Original AI recommendation submitted for human approval.',
        humanDecision: finalAction,
        reason: reason || `Human authority decision: ${status}`,
        isOverride: status === 'Modified' || status === 'Rejected',
      })
    },
    [addAuditEntry]
  )

  const updateAssignedTeam = useCallback(
    (incidentId: string, team: string) => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === incidentId || inc.reportId === incidentId) {
            return { ...inc, assignedTeam: team, status: 'dispatched' }
          }
          return inc
        })
      )

      setVerificationQueue((prev) =>
        prev.map((rep) => {
          if (rep.id === incidentId || rep.reportId === incidentId) {
            return { ...rep, assignedTeam: team, status: 'dispatched' }
          }
          return rep
        })
      )

      addAuditEntry({
        incident: incidentId,
        action: `Response team assigned (${team})`,
        actor: 'Admin Â· Dispatch Coordinator',
        actorType: 'Human',
        previousStatus: 'Unassigned',
        newStatus: 'Dispatched',
        aiRecommendation: 'Dispatch nearest available response unit.',
        humanDecision: `Assigned team: ${team}`,
        reason: `Field unit ${team} confirmed coordinates and route.`,
      })
    },
    [addAuditEntry]
  )

  const addEvidenceItem = useCallback(
    (incidentId: string, item: EvidenceItem) => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === incidentId || inc.reportId === incidentId) {
            const alreadyExists = inc.evidence.some(
              (e) => e.source === item.source && e.summary === item.summary
            )
            if (alreadyExists) return inc
            return {
              ...inc,
              evidence: [item, ...inc.evidence],
            }
          }
          return inc
        })
      )

      setVerificationQueue((prev) =>
        prev.map((rep) => {
          if (rep.id === incidentId || rep.reportId === incidentId) {
            const alreadyExists = rep.evidence.some(
              (e) => e.source === item.source && e.summary === item.summary
            )
            if (alreadyExists) return rep
            return {
              ...rep,
              evidence: [item, ...rep.evidence],
            }
          }
          return rep
        })
      )

      addAuditEntry({
        incident: incidentId,
        action: `Social evidence linked (${item.source})`,
        actor: 'Admin Â· Control Room',
        actorType: 'Human',
        previousStatus: 'Evidence pool',
        newStatus: 'Supporting signal verified',
        aiRecommendation: `AI indexed social signal from ${item.source} linked to incident footprint.`,
        humanDecision: `Linked ${item.source} signal as corroborated evidence.`,
        reason: item.summary,
      })
    },
    [addAuditEntry]
  )

  // Track which dataset rows have already been promoted to prevent duplicates
  const promotedDatasetIds = useMemo(() => {
    const ids = new Set<string>()
    for (const inc of incidents) {
      if (inc.isDemo && inc.originalDatasetId) {
        ids.add(inc.originalDatasetId)
      }
    }
    return ids
  }, [incidents])

  let demoCounter = React.useRef(1001)

  const addDemoIncidents = useCallback(
    (rows: EvaluatedRow[]): string[] => {
      const newIncidents: Incident[] = []
      const newIds: string[] = []

      for (const row of rows) {
        // Skip if already promoted
        if (promotedDatasetIds.has(row.id)) continue
        // Only promote predicted disasters
        if (row.predicted !== 1) continue

        const demoId = `DEMO-${demoCounter.current++}`
        const kind = mapDisasterKind(row.keyword || row.text)
        const locationText = row.location?.trim() || 'Location not provided'
        const city = locationText.split(',')[0]?.trim() || locationText
        const state = locationText.split(',')[1]?.trim() || 'Unverified Region'

        const newIncident: Incident = {
          id: demoId,
          city,
          state,
          location: locationText,
          // No fabricated coordinates for demo incidents
          lat: NaN,
          lng: NaN,
          kind,
          disasterType: row.keyword || 'Potential Disaster Signal',
          severity: 'moderate' as IncidentSeverity,
          status: 'pending' as IncidentStatus,
          verificationStatus: 'Needs Human Review' as VerificationStatus,
          confidence: Math.round(row.confidence * 100),
          description: row.text,
          source: 'Kaggle Disaster Tweets Dataset',
          updated: 'Just now',
          duplicateCount: 1,
          assignedTeam: 'Unassigned',
          teams: 0,
          affected: 'Unknown',
          factors: [
            'Dataset signal promoted to Demo Sandbox',
            `Original dataset ID: ${row.id}`,
            `Classifier confidence: ${(row.confidence * 100).toFixed(0)}%`,
            'Location verification required',
            'Pending authority verification',
          ],
          evidence: [
            {
              source: 'Dataset Signal',
              timestamp: 'Evaluation Lab',
              location: locationText,
              summary: row.text,
              reliability: 'Low' as const,
              supports: true,
            },
            ...(row.keyword ? [{
              source: 'Dataset Keyword',
              timestamp: 'Evaluation Lab',
              location: locationText,
              summary: `Keyword: ${row.keyword}`,
              reliability: 'Low' as const,
              supports: true,
            }] : []),
          ],
          evidenceSource: `Evaluation Lab · Baseline Rule-Based Classifier · Dataset row ${row.id}`,
          aiRecommendation: {
            action: `Review dataset signal: "${row.text.slice(0, 80)}${row.text.length > 80 ? '…' : ''}"`,
            reason: `Baseline classifier flagged this as a potential disaster signal with ${(row.confidence * 100).toFixed(0)}% confidence. ${row.reasoning}`,
            evidenceSummary: `Dataset signal from Kaggle Disaster Tweets. Classifier: Baseline Rule-Based. This is a demo incident promoted from the Evaluation Lab for testing the human-in-the-loop workflow.`,
            confidence: `${(row.confidence * 100).toFixed(0)}%`,
            impact: 'Unknown — dataset signal, not a live incident.',
            resources: ['Requires human evaluation'],
          },
          humanDecision: {
            status: 'Pending',
            finalAction: 'Awaiting human review in Admin Verification Queue',
          },
          // Demo-specific fields
          isDemo: true,
          sourceType: 'dataset',
          originalDatasetId: row.id,
        }

        newIncidents.push(newIncident)
        newIds.push(demoId)
      }

      if (newIncidents.length > 0) {
        setVerificationQueue((prev) => [...newIncidents, ...prev])
        setIncidents((prev) => [...newIncidents, ...prev])

        // Create audit entries for each promoted incident
        for (const inc of newIncidents) {
          addAuditEntry({
            incident: inc.id,
            action: 'Dataset signal promoted to Demo Sandbox',
            actor: 'Evaluation Lab',
            actorType: 'Human',
            previousStatus: 'Evaluation dataset',
            newStatus: 'Pending review',
            aiRecommendation: `Baseline classifier prediction: disaster signal with ${inc.confidence}% confidence.`,
            humanDecision: 'Awaiting review in Admin Verification Queue',
            reason: `Demo incident created from dataset row ${inc.originalDatasetId}. This is NOT a live incident.`,
          })
        }
      }

      return newIds
    },
    [addAuditEntry, promotedDatasetIds]
  )

  const stats = useMemo(() => {
    const verified = incidents.filter((i) => i.verificationStatus === 'Verified')
    const critical = incidents.filter((i) => i.severity === 'critical' && i.status !== 'contained')
    const pending = verificationQueue.filter((q) => q.verificationStatus !== 'Verified' && q.verificationStatus !== 'Rejected')
    const active = incidents.filter((i) => i.status === 'escalating' || i.status === 'dispatched' || i.status === 'monitoring')

    return {
      totalActive: active.length,
      criticalCount: critical.length,
      pendingVerificationCount: pending.length,
      verifiedCount: verified.length,
      assignedTeamsCount: incidents.reduce((sum, i) => sum + (i.teams || 0), 0),
    }
  }, [incidents, verificationQueue])

  const value = useMemo(
    () => ({
      incidents,
      verificationQueue,
      auditTrail,
      resources,
      selectedIncidentId,
      setSelectedIncidentId,
      getIncidentById,
      addReport,
      verifyQueueItem,
      updateIncidentStatus,
      updateAiRecommendationDecision,
      updateAssignedTeam,
      addEvidenceItem,
      addAuditEntry,
      addDemoIncidents,
      promotedDatasetIds,
      stats,
      isOnline,
      offlineQueue,
      isSyncing,
      syncFeedback,
      queueOfflineReport,
      syncPendingReports,
      refreshOfflineQueue,
    }),
    [
      incidents,
      verificationQueue,
      auditTrail,
      resources,
      selectedIncidentId,
      setSelectedIncidentId,
      getIncidentById,
      addReport,
      verifyQueueItem,
      updateIncidentStatus,
      updateAiRecommendationDecision,
      updateAssignedTeam,
      addEvidenceItem,
      addAuditEntry,
      addDemoIncidents,
      promotedDatasetIds,
      stats,
      isOnline,
      offlineQueue,
      isSyncing,
      syncFeedback,
      queueOfflineReport,
      syncPendingReports,
      refreshOfflineQueue,
    ]
  )

  return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>
}

export function useIncidents() {
  const context = useContext(IncidentContext)
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider')
  }
  return context
}

