'use client'

import { useSyncExternalStore } from 'react'

function subscribeMobile(onChange: () => void) {
  const narrow = window.matchMedia('(max-width: 767px)')
  const coarse = window.matchMedia('(pointer: coarse)')
  narrow.addEventListener('change', onChange)
  coarse.addEventListener('change', onChange)
  return () => {
    narrow.removeEventListener('change', onChange)
    coarse.removeEventListener('change', onChange)
  }
}

function mobileSnapshot() {
  return window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(pointer: coarse)').matches
}

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function motionSnapshot() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches }
function serverSnapshot() { return false }

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
  return useSyncExternalStore(subscribeMobile, mobileSnapshot, serverSnapshot)
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
  const prefersReduced = useSyncExternalStore(subscribeMotion, motionSnapshot, serverSnapshot)

  const level: EffectsLevel = isMobile || prefersReduced ? 'REDUCED' : 'FULL'

  // Dev-only indicator — stripped by bundler in production builds
  if (process.env.NODE_ENV === 'development') {
    // Using a stable log key avoids spamming on every render
    console.debug(`[SANKET] Performance mode: ${level}`)
  }

  return level
}
