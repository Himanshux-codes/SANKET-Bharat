'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useVisualMode } from '@/hooks/use-visual-mode'

/**
 * Soft radial light that trails the pointer.
 *
 * NOT mounted at all when:
 * - isMobile (viewport < 768px or pointer: coarse)
 * - prefers-reduced-motion
 * - operational route (dashboard, admin, live-map, etc.)
 *
 * Uses MotionValues for pointer tracking — no React state update per
 * mouse move. The isVisible flag flips once on first entry and once on leave.
 */
export function CursorGlow() {
  const isMobile = useIsMobile()
  const visualMode = useVisualMode()
  const reduce = useReducedMotion()
  const enabled = !isMobile && !reduce && visualMode !== 'operational'
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 26, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 180, damping: 26, mass: 0.4 })

  useEffect(() => {
    // Hard gates also apply when the route or motion preference changes.
    if (!enabled) return

    // Check fine pointer as a secondary guard (belt-and-suspenders with isMobile)
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return

    let isVisible = false
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!isVisible) {
        isVisible = true
        setVisible(true)
      }
    }
    const onLeave = () => {
      isVisible = false
      setVisible(false)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-30 h-[26rem] w-[26rem] rounded-full mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        background:
          'radial-gradient(circle, color-mix(in oklab, var(--glow) 22%, transparent) 0%, color-mix(in oklab, var(--accent) 8%, transparent) 42%, transparent 68%)',
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    />
  )
}
