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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- One-time client hardware snapshot preserves the server/hydration default.
    setConfig(getQualityConfig())
  }, [])

  return config
}
