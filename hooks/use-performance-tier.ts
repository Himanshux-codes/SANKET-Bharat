'use client'

import { useEffect, useState } from 'react'
import { type QualityConfig, getQualityConfig } from '@/lib/performance/quality'

/**
 * React hook returning the adaptive quality config. During SSR and initial
 * hydration a 'medium' default is used; the real detection runs after mount.
 */
export function usePerformanceTier(): QualityConfig {
  const [config, setConfig] = useState<QualityConfig>(() => getQualityConfig('medium'))

  useEffect(() => {
    setConfig(getQualityConfig())
  }, [])

  return config
}
