import type { WorkflowMetadata } from '../data-mode'
/* ------------------------------------------------------------------ */
/*  Evaluation module types                                           */
/*  Completely isolated from the operational SANKET Bharat prototype  */
/* ------------------------------------------------------------------ */

/** Raw row from the uploaded CSV */
export interface CsvRow extends WorkflowMetadata {
  id: string
  keyword: string
  location: string
  text: string
  target: number // 0 | 1
}

/** What we pass to the classifier — NO target field (prevents label leakage) */
export interface ClassifierInput extends WorkflowMetadata {
  text: string
  keyword: string
  location: string
}

/** What the classifier returns */
export interface ClassifierOutput extends WorkflowMetadata {
  prediction: 0 | 1
  confidence: number
  reasoning: string
}

/** A single evaluated sample */
export interface EvaluatedRow extends WorkflowMetadata {
  id: string
  keyword: string
  location: string
  text: string
  actual: 0 | 1
  predicted: 0 | 1
  confidence: number
  reasoning: string
  result: 'TP' | 'TN' | 'FP' | 'FN'
}

/** Aggregate confusion-matrix counts */
export interface ConfusionCounts {
  tp: number
  tn: number
  fp: number
  fn: number
}

/** Full evaluation metrics */
export interface EvaluationMetrics extends ConfusionCounts, WorkflowMetadata {
  total: number
  correct: number
  incorrect: number
  accuracy: number
  precision: number
  recall: number
  f1: number
}
