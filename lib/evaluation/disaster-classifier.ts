import { deriveMetadata } from '../data-mode'
/* ------------------------------------------------------------------ */
/*  Baseline Rule-Based Disaster Classifier                          */
/*  Prototype Evaluation Only — NOT a validated ML model             */
/* ------------------------------------------------------------------ */

import type { ClassifierInput, ClassifierOutput } from './types'

/**
 * Curated keyword sets, ordered roughly by specificity.
 * Broad words like "help", "damage", "dead" are intentionally omitted
 * to avoid trivially high false-positive rates.
 */
const DISASTER_KEYWORDS = [
  'flood',
  'flooding',
  'flooded',
  'earthquake',
  'wildfire',
  'fire',
  'landslide',
  'storm',
  'cyclone',
  'hurricane',
  'tornado',
  'tsunami',
  'evacuation',
  'evacuated',
  'collapsed',
  'collapse',
  'explosion',
  'disaster',
  'emergency',
  'casualties',
  'injured',
  'trapped',
  'destruction',
  'devastation',
  'typhoon',
  'drought',
  'blizzard',
  'avalanche',
  'volcanic',
  'eruption',
  'aftershock',
  'seismic',
  'mudslide',
  'hailstorm',
  'derailment',
  'wreckage',
  'rescue',
  'survivor',
  'fatalities',
  'death toll',
  'missing persons',
] as const

/** Precompiled patterns for O(n·m) scan over text tokens. */
const KEYWORD_PATTERNS = DISASTER_KEYWORDS.map((kw) => ({
  term: kw,
  regex: new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
}))

/**
 * classifyDisasterText
 *
 * Baseline rule-based classifier for the evaluation harness.
 * Returns prediction (0|1), a simple confidence score, and a short explanation.
 *
 * This does NOT receive the `target` label — isolation is enforced at the type level.
 */
export function classifyDisasterText(input: ClassifierInput): ClassifierOutput {
  const { text, keyword } = input
  const combinedText = `${text} ${keyword}`.toLowerCase()

  const matched: string[] = []
  for (const { term, regex } of KEYWORD_PATTERNS) {
    if (regex.test(combinedText)) {
      matched.push(term)
    }
  }

  if (matched.length === 0) {
    return {
      ...deriveMetadata([input], input.provenance.sourceId + '/rule'),
      prediction: 0,
      confidence: 0.65,
      reasoning: 'No disaster-related keywords detected.',
    }
  }

  // Simple confidence heuristic: more matches → higher confidence, capped at 0.95
  const confidence = Math.min(0.95, 0.55 + matched.length * 0.1)

  return {
    ...deriveMetadata([input], input.provenance.sourceId + '/rule'),
    prediction: 1,
    confidence: parseFloat(confidence.toFixed(2)),
    reasoning: `Matched: ${matched.slice(0, 5).join(', ')}${matched.length > 5 ? ` (+${matched.length - 5} more)` : ''}.`,
  }
}
