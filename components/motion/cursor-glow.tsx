'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useVisualMode } from '@/hooks/use-visual-mode'

/**
 * Soft light that trails the pointer. Disabled on:
 * - touch devices
 * - small screens (< 768px)
 * - prefers-reduced-motion users
 * - operational routes (dashboard, admin, live-map, etc.)
 *
 * Uses MotionValues and direct transforms — no React state updates per
 * mouse movement (only the initial visibility toggle).
 */
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const visualMode = useVisualMode()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 26, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 180, damping: 26, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tooSmall = window.innerWidth < 768
    if (!fine || calm || tooSmall) return
    setEnabled(true)

    // Track visibility without repeated state updates: only flip once.
    let isVisible = false

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
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
  }, [x, y])

  // Don't render on operational routes or if device doesn't qualify
  if (!enabled || visualMode === 'operational') return null

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
