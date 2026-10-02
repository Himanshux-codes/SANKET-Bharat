import { deriveMetadata, requireSandbox } from '../data-mode'
/* ------------------------------------------------------------------ */
/*  Evaluation engine — computes metrics from predictions vs actuals  */
/*  Completely isolated; no coupling to IncidentContext or live data  */
/* ------------------------------------------------------------------ */

import type {
  CsvRow,
  EvaluatedRow,
  EvaluationMetrics,
  ClassifierInput,
  ClassifierOutput,
  ConfusionCounts,
} from './types'

type ClassifierFn = (input: ClassifierInput) => ClassifierOutput

/**
 * Run the classifier over every CSV row and compute evaluation metrics.
 *
 * IMPORTANT:  The `target` field is stripped before the row reaches the
 *             classifier.  It is used ONLY afterwards for metric comparison.
 */
export function evaluateClassifier(
  rows: CsvRow[],
  classify: ClassifierFn,
): { metrics: EvaluationMetrics; results: EvaluatedRow[] } {
  const results: EvaluatedRow[] = rows.map((row) => {
    // ---- Strip label before classification (prevents label leakage) ----
    const input: ClassifierInput = {
      ...deriveMetadata([row], row.provenance.sourceId + '/input'),
      text: row.text,
      keyword: row.keyword,
      location: row.location,
    }

    requireSandbox(row)
    if (row.dataMode !== 'evaluation') throw new Error('Evaluation records required')
    const output: ClassifierOutput = classify(input)

    const actual = row.target as 0 | 1
    const predicted = output.prediction

    let result: EvaluatedRow['result']
    if (actual === 1 && predicted === 1) result = 'TP'
    else if (actual === 0 && predicted === 0) result = 'TN'
    else if (actual === 0 && predicted === 1) result = 'FP'
    else result = 'FN'

    return {
      ...deriveMetadata([row], row.provenance.sourceId + '/result'),
      id: row.id,
      keyword: row.keyword,
      location: row.location,
      text: row.text,
      actual,
      predicted,
      confidence: output.confidence,
      reasoning: output.reasoning,
      result,
    }
  })

  const counts: ConfusionCounts = { tp: 0, tn: 0, fp: 0, fn: 0 }
  for (const r of results) {
    if (r.result === 'TP') counts.tp++
    else if (r.result === 'TN') counts.tn++
    else if (r.result === 'FP') counts.fp++
    else counts.fn++
  }

  const total = results.length
  const correct = counts.tp + counts.tn
  const incorrect = counts.fp + counts.fn

  const accuracy = total > 0 ? correct / total : 0
  const precision =
    counts.tp + counts.fp > 0 ? counts.tp / (counts.tp + counts.fp) : 0
  const recall =
    counts.tp + counts.fn > 0 ? counts.tp / (counts.tp + counts.fn) : 0
  const f1 =
    precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0

  const metrics: EvaluationMetrics = {
    ...deriveMetadata(rows.length ? rows : [{ dataMode: 'evaluation', isSimulation: true, provenance: { origin: 'derived', sourceId: 'empty-evaluation', parents: [] } }], 'evaluation-metrics'),
    ...counts,
    total,
    correct,
    incorrect,
    accuracy,
    precision,
    recall,
    f1,
  }

  return { metrics, results }
}
