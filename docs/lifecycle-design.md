# Lifecycle design — foundation phase

This is a future workflow contract, not an implemented operational workflow. The current application is a browser-only demo. A local save is not a server/authority receipt. No assignment, sending, delivery, or responder acknowledgment is implemented.

## State machines and transition guards

| Record | From | To | Required actor and evidence |
|---|---|---|---|
| Report | new | received | Intake creates a durable receipt in a future service; today only a local demo record is created. |
| Report | received | under_review | Reviewer starts review. |
| Report | under_review | verified | Authorized reviewer, explicit reason, source references. Does not dispatch or approve a recommendation. |
| Report | under_review | rejected | Authorized reviewer, reason; retain original. Does not contain an incident. |
| Report | under_review | duplicate | Authorized reviewer, reason, same-mode canonical case ID; retain original and prevent cyclic/self links. |
| Report | verified/rejected/duplicate | under_review | Authorized reviewer reopens with reason/new evidence; preserve previous decision. |
| Incident | new | open | Human-established canonical case, linked reports, mode and jurisdiction. |
| Incident | open | assessed | Authorized reviewer records assessment and evidence. |
| Incident | assessed | active | Coordinator records actual ongoing incident; not inferred from dispatch. |
| Incident | active/assessed | contained | Authorized human records hazard-control evidence. |
| Incident | contained | resolved | Authorized human records resolution evidence. |
| Incident | resolved | closed | Authorized human completes case record/closure requirements. |
| Incident | contained/resolved/closed | assessed | Explicit reopening reason and versioned audit event. |
| Recommendation | new | generated | Rule/model or human creates advisory with immutable input/output/source versions. |
| Recommendation | generated | under_review | Reviewer starts proposal review. |
| Recommendation | under_review | approved/rejected | Authorized human, rationale, exact proposal version. Approval is not assignment authorization. |
| Recommendation | under_review | modified | Human saves a revised proposal; retain original version. |
| Recommendation | modified | under_review | Review revision before approval. |
| Assignment | new | draft | Coordinator prepares recipient/resources and links to case. No sending. |
| Assignment | draft | authorized | Authorized coordinator explicitly authorizes exact assignment version. AI identity prohibited. |
| Assignment | authorized | sent | Actual transport accepts an authorized message; record transport evidence. Not delivery. |
| Assignment | sent | delivered | Actual provider delivery receipt; do not infer from browser connectivity. |
| Assignment | sent/delivered | acknowledged | Explicit identified recipient acknowledgment; retain independent delivery status (it may remain unknown). |
| Assignment | acknowledged | active | Identified recipient/coordinator confirms work started. |
| Assignment | active | completed | Identified recipient and coordinator record completion evidence. |
| Assignment | draft/authorized/sent/delivered/acknowledged/active | cancelled | Permitted human, reason, cancellation communication separately tracked. Never erase prior send history. |

Delivery receipt and acknowledgment are distinct events even when acknowledgment arrives first. A completed assignment is not proof of incident resolution. Revisions create new versions; no silent overwrite of approved proposals or authorized assignments.

## Universal guards

- Identity, role, jurisdiction, same data mode, expected record version, and human reason must be enforced by a future server. Browser checks are not security authorization.
- AI/service actors may generate advice, never verify/reject reports, contain/close incidents, approve recommendations, or authorize assignments.
- Demo/evaluation data cannot enter pilot queues, evidence, metrics, exports, or communication. Pilot is currently disabled, including correctly tagged pilot inputs.
- Preserve original reports and provenance. A duplicate requires a canonical link; a bare label is insufficient.
- No report decision changes incident or assignment state. No recommendation decision changes assignment state.
- Communication has independent send/delivery/acknowledgment history. A local action or browser-online event proves none of them.

## Existing violations and phase disposition

| Function/component | Violation | Foundation-phase disposition |
|---|---|---|
| IncidentProvider.verifyQueueItem | Approval set dispatched; rejection set contained; report review overwrote recommendation decision. Bare duplicate label had no canonical link. | Remove coupled lifecycle/recommendation changes. Require a valid canonical link for duplicate action. Local review remains illustrative, not authorized. |
| IncidentProvider.updateAssignedTeam | Arbitrary string set dispatched; audit invented field acknowledgment. | Disable operational assignment helper until proper workflow exists. |
| IncidentProvider.updateIncidentStatus | Arbitrary transitions without actor/version/reason. | Disable helper until full lifecycle implementation. |
| IncidentProvider.updateAiRecommendationDecision | Canned authority identity, no authorization/version guards; modification treated as final. | Label local simulated decision; retain provenance. Full version/actor/transition enforcement remains pending. |
| AiRecommendationApproval | Stale same-ID state; approving after modification restored original; pending placeholder could replace the proposal. | Derive committed decisions from provider props; approval uses the displayed proposal/revision. Local edit drafts are discarded when their source revision changes. Full revision workflow pending. |
| EvidenceExplainability | Generic decisions reused recommendation decision store. | Explicitly label recommendation-only demo actions. Report decision remains separate. |
| ReportVerificationWorkflow / admin quick actions | Repeatable bare decisions and duplicate marking. | Show sandbox mode; duplicate requires canonical ID or is blocked. Repeat/version guards pending. |
| addReport / syncPendingReports | Local receipt labelled coordination/sync; no authoritative commit. | Honest local staging wording and provenance; no operational receipt. |
| SocialSourceSimulation / addEvidenceItem | Generated message recorded as verified/corroborated evidence. | Simulation-only same-mode notes; not supporting evidence; never permitted for pilot. |
| Initial seed lifecycle/audit data | Fictional dispatched/team/authority facts looked real. | Explicit seeded demo provenance and visible scenario labels; no dispatch state or operational claims. |

This document precedes changes to lifecycle actions. This phase does not implement authentication, a server, canonical multi-report cases, assignment authorization, transport, field acknowledgment, complete state machines, or concurrency controls.

## Remaining deviations in current sandbox code

- `IncidentProvider` still represents reports and cases using `Incident` objects in two arrays. Seed queue aliases are not a separate report/case relationship model.
- `verifyQueueItem`, `ReportVerificationWorkflow` and admin quick actions can jump directly to a review label and repeat decisions. They do not enforce `received → under_review`, role/jurisdiction, evidence requirements, record versions, or reopening history. They only record simulated local review.
- `updateAiRecommendationDecision`, `AiRecommendationApproval` and `EvidenceExplainability` still overwrite a simulated decision without immutable proposal revisions or mandatory review of a modification. The generic override does not author a full revision. No assignment is produced.
- `addAuditEntry` writes editable browser history. It is not authoritative decision attribution, a transactional event log, or proof of an actor's authorization.
- Legacy `IncidentStatus`/`VerificationStatus` strings remain for display compatibility; the new unions are design contracts, not a migrated workflow. Assignment helpers refuse execution and no communication transport exists.

These deviations must be resolved in a future trusted workflow before any consequential use. Labelled demo actions do not satisfy the proposed production transition guards.
