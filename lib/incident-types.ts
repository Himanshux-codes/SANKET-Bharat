export type IncidentSeverity = 'critical' | 'high' | 'moderate' | 'low'
export type IncidentKind = 'flood' | 'fire' | 'quake' | 'cyclone' | 'landslide' | 'other'
export type IncidentStatus = 'escalating' | 'dispatched' | 'monitoring' | 'contained' | 'pending' | 'resolved'
export type VerificationStatus = 'Verified' | 'Pending' | 'Rejected' | 'Needs Human Review' | 'Likely Genuine' | 'Duplicate' | 'Suspicious'
export type ReportClassification = 'Likely Genuine' | 'Duplicate' | 'Suspicious' | 'Needs Human Review'

export type EvidenceItem = {
  source: string
  timestamp: string
  location: string
  summary: string
  reliability: 'High' | 'Medium' | 'Low'
  supports: boolean
}

export type ResourceAllocation = {
  resource: string
  target: string
  reason: string
}

export type AllocationFactors = {
  severity?: string
  affected?: string
  hazardType?: string
  locationPriority?: string
  distanceLocation?: string
  availability?: string
  responsePriority?: string
  recommendedTeamCount?: string | number
  keyFactors?: string[]
}

export type AiRecommendation = {
  action: string
  reason: string
  evidenceSummary: string
  confidence: string
  impact: string
  resources: string[]
  allocations?: ResourceAllocation[]
  allocationFactors?: AllocationFactors
}

export type HumanDecision = {
  status: 'Pending' | 'Approved' | 'Rejected' | 'Modified'
  finalAction: string
  timestamp?: string
  actor?: string
  reason?: string
  isOverride?: boolean
}

export type Incident = {
  id: string
  reportId?: string
  city: string
  state: string
  location: string
  lat: number
  lng: number
  coordinates?: string
  kind: IncidentKind
  disasterType: string
  severity: IncidentSeverity
  status: IncidentStatus
  verificationStatus: VerificationStatus
  confidence: number
  description: string
  source: string
  updated: string
  duplicateCount: number
  duplicateMatch?: string
  assignedTeam: string
  teams: number
  affected: string
  reporterName?: string
  reporterContact?: string
  fileName?: string
  factors: string[]
  evidence: EvidenceItem[]
  evidenceSource?: string
  aiRecommendation: AiRecommendation
  humanDecision: HumanDecision
  /** True when this incident was promoted from the Evaluation Lab demo sandbox */
  isDemo?: boolean
  /** Origin type: 'dataset' for evaluation-promoted, undefined for live */
  sourceType?: 'dataset' | 'citizen' | 'sensor'
  /** Original CSV row ID, used to prevent duplicate promotion */
  originalDatasetId?: string
}

export type AuditEntry = {
  id: string
  incident: string
  action: string
  actor: string
  actorType: 'AI' | 'Human'
  timestamp: string
  previousStatus: string
  newStatus: string
  aiRecommendation: string
  humanDecision: string
  reason: string
  isOverride?: boolean
}

export type ResourceItem = {
  label: string
  value: string
  detail: string
  iconName: string
  tone: 'cyan' | 'green' | 'blue' | 'amber' | 'violet'
}

export type AiAdvisory = {
  id?: string
  incidentId: string
  severity: IncidentSeverity
  message: string
  time: string
}
