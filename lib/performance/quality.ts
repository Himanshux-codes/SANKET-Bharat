'use client'

/**
 * Adaptive performance quality tiers for rendering decisions.
 *
 * Detects device capability conservatively using only well-supported browser
 * APIs. The result is used locally to scale visual effects — no private device
 * information is exposed or transmitted.
 */

export type QualityTier = 'high' | 'medium' | 'low'

export interface QualityConfig {
  tier: QualityTier

  // Globe
  globeDpr: [number, number]
  globeSphereSegments: number
  starCount: number
  maxArcs: number
  maxMarkers: number
  atmosphereEnabled: boolean

  // Ambient background
  particleCount: number
  blobsEnabled: boolean
  blobBlur: number

  // General
  enableCursorGlow: boolean
  enableScanAnimation: boolean
  backdropBlur: string
  /** When true, decorative continuous animations should be suppressed. */
  reducedMotion: boolean
}

// Quality configs per tier
const QUALITY_HIGH: QualityConfig = {
  tier: 'high',
  globeDpr: [1, 1.5],
  globeSphereSegments: 64,
  starCount: 800,
  maxArcs: Infinity,
  maxMarkers: Infinity,
  atmosphereEnabled: true,
  particleCount: 16,
  blobsEnabled: true,
  blobBlur: 100,
  enableCursorGlow: true,
  enableScanAnimation: true,
  backdropBlur: 'blur(12px)',
  reducedMotion: false,
}

const QUALITY_MEDIUM: QualityConfig = {
  tier: 'medium',
  globeDpr: [1, 1.25],
  globeSphereSegments: 56,
  starCount: 500,
  maxArcs: Infinity,
  maxMarkers: Infinity,
  atmosphereEnabled: true,
  particleCount: 10,
  blobsEnabled: true,
  blobBlur: 70,
  enableCursorGlow: true,
  enableScanAnimation: true,
  backdropBlur: 'blur(8px)',
  reducedMotion: false,
}

const QUALITY_LOW: QualityConfig = {
  tier: 'low',
  globeDpr: [1, 1],
  globeSphereSegments: 44,
  starCount: 200,
  maxArcs: 4,
  maxMarkers: 8,
  atmosphereEnabled: true,
  particleCount: 0,
  blobsEnabled: false,
  blobBlur: 0,
  enableCursorGlow: false,
  enableScanAnimation: false,
  backdropBlur: 'none',
  reducedMotion: false,
}

const CONFIGS: Record<QualityTier, QualityConfig> = {
  high: QUALITY_HIGH,
  medium: QUALITY_MEDIUM,
  low: QUALITY_LOW,
}

/**
 * Detects the quality tier once. Safe to call on the server (returns 'medium'
 * as a sensible default during SSR).
 */
export function detectQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 'medium'

  let score = 0

  // Cores: widely supported
  const cores = navigator.hardwareConcurrency ?? 4
  if (cores >= 8) score += 2
  else if (cores >= 4) score += 1

  // Device memory: Chrome/Edge only, silently ignored elsewhere
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (memory !== undefined) {
    if (memory >= 6) score += 2
    else if (memory >= 4) score += 1
    else score -= 1
  }

  // Screen DPR
  const dpr = window.devicePixelRatio ?? 1
  if (dpr >= 2.5) score -= 1 // high DPR with limited GPU = strain

  // Screen area
  const width = screen.width
  const height = screen.height
  const area = width * height
  if (area >= 1920 * 1080) score += 1
  else if (area < 720 * 1280) score -= 1

  // Touch / mobile heuristic
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isNarrow = window.innerWidth < 768
  if (isTouch && isNarrow) score -= 2
  else if (isTouch) score -= 1

  // Classify
  let tier: QualityTier
  if (score >= 3) tier = 'high'
  else if (score >= 0) tier = 'medium'
  else tier = 'low'

  return tier
}

/** Returns the full quality config for the detected (or given) tier. */
export function getQualityConfig(tier?: QualityTier): QualityConfig {
  const resolvedTier = tier ?? detectQualityTier()
  const config = { ...CONFIGS[resolvedTier] }

  // Override for prefers-reduced-motion regardless of tier
  if (typeof window !== 'undefined') {
    config.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  return config
}

/** Singleton: detect once and cache for the page lifetime. */
let _cached: QualityConfig | null = null

export function getCachedQuality(): QualityConfig {
  if (!_cached) _cached = getQualityConfig()
  return _cached
}
