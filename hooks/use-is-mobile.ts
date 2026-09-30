'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true when the viewport is narrower than 768px OR the primary
 * pointer is coarse (touch-first device).
 *
 * Detection strategy:
 * - max-width: 767px  — standard mobile breakpoint
 * - pointer: coarse   — covers touch screens that may be wider (tablets)
 *
 * SSR-safe: returns false during server render and hydration to match the
 * desktop-first HTML. Updates to the real value on first client paint.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const narrowMq = window.matchMedia('(max-width: 767px)')
    const coarseMq = window.matchMedia('(pointer: coarse)')

    const compute = () => setIsMobile(narrowMq.matches || coarseMq.matches)

    compute()
    narrowMq.addEventListener('change', compute)
    coarseMq.addEventListener('change', compute)

    return () => {
      narrowMq.removeEventListener('change', compute)
      coarseMq.removeEventListener('change', compute)
    }
  }, [])

  return isMobile
}

/**
 * Derives the two quality levels used throughout the app.
 *
 * FULL   → desktop / laptop (wide viewport + fine pointer)
 * REDUCED → mobile / touch device
 *
 * Also logs the active mode to the console in development so you can verify
 * the correct mode activates at each breakpoint.
 */
export type EffectsLevel = 'FULL' | 'REDUCED'

export function useReducedEffects(): EffectsLevel {
  const isMobile = useIsMobile()
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = () => setPrefersReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const level: EffectsLevel = isMobile || prefersReduced ? 'REDUCED' : 'FULL'

  // Dev-only indicator — stripped by bundler in production builds
  if (process.env.NODE_ENV === 'development') {
    // Using a stable log key avoids spamming on every render
    // eslint-disable-next-line no-console
    console.debug(`[SANKET] Performance mode: ${level}`)
  }

  return level
}
