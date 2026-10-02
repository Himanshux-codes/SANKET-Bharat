export type DataMode = 'demo' | 'evaluation' | 'pilot'
export type DataOrigin = 'seed' | 'local-form' | 'offline-local' | 'dataset' | 'social-simulation' | 'derived' | 'legacy-browser' | 'illustration'
export interface SourceReference {
  dataMode: DataMode
  sourceId: string
  origin: DataOrigin
  isSimulation: boolean
}
export interface WorkflowMetadata {
  dataMode: DataMode
  isSimulation: boolean
  provenance: { origin: DataOrigin; sourceId: string; parents: SourceReference[] }
}
export const APP_DATA_MODE = 'demo' as const
export const PILOT_ENABLED = false as const

export function metadata(dataMode: DataMode, origin: DataOrigin, sourceId: string): WorkflowMetadata {
  return { dataMode, isSimulation: dataMode !== 'pilot', provenance: { origin, sourceId, parents: [] } }
}
export function deriveMetadata(parents: WorkflowMetadata[], sourceId: string): WorkflowMetadata {
  if (!parents.length || parents.some(p => p.dataMode !== parents[0].dataMode)) throw new Error('Cross-mode derivation is prohibited')
  return {
    dataMode: parents[0].dataMode,
    isSimulation: parents.some(p => p.isSimulation),
    provenance: { origin: 'derived', sourceId, parents: parents.flatMap(p => [
      { dataMode: p.dataMode, sourceId: p.provenance.sourceId, origin: p.provenance.origin, isSimulation: p.isSimulation },
      ...p.provenance.parents,
    ]) },
  }
}
/** Deeply tag records, including recommendations, allocations and evidence. Never relabel tagged children. */
export type DeepTagged<T> = T extends Array<infer V> ? DeepTagged<V>[] : T extends object ? { [K in keyof T as K extends keyof WorkflowMetadata ? never : K]: DeepTagged<T[K]> } & WorkflowMetadata : T
export function tagRecord<T>(value: T, tag: WorkflowMetadata): DeepTagged<T> {
  function walk(v: unknown): unknown {
    if (Array.isArray(v)) return v.map(walk)
    if (!v || typeof v !== 'object' || v instanceof Blob) return v
    const obj = v as Record<string, unknown>
    if ('dataMode' in obj && obj.dataMode !== tag.dataMode) throw new Error('Cross-mode child record')
    const own = 'dataMode' in obj ? obj as unknown as WorkflowMetadata : tag
    if (!own.provenance || !Array.isArray(own.provenance.parents) || !own.provenance.sourceId ||
      (own.dataMode !== 'pilot' && own.isSimulation !== true) ||
      own.provenance.parents.some(p => p.dataMode !== tag.dataMode || (p.dataMode !== 'pilot' && !p.isSimulation))) throw new Error('Invalid provenance')
    const fields = Object.fromEntries(Object.entries(obj).filter(([k]) => !['dataMode','isSimulation','provenance'].includes(k)).map(([k,v]) => [k,walk(v)]))
    return { ...fields, dataMode: own.dataMode, isSimulation: own.isSimulation, provenance: own.provenance }
  }
  return walk(value) as DeepTagged<T>
}
export type WithoutMetadata<T> = T extends Array<infer V> ? WithoutMetadata<V>[] : T extends object ? { [K in keyof T as K extends keyof WorkflowMetadata ? never : K]: WithoutMetadata<T[K]> } : T

export function isSandboxRecord(record: WorkflowMetadata): boolean {
  return (record.dataMode === 'demo' || record.dataMode === 'evaluation') && record.isSimulation === true &&
    !!record.provenance?.sourceId && Array.isArray(record.provenance.parents) && record.provenance.parents.every(p => p.dataMode === record.dataMode && p.isSimulation)
}
export function requireSandbox(record: WorkflowMetadata): void {
  if (!isSandboxRecord(record)) throw new Error('Pilot mode is not implemented; sandbox records only')
}
export function selectMode<T extends WorkflowMetadata>(records: T[], mode: DataMode): T[] {
  if (mode === 'pilot') throw new Error('Pilot queues and metrics are unavailable')
  return records.filter(r => r.dataMode === mode && isSandboxRecord(r))
}
export function canAttachEvidence(owner: WorkflowMetadata, evidence: WorkflowMetadata): boolean {
  return isSandboxRecord(owner) && isSandboxRecord(evidence) && owner.dataMode === evidence.dataMode
}
/** Communications are intentionally unavailable, including for correctly tagged pilot records. */
export function canCommunicate(record: WorkflowMetadata): false { void record; return false }

/** Legacy browser data was never operational. Refuse pilot/foreign descendants instead of laundering them. */
export function restoreSandbox<T extends WorkflowMetadata>(values: unknown): T[] {
  if (!Array.isArray(values)) return []
  return values.flatMap((value, index) => {
    if (!value || typeof value !== 'object') return []
    const raw = value as Record<string, unknown>
    if ('dataMode' in raw && raw.dataMode !== 'demo' && raw.dataMode !== 'evaluation') return []
    const mode = raw.dataMode === 'evaluation' || (raw.isDemo && raw.originalDatasetId) ? 'evaluation' : 'demo'
    const tag = 'dataMode' in raw ? raw as unknown as WorkflowMetadata : metadata(mode, 'legacy-browser', String(raw.id || raw.label || index))
    try { const result = tagRecord(value, tag) as T; requireSandbox(result); return [result] } catch { return [] }
  })
}
