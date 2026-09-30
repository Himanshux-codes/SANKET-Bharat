'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { usePerformanceTier } from '@/hooks/use-performance-tier'
import { useVisualMode } from '@/hooks/use-visual-mode'

type Particle = {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
  drift: number
  cyan: boolean
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2.6,
    duration: 12 + Math.random() * 18,
    delay: Math.random() * -24,
    drift: (Math.random() - 0.5) * 90,
    cyan: Math.random() > 0.62,
  }))
}

/**
 * Fixed page-wide ambience layer.
 *
 * Mobile (max-width: 767px | pointer: coarse):
 *   - Static aurora gradient only
 *   - Static technical grid
 *   - NO animated blobs
 *   - NO floating particles
 *   - NO filter/blur animations
 *
 * Desktop (FULL quality, rich visual mode):
 *   - Animated drifting blobs
 *   - Floating glowing particles (16 max)
 *   - Full blur radius
 *
 * Operational routes (dashboard, admin, etc.):
 *   - Static aurora + grid regardless of device
 */
export function AmbientBackground() {
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()
  const quality = usePerformanceTier()
  const visualMode = useVisualMode()
  const [particles, setParticles] = useState<Particle[]>([])

  const isOperational = visualMode === 'operational'
  // Never animate on mobile or operational routes
  const allowAnimations = !isMobile && !reduce && !isOperational

  // Generate particles client-side only; only when animations are allowed
  useEffect(() => {
    if (allowAnimations && quality.particleCount > 0) {
      setParticles(buildParticles(quality.particleCount))
    } else {
      setParticles([])
    }
  }, [allowAnimations, quality.particleCount])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Static aurora wash — always present, same colour on all devices */}
      <div className="aurora absolute inset-0 opacity-70" />

      {/* Static technical grid — light, no GPU cost */}
      <div className="grid-lines mask-fade-b absolute inset-0 opacity-45" />

      {/* Animated drifting blobs — desktop / rich mode only */}
      {allowAnimations && quality.blobsEnabled && (
        <>
          <motion.div
            className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-primary/25"
            style={{ filter: `blur(${quality.blobBlur}px)` }}
            animate={{ x: [0, 90, -30, 0], y: [0, 70, 130, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent/20"
            style={{ filter: `blur(${quality.blobBlur}px)` }}
            animate={{ x: [0, -110, -40, 0], y: [0, 90, -60, 0] }}
            transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#7c5cff]/20"
            style={{ filter: `blur(${quality.blobBlur}px)` }}
            animate={{ x: [0, 70, -80, 0], y: [0, -70, 40, 0] }}
            transition={{ duration: 44, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Static blobs for desktop rich mode when reduced motion is on */}
      {!allowAnimations && !isMobile && !isOperational && quality.blobsEnabled && (
        <>
          <div
            className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-primary/20"
            style={{ filter: `blur(${quality.blobBlur}px)` }}
          />
          <div
            className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent/15"
            style={{ filter: `blur(${quality.blobBlur}px)` }}
          />
        </>
      )}

      {/* Floating glowing particles — desktop + rich mode only */}
      {allowAnimations &&
        particles.map((p) => (
          <motion.span
            key={p.id}
            className={`absolute rounded-full ${
              p.cyan
                ? 'bg-accent shadow-[0_0_10px_2px_var(--accent)]'
                : 'bg-glow shadow-[0_0_10px_2px_var(--glow)]'
            }`}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -140, 0],
              x: [0, p.drift, 0],
              opacity: [0, 0.75, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Vignette — always present for legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,var(--background)_100%)] opacity-80" />
    </div>
  )
}
