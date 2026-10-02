'use client'

import { APP_DATA_MODE, canAttachEvidence, deriveMetadata, metadata, requireSandbox, restoreSandbox, selectMode, tagRecord, type WorkflowMetadata } from './data-mode'
import { buildDemoReport, repairSandboxIncident, localId, type CreateReportInput } from './demo-records'
export type { CreateReportInput } from './demo-records'

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
    decision: 'Approved' | 'Rejected' | 'Marked duplicate' | 'Escalated',
    canonicalCaseId?: string
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
    entry: Omit<AuditEntry, 'id' | 'timestamp' | keyof WorkflowMetadata> & Partial<WorkflowMetadata> & { timestamp?: string }
  ) => void
  addDemoIncidents: (rows: EvaluatedRow[]) => string[]
  promotedDatasetIds: Set<string>
  stats: WorkflowMetadata & {
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
      setOfflineQueue(restoreSandbox<QueuedOfflineReport>(reports))
    } catch {
      // IndexedDB fallback
    }
  }, [])

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedIncidents = localStorage.getItem('sanket_incidents') || localStorage.getItem('sentinel_incidents')
      if (storedIncidents) {
        const restored = restoreSandbox<Incident>(JSON.parse(storedIncidents)).map(repairSandboxIncident)
        // Rejected/empty storage must not leave the demo screens without their required scenario.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore external browser storage after server-matching hydration.
        setIncidents(restored.length ? restored : INITIAL_INCIDENTS)
      }

      const storedQueue = localStorage.getItem('sanket_queue') || localStorage.getItem('sentinel_queue')
      if (storedQueue) setVerificationQueue(restoreSandbox<Incident>(JSON.parse(storedQueue)).map(repairSandboxIncident))

      const storedAudit = localStorage.getItem('sanket_audit') || localStorage.getItem('sentinel_audit')
      if (storedAudit) setAuditTrail(restoreSandbox<AuditEntry>(JSON.parse(storedAudit)).map(entry => entry.provenance.origin === 'legacy-browser' ? { ...entry, action: 'Legacy illustrative event', actor: 'Legacy demo user (not authenticated)', timestamp: 'Legacy unverified time', previousStatus: 'Legacy illustrative state', newStatus: 'Unverified scenario', humanDecision: 'No operational action established', aiRecommendation: 'Legacy illustrative proposal', reason: 'Legacy browser history; not proof of any authority receipt, assignment or communication.' } : entry))

      const storedResources = localStorage.getItem('sanket_resources') || localStorage.getItem('sentinel_resources')
      if (storedResources) setResources(restoreSandbox<ResourceItem>(JSON.parse(storedResources)).map(item => ({ ...item, value: 'Not available', detail: 'No connected resource inventory' })))

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
    (entry: Omit<AuditEntry, 'id' | 'timestamp' | keyof WorkflowMetadata> & Partial<WorkflowMetadata> & { timestamp?: string }) => {
      setAuditTrail((prev) => {
        const nextId = `AUD-${getNextAuditNumber(prev)}`
        const tag = entry.dataMode ? entry as WorkflowMetadata : metadata('demo', 'derived', nextId)
        requireSandbox(tag)
        const newEntry = tagRecord({ ...entry, id: nextId, timestamp: entry.timestamp || new Date().toISOString() }, tag) as AuditEntry
        return [newEntry, ...prev]
      })
    },
    []
  )

  const queueOfflineReport = useCallback(
    async (input: CreateReportInput, imageBlob?: Blob | null): Promise<string> => {
      if ('dataMode' in input && input.dataMode !== APP_DATA_MODE) throw new Error('Pilot/foreign intake is unavailable')
      const record = await saveOfflineReport({
        ...metadata('demo', 'offline-local', localId('LOCAL')),
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

      setSyncFeedback('Browser reports connectivity — copying local queued examples.')

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

          requireSandbox(report)
          const incidentId = localId('DEMO')
          const reportId = localId('LOCAL-RPT')
          const newReport = buildDemoReport(report, incidentId, reportId, deriveMetadata([report], incidentId))
          newReport.source = 'Offline local demo queue'
          newReport.factors.push(`Local submission ID: ${report.id}`)
          setVerificationQueue((prev) => [newReport, ...prev])
          setIncidents((prev) => [newReport, ...prev])

          addAuditEntry({
            ...deriveMetadata([newReport], localId('EVENT')),
            incident: incidentId,
            action: 'Offline demo record copied locally',
            actor: 'Demo user (local copy; not authenticated)',
            actorType: 'Human',
            previousStatus: `Queued offline (${report.id})`,
            newStatus: 'Pending review',
            aiRecommendation: 'User-selected hazard and urgency; no confidence estimate.',
            humanDecision: 'Awaiting review in Admin Verification Queue',
            reason: `Local IndexedDB record ${report.id} copied to this browser demo. No server or authority receipt.`,
          })

          await updateOfflineReportStatus(report.id, 'synced', {
            syncedIncidentId: incidentId,
            syncedAt: new Date().toISOString(),
          })

          syncedCount++
        } catch (itemErr) {
          failedCount++
          await updateOfflineReportStatus(report.id, 'failed', {
            error: itemErr instanceof Error ? itemErr.message : 'Local copy failed',
            incrementRetry: true,
          })
        }
      }

      await refreshOfflineQueue()

      if (syncedCount > 0) {
        setSyncFeedback('Local queue copied into this browser demo; no authority receipt.')
        setTimeout(() => {
          setSyncFeedback(null)
        }, 4000)
      } else if (failedCount > 0) {
        setSyncFeedback('Local copy failed for some examples; retry while the app is open.')
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

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initialize from the browser connectivity API; this is not authority synchronization.
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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Start the existing local-only queue copy after browser storage hydration.
      syncPendingReports()
    }
  }, [isHydrated, syncPendingReports])

  const addReport = useCallback((input: CreateReportInput): string => {
    const id = localId('DEMO')
    const record = buildDemoReport(input, id, localId('LOCAL-RPT'))
    setVerificationQueue(prev => [record, ...prev])
    setIncidents(prev => [record, ...prev])
    addAuditEntry({ ...deriveMetadata([record], localId('EVENT')), incident: id, action: 'Local demo input added', actor: 'Demo user (not authenticated)', actorType: 'Human',
      previousStatus: 'No local record', newStatus: 'Pending simulated review', aiRecommendation: record.aiRecommendation.action,
      humanDecision: 'No operational decision', reason: 'Added to local browser state. No report sent to an authority.' })
    return id
  }, [addAuditEntry])

  const verifyQueueItem = useCallback((id: string, decision: 'Approved' | 'Rejected' | 'Marked duplicate' | 'Escalated', canonicalCaseId?: string) => {
    const record = verificationQueue.find(item => item.id === id || item.reportId === id) || getIncidentById(id)
    if (!record) return
    requireSandbox(record)
    if (decision === 'Marked duplicate') {
      const canonical = canonicalCaseId ? getIncidentById(canonicalCaseId) : undefined
      if (!canonical || canonical.id === record.id || canonical.dataMode !== record.dataMode || canonical.canonicalCaseId) {
        throw new Error('A duplicate needs a different same-mode canonical case. Original record is retained.')
      }
    }
    const verificationStatus: VerificationStatus = decision === 'Approved' ? 'Verified' : decision === 'Rejected' ? 'Rejected' : decision === 'Marked duplicate' ? 'Duplicate' : 'Needs Human Review'
    const update = (items: Incident[]) => items.map(item => item.id === record.id ? { ...item, verificationStatus, ...(decision === 'Marked duplicate' ? { canonicalCaseId } : {}) } : item)
    setVerificationQueue(update)
    setIncidents(update)
    addAuditEntry({ ...deriveMetadata([record], localId('EVENT')), incident: record.id, action: `Simulated report review: ${decision}`, actor: 'Demo user (not authenticated)', actorType: 'Human',
      previousStatus: record.verificationStatus, newStatus: verificationStatus, aiRecommendation: record.aiRecommendation.action,
      humanDecision: `Demo report decision: ${decision}`, reason: 'Report review only. Incident, recommendation and assignment state unchanged.' })
  }, [addAuditEntry, getIncidentById, verificationQueue])

  const updateIncidentStatus = useCallback(() => {
    throw new Error('Incident lifecycle changes are unavailable until an authorized workflow is implemented')
  }, [])

  const updateAiRecommendationDecision = useCallback(
    (
      incidentId: string,
      status: 'Pending' | 'Approved' | 'Rejected' | 'Modified',
      finalAction: string,
      reason?: string
    ) => {
      const record = getIncidentById(incidentId)
      if (!record) return
      requireSandbox(record)
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === incidentId || inc.reportId === incidentId) {
            return {
              ...inc,
              humanDecision: {
                ...deriveMetadata([record.aiRecommendation], localId('DECISION')),
                status,
                finalAction,
                timestamp: 'Just now',
                actor: 'Demo user (not authenticated)',
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
                ...deriveMetadata([record.aiRecommendation], localId('DECISION')),
                status,
                finalAction,
                timestamp: 'Just now',
                actor: 'Demo user (not authenticated)',
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
        ...deriveMetadata([record], localId('EVENT')),
        action: `Simulated recommendation ${status.toLowerCase()}`,
        actor: 'Demo user (not authenticated)',
        actorType: 'Human',
        previousStatus: 'Pending review',
        newStatus: status,
        aiRecommendation: 'Illustrative template presented for simulated review; no model inference.',
        humanDecision: finalAction,
        reason: reason || `Simulated recommendation decision: ${status}`,
        isOverride: status === 'Modified' || status === 'Rejected',
      })
    },
    [addAuditEntry, getIncidentById]
  )

  const updateAssignedTeam = useCallback(() => {
    throw new Error('Assignments and communication are not implemented')
  }, [])

  const addEvidenceItem = useCallback((id: string, item: EvidenceItem) => {
    const owner = getIncidentById(id)
    if (!owner || !canAttachEvidence(owner, item)) throw new Error('Cross-mode or pilot evidence is prohibited')
    const note = tagRecord({ ...item, supports: false, verification: 'illustrative' as const, reliability: 'Unknown' as const }, item)
    if (owner.evidence.some(e => e.provenance.sourceId === note.provenance.sourceId)) return
    const update = (items: Incident[]) => items.map(i => i.id === owner.id ? { ...i, evidence: [note, ...i.evidence] } : i)
    setIncidents(update); setVerificationQueue(update)
    addAuditEntry({ ...deriveMetadata([owner, note], localId('EVENT')), incident: owner.id, action: 'Illustrative note attached', actor: 'Demo user (not authenticated)', actorType: 'Human',
      previousStatus: 'Sandbox notes', newStatus: 'Unverified simulation note', aiRecommendation: 'No source verification performed',
      humanDecision: 'Attached a fictional example; not corroboration', reason: note.summary })
  }, [addAuditEntry, getIncidentById])

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


  const addDemoIncidents = useCallback(
    (rows: EvaluatedRow[]): string[] => {
      const newIncidents: Incident[] = []
      const newIds: string[] = []

      for (const row of rows) {
        // Skip if already promoted
        if (promotedDatasetIds.has(row.id)) continue
        // Only promote predicted disasters
        if (row.predicted !== 1) continue

        requireSandbox(row)
        if (row.dataMode !== 'evaluation') throw new Error('Evaluation records required')
        const demoId = localId('EVAL')
        const kind = mapDisasterKind(row.keyword || row.text)
        const locationText = row.location?.trim() || 'Location not provided'
        const city = locationText.split(',')[0]?.trim() || locationText
        const state = locationText.split(',')[1]?.trim() || 'Unverified Region'

        const newIncident = tagRecord({
          id: demoId,
          city,
          state,
          location: locationText,
          // No fabricated coordinates for demo incidents
          lat: null,
          lng: null,
          kind,
          disasterType: row.keyword || 'Potential Disaster Signal',
          severity: 'moderate' as IncidentSeverity,
          status: 'pending' as IncidentStatus,
          verificationStatus: 'Needs Human Review' as VerificationStatus,
          confidence: null,
          description: row.text,
          source: 'Uploaded evaluation dataset (origin unverified)',
          updated: 'Just now',
          duplicateCount: 0,
          assignedTeam: 'Not available',
          teams: 0,
          affected: 'Unknown',
          factors: [
            'Dataset signal added to Evaluation Sandbox',
            `Original dataset ID: ${row.id}`,
            `Rule score: ${(row.confidence * 100).toFixed(0)}% (not probability)`,
            'Location verification required',
            'Severity is a sandbox display preset; not assessed',
            'Pending simulated review',
          ],
          evidence: [
            {
              source: 'Dataset Signal',
              timestamp: 'Evaluation Lab',
              location: locationText,
              summary: row.text,
              reliability: 'Unknown' as const,
              supports: false,
              verification: 'illustrative',
            },
            ...(row.keyword ? [{
              source: 'Dataset Keyword',
              timestamp: 'Evaluation Lab',
              location: locationText,
              summary: `Keyword: ${row.keyword}`,
              reliability: 'Unknown' as const,
              supports: false,
              verification: 'illustrative',
            }] : []),
          ],
          evidenceSource: `Evaluation Lab · Baseline Rule-Based Classifier · Dataset row ${row.id}`,
          aiRecommendation: {
            action: `Review dataset signal: "${row.text.slice(0, 80)}${row.text.length > 80 ? '…' : ''}"`,
            reason: `Baseline classifier flagged this as a potential disaster signal using keyword rules. ${row.reasoning}`,
            evidenceSummary: `User-uploaded dataset signal; origin unverified. Classifier: Baseline Rule-Based. This remains an evaluation record from the Evaluation Lab for testing the human-in-the-loop workflow.`,
            confidence: 'Not available',
            impact: 'Unknown — dataset signal, not a live incident.',
            resources: [],
          },
          humanDecision: {
            status: 'Pending',
            finalAction: 'Awaiting human review in Admin Verification Queue',
          },
          // Demo-specific fields
          isDemo: true,
          sourceType: 'dataset',
          originalDatasetId: row.id,
        }, deriveMetadata([row], demoId)) as Incident

        newIncidents.push(newIncident)
        newIds.push(demoId)
      }

      if (newIncidents.length > 0) {
        setVerificationQueue((prev) => [...newIncidents, ...prev])
        setIncidents((prev) => [...newIncidents, ...prev])

        // Create audit entries for each promoted incident
        for (const inc of newIncidents) {
          addAuditEntry({
            ...deriveMetadata([inc], localId('EVENT')),
            incident: inc.id,
            action: 'Dataset signal added to Evaluation Sandbox',
            actor: 'Evaluation Lab',
            actorType: 'Human',
            previousStatus: 'Evaluation dataset',
            newStatus: 'Pending review',
            aiRecommendation: `Baseline classifier flagged an evaluation sample; not report authenticity.`,
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
    const demoIncidents = selectMode(incidents, APP_DATA_MODE)
    const demoQueue = selectMode(verificationQueue, APP_DATA_MODE)
    const verified = demoIncidents.filter((i) => i.verificationStatus === 'Verified')
    const critical = demoIncidents.filter((i) => i.severity === 'critical' && i.status !== 'contained')
    const pending = demoQueue.filter((q) => q.verificationStatus !== 'Verified' && q.verificationStatus !== 'Rejected')
    const active = demoIncidents.filter((i) => i.status === 'escalating' || i.status === 'dispatched' || i.status === 'monitoring')

    return {
      ...deriveMetadata(demoIncidents.length ? demoIncidents : [metadata('demo', 'derived', 'empty-stats')], 'demo-stats'),
      totalActive: active.length,
      criticalCount: critical.length,
      pendingVerificationCount: pending.length,
      verifiedCount: verified.length,
      assignedTeamsCount: demoIncidents.reduce((sum, i) => sum + (i.teams || 0), 0),
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
