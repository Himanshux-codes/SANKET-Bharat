import type { Incident } from './incident-types'
import { metadata, requireSandbox, tagRecord, type WithoutMetadata, type WorkflowMetadata } from './data-mode'

export type CreateReportInput = {
  emergencyType: string; severity: 'Moderate' | 'High' | 'Critical'; location: string
  coordinates?: string; description: string; affected?: string; name?: string; contact?: string; fileName?: string
}
export function localId(prefix: string): string { return `${prefix}-${crypto.randomUUID()}` }
export function buildDemoReport(input: CreateReportInput, id: string, reportId: string, tag: WorkflowMetadata = metadata('demo', 'local-form', id)): Incident {
  requireSandbox(tag)
  if ('dataMode' in input && input.dataMode !== tag.dataMode) throw new Error('Cannot relabel a foreign-mode report')
  // No geolocation/geocoding is implemented. Unknown is deliberately not a plausible map pin.
  const lat = null, lng = null
  const text = input.emergencyType.toLowerCase()
  const kind = text.includes('flood') ? 'flood' : text.includes('fire') ? 'fire' : text.includes('quake') ? 'quake' : text.includes('cyclone') ? 'cyclone' : text.includes('landslide') ? 'landslide' : 'other'
  return tagRecord<WithoutMetadata<Incident>>({
    id, reportId, city: input.location.split(',')[0]?.trim() || 'Unknown', state: input.location.split(',')[1]?.trim() || 'Unknown',
    location: input.location || 'Unknown', lat, lng, coordinates: 'Unknown — location capture unavailable', kind,
    disasterType: input.emergencyType, severity: input.severity === 'Critical' ? 'critical' : input.severity === 'High' ? 'high' : 'moderate',
    status: 'pending', verificationStatus: 'Needs Human Review', confidence: null, description: input.description,
    source: 'Local demo form', updated: new Date().toISOString(), duplicateCount: 0, assignedTeam: 'Not available', teams: 0,
    affected: input.affected || 'Unknown', reporterName: input.name, reporterContact: input.contact, fileName: input.fileName,
    factors: ['Demo input, not an emergency submission', 'Urgency selected by the user', 'Location and authenticity not verified'],
    evidence: [{ source: 'Local demo input', timestamp: new Date().toISOString(), location: input.location || 'Unknown', summary: input.description,
      reliability: 'Unknown', supports: false, verification: 'unverified' }],
    evidenceSource: 'Local browser demo; no independent corroboration',
    aiRecommendation: {
      action: `Review the local demo description of ${input.emergencyType.toLowerCase()} at ${input.location || 'an unknown location'}.`,
      reason: 'Rule/template example using user-entered fields; not model inference.', evidenceSummary: 'One unverified local demo input.',
      confidence: 'Not available', impact: input.affected ? `User-entered estimate: ${input.affected}; unverified` : 'Unknown', resources: [], allocations: [],
      allocationFactors: { severity: `${input.severity} (user selected)`, affected: input.affected || 'Unknown', hazardType: input.emergencyType,
        distanceLocation: 'Unknown', availability: 'Not available', recommendedTeamCount: 'Not available', responsePriority: 'Not assessed' },
    },
    humanDecision: { status: 'Pending', finalAction: 'Awaiting simulated recommendation review' }, isDemo: true, sourceType: 'citizen',
  }, tag) as Incident
}

/** Repaired display/state for older browser snapshots; no operational facts are inferred. */
export function repairSandboxIncident(record: Incident): Incident {
  requireSandbox(record)
  if (record.provenance.origin !== 'legacy-browser') return record
  return tagRecord({ ...record, isDemo: true, confidence: null,
    status: record.status === 'dispatched' ? 'monitoring' : record.status,
    assignedTeam: 'Not available', teams: 0,
    lat: null,
    lng: null,
    coordinates: 'Unknown — not verified',
    evidence: record.evidence.map(e => ({ ...e, supports: false, reliability: 'Unknown' as const, verification: 'illustrative' as const })),
    aiRecommendation: { ...record.aiRecommendation, action: 'Review this sandbox description and record a simulated proposal decision.', reason: 'Legacy browser example; not model inference.', evidenceSummary: 'Unverified legacy sandbox notes.', confidence: 'Not available',
      resources: [], allocations: [], allocationFactors: { ...record.aiRecommendation.allocationFactors, availability: 'Not available', distanceLocation: 'Unknown', recommendedTeamCount: 'Not available', responsePriority: 'Not assessed' } },
    humanDecision: { ...record.humanDecision, actor: 'Demo user (not authenticated)', finalAction: 'Local simulated recommendation decision; no operational action.' },
  }, record) as Incident
}
