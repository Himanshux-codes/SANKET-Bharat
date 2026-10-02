import type { WorkflowMetadata } from './data-mode'

/** Design-only contracts. No authority, transition engine, or transport is implemented. */
export type ReportState = 'received' | 'under_review' | 'verified' | 'rejected' | 'duplicate'
export type IncidentState = 'open' | 'assessed' | 'active' | 'contained' | 'resolved' | 'closed'
export type RecommendationState = 'generated' | 'under_review' | 'approved' | 'modified' | 'rejected'
export type AssignmentState = 'draft' | 'authorized' | 'sent' | 'delivered' | 'acknowledged' | 'active' | 'completed' | 'cancelled'
export type DecisionActor = { kind: 'human' | 'ai' | 'service'; subjectId: string; role: 'reviewer' | 'coordinator' | 'observer' | 'assistant'; jurisdictionId: string }
export interface TransitionRequest<S extends string> extends WorkflowMetadata {
  recordId: string
  from: S
  to: S
  expectedVersion: number
  actor: DecisionActor
  reason: string
  evidenceIds: string[]
}
export type DuplicateReportDecision = TransitionRequest<ReportState> & { to: 'duplicate'; canonicalCaseId: string }
export interface CommunicationEvent extends WorkflowMetadata {
  assignmentId: string
  type: 'sent' | 'delivered' | 'acknowledged'
  observedAt: string
  recipientId: string
  receiptReference: string
}
