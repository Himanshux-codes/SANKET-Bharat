'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
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
 * Fixed, page-wide ambience: aurora wash, technical grid, drifting blurred
 * blobs and floating glowing particles. Pointer-events none throughout.
 *
 * Performance-adaptive:
 * - HIGH: full premium blobs + up to 16 particles
 * - MEDIUM: reduced blur + 10 particles
 * - LOW / MOBILE: static gradients only, no particles, no blobs
 * - OPERATIONAL routes: lightweight static background only
 */
export function AmbientBackground() {
  const reduce = useReducedMotion()
  const quality = usePerformanceTier()
  const visualMode = useVisualMode()
  const [particles, setParticles] = useState<Particle[]>([])

  // Generated on the client only so SSR and hydration stay identical.
  useEffect(() => {
    if (quality.particleCount > 0 && visualMode === 'rich') {
      setParticles(buildParticles(quality.particleCount))
    }
  }, [quality.particleCount, visualMode])

  const isOperational = visualMode === 'operational'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="aurora absolute inset-0 opacity-70" />
      <div className="grid-lines mask-fade-b absolute inset-0 opacity-45" />

      {/* Drifting blurred blobs — only on homepage rich mode with capable device */}
      {quality.blobsEnabled && !isOperational && (
        <>
          <motion.div
            className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-primary/25"
            style={{ filter: `blur(${quality.blobBlur}px)` }}
            animate={reduce ? undefined : { x: [0, 90, -30, 0], y: [0, 70, 130, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent/20"
            style={{ filter: `blur(${quality.blobBlur}px)` }}
            animate={reduce ? undefined : { x: [0, -110, -40, 0], y: [0, 90, -60, 0] }}
            transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#7c5cff]/20"
            style={{ filter: `blur(${quality.blobBlur}px)` }}
            animate={reduce ? undefined : { x: [0, 70, -80, 0], y: [0, -70, 40, 0] }}
            transition={{ duration: 44, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Floating glowing particles — only on homepage rich mode */}
      {!reduce &&
        !isOperational &&
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

      {/* Vignette to keep text legible over the ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,var(--background)_100%)] opacity-80" />
    </div>
  )
}
