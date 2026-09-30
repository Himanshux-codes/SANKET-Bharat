'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export type VisualMode = 'rich' | 'operational'

/**
 * The homepage gets the full premium visual treatment; operational routes
 * (dashboard, admin, live-map, etc.) use a lighter background to keep
 * the UI snappy and avoid stacking heavy effects on functional pages.
 */
const OPERATIONAL_PREFIXES = [
  '/dashboard',
  '/admin',
  '/live-map',
  '/ai-analysis',
  '/evaluation',
  '/report',
]

export function useVisualMode(): VisualMode {
  const pathname = usePathname()

  return useMemo(() => {
    if (OPERATIONAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return 'operational'
    }
    return 'rich'
  }, [pathname])
}
